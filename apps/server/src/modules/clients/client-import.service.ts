import type { ClientImportMapping } from "@softbq/excel";
import {
  analyzeClientsWorkbook,
  inferClientImportMapping,
  previewClientsWorkbook,
  readClientsWorkbook
} from "@softbq/excel";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

import type { AuthenticatedUser } from "../auth/auth.service.js";
import {
  createClient,
  findClientByRuc,
  updateClient
} from "./clients.repository.js";
import { ClientServiceError } from "./clients.service.js";

type ImportSession = {
  id: string;
  fileName: string;
  filePath: string;
  createdAt: number;
};

const sessions = new Map<string, ImportSession>();
const tempImportDir = resolve(process.cwd(), "storage/temp/client-imports");

function ensureAdmin(user: AuthenticatedUser | undefined) {
  if (!user) {
    throw new ClientServiceError("Sesion requerida.", 401);
  }

  if (user.role !== "admin") {
    throw new ClientServiceError("Solo admin puede importar clientes.", 403);
  }
}

export async function analyzeClientImport(input: {
  user: AuthenticatedUser | undefined;
  fileName: string;
  buffer: Buffer;
}) {
  ensureAdmin(input.user);

  const extension = extname(input.fileName).toLowerCase();

  if (extension !== ".xlsx") {
    throw new ClientServiceError("Por ahora la importacion acepta archivos .xlsx.", 400);
  }

  await mkdir(tempImportDir, { recursive: true });

  const importId = randomUUID();
  const filePath = resolve(tempImportDir, `${importId}.xlsx`);
  await writeFile(filePath, input.buffer);

  sessions.set(importId, {
    id: importId,
    fileName: input.fileName,
    filePath,
    createdAt: Date.now()
  });

  const analysis = await analyzeClientsWorkbook(input.buffer);

  return {
    importId,
    fileName: input.fileName,
    sheets: analysis.sheets.map((sheet) => ({
      ...sheet,
      inferredMapping: inferClientImportMapping(sheet.headers, sheet.sampleRows)
    }))
  };
}

export async function previewClientImport(input: {
  user: AuthenticatedUser | undefined;
  importId: string;
  sheetName: string;
  mapping: ClientImportMapping;
}) {
  ensureAdmin(input.user);

  const session = await getImportSession(input.importId);
  const buffer = await readFile(session.filePath);

  return previewClientsWorkbook({
    buffer,
    sheetName: input.sheetName,
    mapping: input.mapping,
    limit: 5
  });
}

export async function confirmClientImport(input: {
  user: AuthenticatedUser | undefined;
  importId: string;
  sheetName: string;
  mapping: ClientImportMapping;
}) {
  ensureAdmin(input.user);

  const session = await getImportSession(input.importId);
  const buffer = await readFile(session.filePath);
  const parsed = await readClientsWorkbook({
    buffer,
    sheetName: input.sheetName,
    mapping: input.mapping
  });
  const seenRucs = new Set<string>();
  let created = 0;
  let updated = 0;
  let omitted = parsed.invalidRows;
  let errors = parsed.issues.length;

  for (const row of parsed.rows) {
    if (seenRucs.has(row.ruc)) {
      omitted += 1;
      continue;
    }

    seenRucs.add(row.ruc);

    const existingClient = await findClientByRuc(row.ruc);
    const timestamp = new Date().toISOString();

    if (existingClient) {
      await updateClient({
        id: existingClient.id,
        values: {
          ...row,
          updatedAt: timestamp
        }
      });
      updated += 1;
    } else {
      await createClient({
        ...row,
        active: true,
        createdAt: timestamp,
        updatedAt: timestamp
      });
      created += 1;
    }
  }

  return {
    created,
    updated,
    omitted,
    errors,
    totalRows: parsed.totalRows,
    importedRows: created + updated,
    issues: parsed.issues.slice(0, 50)
  };
}

async function getImportSession(importId: string): Promise<ImportSession> {
  const session = sessions.get(importId);

  if (!session) {
    throw new ClientServiceError("Importacion no encontrada o expirada.", 404);
  }

  return session;
}
