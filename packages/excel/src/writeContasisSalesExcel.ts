import fs from "node:fs/promises";
import path from "node:path";

import { contasisSalesFields, type ContasisSalesRow } from "@softbq/contasis";
import ExcelJS from "exceljs";

export interface WriteContasisSalesExcelInput {
  ruc: string;
  period: string;
  rows: ContasisSalesRow[];
  outputDir: string;
}

export interface WriteContasisExcelOutput {
  outputPath: string;
  rowsWritten: number;
}

export async function writeContasisSalesExcel(
  input: WriteContasisSalesExcelInput
): Promise<WriteContasisExcelOutput> {
  const { ruc, period, rows, outputDir } = input;

  await fs.mkdir(outputDir, { recursive: true });

  const fileName = `VENTAS_CONTASIS_${ruc}_${period}.xlsx`;
  const outputPath = path.join(outputDir, fileName);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Registro_ventas");

  // Row 1: Technical fields (Column A is empty)
  worksheet.addRow(["", ...contasisSalesFields]);

  // Row 2+: Data
  for (const row of rows) {
    const rowValues = contasisSalesFields.map((field) => {
      const key = field.split(" ")[0] as keyof ContasisSalesRow;
      const type = field.split(" ")[1];
      let value: any = row[key];

      // Convert date strings (DD/MM/YYYY) to actual Date objects for Excel
      if (type === "D" && typeof value === "string" && value.length > 0) {
        const parts = value.split("/");
        if (parts.length === 3) {
          // Use Date.UTC to avoid timezone shifts in Excel
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
      // Column A is colNumber 1, so field is at colNumber - 2
      if (colNumber === 1) return;

      const field = contasisSalesFields[colNumber - 2];
      if (field) {
        const key = field.split(" ")[0] as keyof ContasisSalesRow;
        const type = field.split(" ")[1];
        if (type && type.startsWith("C(")) {
          cell.numFmt = "@";
          if (typeof cell.value === "number") {
            cell.value = cell.value.toString();
          }
        } else if (type === "D") {
          cell.numFmt = "dd/mm/yyyy";
        } else if (type && type.startsWith("N(")) {
          // Force cell.numFmt to 5 decimals for ndolar
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
