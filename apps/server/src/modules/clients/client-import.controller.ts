import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import {
  analyzeClientImport,
  confirmClientImport,
  previewClientImport
} from "./client-import.service.js";
import { ClientServiceError } from "./clients.service.js";

const mappingSchema = z.record(z.string(), z.string()).transform((value) => value);

const previewSchema = z.object({
  sheetName: z.string().trim().min(1),
  mapping: mappingSchema
});

const paramsSchema = z.object({
  importId: z.string().uuid()
});

function handleImportError(error: unknown, reply: FastifyReply) {
  if (error instanceof ClientServiceError) {
    return reply.code(error.statusCode).send({ message: error.message });
  }

  throw error;
}

export async function analyzeClientImportController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const file = await request.file();

  if (!file) {
    return reply.code(400).send({ message: "Archivo requerido." });
  }

  try {
    return reply.send({
      import: await analyzeClientImport({
        user: request.user,
        fileName: file.filename,
        buffer: await file.toBuffer()
      })
    });
  } catch (error) {
    return handleImportError(error, reply);
  }
}

export async function previewClientImportController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = paramsSchema.parse(request.params);
  const body = previewSchema.safeParse(request.body);

  if (!body.success) {
    return reply.code(400).send({ message: "Datos de importacion invalidos." });
  }

  try {
    return reply.send({
      preview: await previewClientImport({
        user: request.user,
        importId: params.importId,
        sheetName: body.data.sheetName,
        mapping: body.data.mapping
      })
    });
  } catch (error) {
    return handleImportError(error, reply);
  }
}

export async function confirmClientImportController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = paramsSchema.parse(request.params);
  const body = previewSchema.safeParse(request.body);

  if (!body.success) {
    return reply.code(400).send({ message: "Datos de importacion invalidos." });
  }

  try {
    return reply.send({
      summary: await confirmClientImport({
        user: request.user,
        importId: params.importId,
        sheetName: body.data.sheetName,
        mapping: body.data.mapping
      })
    });
  } catch (error) {
    return handleImportError(error, reply);
  }
}
