import fs from "node:fs/promises";
import path from "node:path";

import { contasisPurchaseFields, type ContasisPurchaseRow } from "@softbq/contasis";
import ExcelJS from "exceljs";

import type { WriteContasisExcelOutput } from "./writeContasisSalesExcel.js";

export interface WriteContasisPurchasesExcelInput {
  ruc: string;
  period: string;
  rows: ContasisPurchaseRow[];
  outputDir: string;
}

export async function writeContasisPurchasesExcel(
  input: WriteContasisPurchasesExcelInput
): Promise<WriteContasisExcelOutput> {
  const { ruc, period, rows, outputDir } = input;

  await fs.mkdir(outputDir, { recursive: true });

  const fileName = `COMPRAS_CONTASIS_${ruc}_${period}.xlsx`;
  const outputPath = path.join(outputDir, fileName);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Registro_compras");

  // Row 1: Technical fields
  worksheet.addRow(["", ...contasisPurchaseFields]);

  // Row 2+: Data
  for (const row of rows) {
    const rowValues = contasisPurchaseFields.map((field) => {
      const key = field.split(" ")[0] as keyof ContasisPurchaseRow;
      const type = field.split(" ")[1];
      let value: any = row[key];

      // Convert date strings (DD/MM/YYYY) to actual Date objects for Excel
      if (type === "D" && typeof value === "string" && value.length > 0) {
        const parts = value.split("/");
        if (parts.length === 3) {
          value = new Date(Date.UTC(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])));
        }
      }

      return value;
    });
    // Add empty column A
    worksheet.addRow([null, ...rowValues]);
  }

  // Formatting strings properly
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header

    row.eachCell((cell, colNumber) => {
      if (colNumber === 1) return;

      const field = contasisPurchaseFields[colNumber - 2];
      const value = cell.value;
      if (field) {
        const key = field.split(" ")[0];
        const type = field.split(" ")[1];
        if (type && type.startsWith("C(")) {
          cell.numFmt = "@";
          if (typeof cell.value === "number") {
            cell.value = cell.value.toString();
          }
        } else if (type === "D") {
          cell.numFmt = "dd/mm/yyyy";
        } else if (type && type.startsWith("N(")) {
          // Check for decimals
          if (key === "ndolar") {
            cell.numFmt = "0.00000";
          } else if (type.includes(",2)")) {
            cell.numFmt = "#,##0.00";
          } else if (type.includes(",6)") || type.includes("10,6")) {
            cell.numFmt = "#,##0.00000";
          }
        }
      }
    });
  });

  await workbook.xlsx.writeFile(outputPath);

  return {
    outputPath,
    rowsWritten: rows.length,
  };
}
