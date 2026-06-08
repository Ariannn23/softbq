import type { FastifyReply, FastifyRequest } from "fastify";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import {
  detectSireFileType,
  parseSireTxt,
  validateSirePurchases,
  validateSireSales,
} from "@softbq/sire";

export async function validateConversionController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const parts = request.parts();

  let clientId = "";
  let period = "";
  let salesFile: { name: string; path: string; size: number } | null = null;
  let purchasesFile: { name: string; path: string; size: number } | null = null;

  // Ensure upload directory exists
  const uploadDir = path.resolve(process.cwd(), "../../storage/uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  for await (const part of parts) {
    if (part.type === "file") {
      const fieldname = part.fieldname; // 'sales' or 'purchases'
      const uniqueName = `${Date.now()}_${crypto.randomBytes(4).toString("hex")}_${part.filename}`;
      const filepath = path.join(uploadDir, uniqueName);
      
      const buffer = await part.toBuffer();
      await fs.writeFile(filepath, buffer);

      const fileData = {
        name: part.filename,
        path: filepath,
        size: buffer.length
      };

      if (fieldname === "sales") {
        salesFile = fileData;
      } else if (fieldname === "purchases") {
        purchasesFile = fileData;
      }
    } else {
      if (part.fieldname === "clientId") {
        clientId = part.value as string;
      } else if (part.fieldname === "period") {
        period = part.value as string;
      }
    }
  }

  if (!clientId || !period) {
    return reply.code(400).send({ message: "El cliente y el periodo son obligatorios." });
  }

  if (!salesFile && !purchasesFile) {
    return reply.code(400).send({ message: "Debe enviar al menos un archivo (ventas o compras)." });
  }

  const response: any = {
    clientId,
    period,
    sales: null,
    purchases: null
  };

  const processFile = async (
    fileInfo: { name: string; path: string; size: number },
    expectedType: "sales" | "purchases"
  ) => {
    try {
      const content = await fs.readFile(fileInfo.path, "utf-8");
      const rawTable = parseSireTxt(content);
      const detectedType = detectSireFileType(rawTable.headers);

      let validation;
      if (expectedType === "sales") {
        validation = validateSireSales(rawTable);
      } else {
        validation = validateSirePurchases(rawTable);
      }

      let totalBase = 0;
      let totalIgv = 0;

      if (expectedType === "sales") {
        totalBase = (validation.records as any[]).reduce((acc, r) => acc + (r.taxableBase || 0), 0);
        totalIgv = (validation.records as any[]).reduce((acc, r) => acc + (r.igv || 0), 0);
      } else {
        totalBase = (validation.records as any[]).reduce((acc, r) => acc + (r.taxableBaseDg || 0) + (r.taxableBaseDgng || 0) + (r.taxableBaseDng || 0), 0);
        totalIgv = (validation.records as any[]).reduce((acc, r) => acc + (r.igvDg || 0) + (r.igvDgng || 0) + (r.igvDng || 0), 0);
      }
      
      const criticalErrors = validation.observations.filter(o => o.severity === "error");
      const warnings = validation.observations.filter(o => o.severity === "warning");
      const infos = validation.observations.filter(o => o.severity === "info");

      return {
        fileName: fileInfo.name,
        filePath: fileInfo.path,
        sizeBytes: fileInfo.size,
        detectedType,
        expectedType,
        isValidType: detectedType === expectedType || detectedType === "unknown",
        summary: {
          recordsCount: validation.summary.recordsCount,
          totalBase: Math.round(totalBase * 100) / 100,
          totalIgv: Math.round(totalIgv * 100) / 100,
          totalCp: validation.summary.totalCp,
          validRows: validation.summary.validRows,
          invalidRows: validation.summary.invalidRows,
          detectedRucs: validation.summary.rucs,
          detectedPeriods: validation.summary.periods
        },
        observations: {
          critical: criticalErrors,
          warnings: warnings,
          info: infos
        }
      };
    } catch (error: any) {
      return {
        fileName: fileInfo.name,
        filePath: fileInfo.path,
        sizeBytes: fileInfo.size,
        error: error.message || "Error procesando el archivo"
      };
    }
  };

  if (salesFile) {
    response.sales = await processFile(salesFile, "sales");
  }

  if (purchasesFile) {
    response.purchases = await processFile(purchasesFile, "purchases");
  }

  return reply.send(response);
}
