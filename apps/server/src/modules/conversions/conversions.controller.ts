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
  const uploadDir = process.env.SOFTBQ_STORAGE_PATH 
    ? path.resolve(process.env.SOFTBQ_STORAGE_PATH, "uploads")
    : path.resolve(process.cwd(), "../../storage/uploads");
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

export async function generateConversionController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { processConversionJob } = await import("../../jobs/conversions.job.js");
  const data = request.body as any;
  const user = (request as any).user;

  try {
    const conversionId = await processConversionJob({
      clientId: Number(data.clientId),
      period: data.period,
      userId: user.id,
      salesFile: data.salesFile,
      purchasesFile: data.purchasesFile,
    });

    return reply.send({ success: true, conversionId });
  } catch (error: any) {
    return reply.code(500).send({ message: error.message || "Error al generar conversión" });
  }
}

export async function downloadConversionFileController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id, fileId } = request.params as any;
  const { db, conversionFiles } = await import("@softbq/db");
  const { eq, and } = await import("drizzle-orm");

  const [fileRecord] = await db
    .select()
    .from(conversionFiles)
    .where(
      and(
        eq(conversionFiles.id, Number(fileId)),
        eq(conversionFiles.conversionId, Number(id))
      )
    )
    .limit(1);

  if (!fileRecord || !fileRecord.outputPath) {
    return reply.code(404).send({ message: "Archivo no encontrado" });
  }

  try {
    const buffer = await fs.readFile(fileRecord.outputPath);
    const fileName = path.basename(fileRecord.outputPath);

    reply.header("Content-Disposition", `attachment; filename="${fileName}"`);
    reply.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    return reply.send(buffer);
  } catch (err) {
    return reply.code(500).send({ message: "Error al leer el archivo físico" });
  }
}

export async function getConversionsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { db, conversions, clients, users, conversionFiles } = await import("@softbq/db");
  const { eq, and, desc, count, sql, asc } = await import("drizzle-orm");

  const query = request.query as any;
  const page = parseInt(query.page || "1", 10);
  const limit = parseInt(query.limit || "10", 10);
  const offset = (page - 1) * limit;

  let dbQuery = db
    .select({
      id: conversions.id,
      createdAt: conversions.createdAt,
      status: conversions.status,
      period: conversions.period,
      salesRecordsCount: conversions.salesRecordsCount,
      purchasesRecordsCount: conversions.purchasesRecordsCount,
      salesStatus: conversions.salesStatus,
      purchasesStatus: conversions.purchasesStatus,
      clientName: clients.businessName,
      clientRuc: clients.ruc,
      userName: users.username,
    })
    .from(conversions)
    .innerJoin(clients, eq(conversions.clientId, clients.id))
    .innerJoin(users, eq(conversions.createdBy, users.id));

  const conditions = [];

  if (query.period) {
    conditions.push(eq(conversions.period, query.period));
  }
  if (query.clientId && query.clientId !== "all") {
    conditions.push(eq(conversions.clientId, Number(query.clientId)));
  }
  if (query.status && query.status !== "all") {
    conditions.push(eq(conversions.status, query.status));
  }
  if (query.fileType === "sales") {
    conditions.push(sql`${conversions.salesRecordsCount} > 0`);
  } else if (query.fileType === "purchases") {
    conditions.push(sql`${conversions.purchasesRecordsCount} > 0`);
  }

  const finalCondition = conditions.length > 0 ? and(...conditions) : undefined;

  const results = await dbQuery
    .where(finalCondition)
    .orderBy(asc(clients.businessName), desc(conversions.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ totalCount: count() })
    .from(conversions)
    .innerJoin(clients, eq(conversions.clientId, clients.id))
    .innerJoin(users, eq(conversions.createdBy, users.id))
    .where(finalCondition);

  const totalCount = countResult[0]?.totalCount || 0;

  const conversionIds = results.map((r) => r.id);
  let filesMap = new Map();

  if (conversionIds.length > 0) {
    const files = await db
      .select()
      .from(conversionFiles)
      .where(sql`${conversionFiles.conversionId} IN ${conversionIds}`);

    for (const f of files) {
      if (!filesMap.has(f.conversionId)) {
        filesMap.set(f.conversionId, []);
      }
      let sizeKb = 0;
      if (f.outputPath) {
        try {
          const stats = await fs.stat(f.outputPath);
          sizeKb = Math.round(stats.size / 1024);
        } catch (e) {}
      }
      filesMap.get(f.conversionId).push({
        id: f.id,
        type: f.fileType,
        status: f.status,
        sizeKb,
      });
    }
  }

  const mappedResults = results.map((r) => {
    const cFiles = filesMap.get(r.id) || [];
    const salesFile = cFiles.find((f: any) => f.type === "sales");
    const purchasesFile = cFiles.find((f: any) => f.type === "purchases");

    return {
      ...r,
      files: {
        sales: salesFile ? { id: salesFile.id, status: salesFile.status, sizeKb: salesFile.sizeKb } : null,
        purchases: purchasesFile ? { id: purchasesFile.id, status: purchasesFile.status, sizeKb: purchasesFile.sizeKb } : null,
      }
    };
  });

  return reply.send({
    data: mappedResults,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  });
}
