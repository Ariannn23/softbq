import fs from "node:fs/promises";
import path from "node:path";
import {
  db,
  clients,
  conversions,
  conversionFiles,
  conversionObservations,
} from "@softbq/db";
import { eq } from "drizzle-orm";

import {
  parseSireTxt,
  detectSireFileType,
  validateSireSales,
  validateSirePurchases,
} from "@softbq/sire";

import {
  mapSalesToContasis,
  mapPurchasesToContasis,
  type ContasisSalesClientConfig,
  type ContasisPurchaseClientConfig,
} from "@softbq/contasis";

import {
  writeContasisSalesExcel,
  writeContasisPurchasesExcel,
} from "@softbq/excel";

export interface ConversionJobData {
  clientId: number;
  period: string;
  userId: number;
  salesFile?: { name: string; path: string; size: number };
  purchasesFile?: { name: string; path: string; size: number };
}

export async function processConversionJob(data: ConversionJobData) {
  const outputDir = path.resolve(process.cwd(), "../../storage/outputs");
  await fs.mkdir(outputDir, { recursive: true });

  // 1. Fetch client info
  const clientData = await db
    .select()
    .from(clients)
    .where(eq(clients.id, data.clientId))
    .get();

  if (!clientData) {
    throw new Error(`Cliente no encontrado: ${data.clientId}`);
  }

  // 2. Create base conversion record
  const [conversionRecord] = await db
    .insert(conversions)
    .values({
      clientId: data.clientId,
      period: data.period,
      createdBy: data.userId,
      status: "draft",
    })
    .returning();

  if (!conversionRecord) {
    throw new Error("No se pudo crear el registro de conversión");
  }

  let salesStatus = "pending";
  let purchasesStatus = "pending";
  let salesRecordsCount = 0;
  let purchasesRecordsCount = 0;
  let salesTotal = 0;
  let purchasesTotal = 0;

  let salesFileId: number | undefined;
  let purchasesFileId: number | undefined;

  // Process Sales
  if (data.salesFile) {
    try {
      salesStatus = "validated";
      const content = await fs.readFile(data.salesFile.path, "utf-8");
      const rawTable = parseSireTxt(content);
      const validation = validateSireSales(rawTable);

      const clientConfig: ContasisSalesClientConfig = {
        contasisEntityCode: clientData.contasisEntityCode,
        contasisEntityDescription: clientData.contasisEntityDescription,
        defaultPaymentMethod: clientData.defaultPaymentMethod,
        defaultIgvPercent: clientData.defaultIgvPercent,
        defaultCondition: clientData.defaultCondition,
      };

      const mappedRows = mapSalesToContasis({
        sales: validation.records,
        client: clientConfig,
      });

      const excelResult = await writeContasisSalesExcel({
        ruc: clientData.ruc,
        period: data.period,
        rows: mappedRows,
        outputDir,
      });

      salesStatus = "generated";
      salesRecordsCount = validation.summary.recordsCount;
      salesTotal = validation.records.reduce((acc, r) => acc + (r.taxableBase || 0), 0);

      // Save file record
      const [fileRecord] = await db
        .insert(conversionFiles)
        .values({
          conversionId: conversionRecord.id,
          fileType: "sales",
          originalName: data.salesFile.name,
          storagePath: data.salesFile.path,
          outputPath: excelResult.outputPath,
          status: "generated",
          recordsCount: salesRecordsCount,
          totalAmount: salesTotal,
        })
        .returning();

      if (!fileRecord) throw new Error("No se pudo crear el registro de archivo");

      salesFileId = fileRecord.id;

      // Save observations
      const observationsToInsert = validation.observations.map((obs) => ({
        conversionId: conversionRecord.id,
        fileId: fileRecord.id,
        severity: obs.severity,
        code: obs.code,
        message: obs.message,
        rowNumber: obs.rowNumber,
        fieldName: obs.field,
      }));

      if (observationsToInsert.length > 0) {
        await db.insert(conversionObservations).values(observationsToInsert);
      }
    } catch (error: any) {
      salesStatus = "failed";
      const [fileRecord] = await db
        .insert(conversionFiles)
        .values({
          conversionId: conversionRecord.id,
          fileType: "sales",
          originalName: data.salesFile.name,
          storagePath: data.salesFile.path,
          status: "failed",
        })
        .returning();

      if (!fileRecord) throw new Error("No se pudo crear el registro de archivo");

      salesFileId = fileRecord.id;

      await db.insert(conversionObservations).values({
        conversionId: conversionRecord.id,
        fileId: fileRecord.id,
        severity: "error",
        code: "SYSTEM_ERROR",
        message: error.message || "Error inesperado al procesar ventas",
      });
    }
  }

  // Process Purchases
  if (data.purchasesFile) {
    try {
      purchasesStatus = "validated";
      const content = await fs.readFile(data.purchasesFile.path, "utf-8");
      const rawTable = parseSireTxt(content);
      const validation = validateSirePurchases(rawTable);

      const clientConfig: ContasisPurchaseClientConfig = {
        contasisEntityCode: clientData.contasisEntityCode,
        contasisEntityDescription: clientData.contasisEntityDescription,
        defaultPaymentMethod: clientData.defaultPaymentMethod,
        defaultIgvPercent: clientData.defaultIgvPercent,
        defaultCondition: clientData.defaultCondition,
        defaultGoodsServicesClassification: "0",
      };

      const mappedRows = mapPurchasesToContasis({
        purchases: validation.records,
        client: clientConfig,
      });

      const excelResult = await writeContasisPurchasesExcel({
        ruc: clientData.ruc,
        period: data.period,
        rows: mappedRows,
        outputDir,
      });

      purchasesStatus = "generated";
      purchasesRecordsCount = validation.summary.recordsCount;
      purchasesTotal = validation.records.reduce((acc, r) => acc + (r.taxableBaseDg || 0) + (r.taxableBaseDgng || 0) + (r.taxableBaseDng || 0), 0);

      // Save file record
      const [fileRecord] = await db
        .insert(conversionFiles)
        .values({
          conversionId: conversionRecord.id,
          fileType: "purchases",
          originalName: data.purchasesFile.name,
          storagePath: data.purchasesFile.path,
          outputPath: excelResult.outputPath,
          status: "generated",
          recordsCount: purchasesRecordsCount,
          totalAmount: purchasesTotal,
        })
        .returning();

      if (!fileRecord) throw new Error("No se pudo crear el registro de archivo");

      purchasesFileId = fileRecord.id;

      // Save observations
      const observationsToInsert = validation.observations.map((obs) => ({
        conversionId: conversionRecord.id,
        fileId: fileRecord.id,
        severity: obs.severity,
        code: obs.code,
        message: obs.message,
        rowNumber: obs.rowNumber,
        fieldName: obs.field,
      }));

      if (observationsToInsert.length > 0) {
        await db.insert(conversionObservations).values(observationsToInsert);
      }
    } catch (error: any) {
      purchasesStatus = "failed";
      const [fileRecord] = await db
        .insert(conversionFiles)
        .values({
          conversionId: conversionRecord.id,
          fileType: "purchases",
          originalName: data.purchasesFile.name,
          storagePath: data.purchasesFile.path,
          status: "failed",
        })
        .returning();

      if (!fileRecord) throw new Error("No se pudo crear el registro de archivo");

      purchasesFileId = fileRecord.id;

      await db.insert(conversionObservations).values({
        conversionId: conversionRecord.id,
        fileId: fileRecord.id,
        severity: "error",
        code: "SYSTEM_ERROR",
        message: error.message || "Error inesperado al procesar compras",
      });
    }
  }

  const finalStatus =
    salesStatus === "failed" || purchasesStatus === "failed"
      ? "failed"
      : "generated";

  // Update conversion record
  await db
    .update(conversions)
    .set({
      status: finalStatus,
      salesStatus: salesStatus === "pending" ? null : (salesStatus as any),
      purchasesStatus: purchasesStatus === "pending" ? null : (purchasesStatus as any),
      salesRecordsCount,
      purchasesRecordsCount,
      salesTotal,
      purchasesTotal,
    })
    .where(eq(conversions.id, conversionRecord.id));

  return {
    conversionId: conversionRecord.id,
    sales: data.salesFile ? {
      fileId: salesFileId,
      fileName: data.salesFile.name,
      recordsCount: salesRecordsCount,
      sizeBytes: data.salesFile.size,
    } : null,
    purchases: data.purchasesFile ? {
      fileId: purchasesFileId,
      fileName: data.purchasesFile.name,
      recordsCount: purchasesRecordsCount,
      sizeBytes: data.purchasesFile.size,
    } : null,
  };
}
