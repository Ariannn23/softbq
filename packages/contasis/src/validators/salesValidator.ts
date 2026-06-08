import type { ContasisSalesFieldName } from "../fields/salesFields.js";
import { contasisSalesFieldNames } from "../fields/salesFields.js";
import type { ContasisSalesRow } from "../mappers/salesMapper.js";

export type ContasisValidationSeverity = "error" | "warning";

export type ContasisSalesValidationIssue = {
  code: string;
  field?: ContasisSalesFieldName;
  message: string;
  rowNumber: number;
  severity: ContasisValidationSeverity;
};

export type ContasisSalesValidationResult = {
  issues: ContasisSalesValidationIssue[];
  rows: ContasisSalesRow[];
  valid: boolean;
};

const requiredStringFields: ContasisSalesFieldName[] = [
  "ffechadoc",
  "ccoddoc",
  "cserie",
  "cnumero",
  "ccodenti",
  "cdesenti",
  "ctipdoc",
  "ccodruc",
  "crazsoc",
  "cmreg",
  "ffechaven2",
  "ccond",
  "ccodpago"
];

const numericFields: ContasisSalesFieldName[] = [
  "nbase2",
  "nbase1",
  "nexo",
  "nina",
  "nisc",
  "nigv1",
  "nicbpers",
  "nbase3",
  "ntots",
  "ntc",
  "ndolar",
  "nresp",
  "nporre",
  "nimpres",
  "nigv",
  "nperdenre",
  "nbaseres",
  "nflgtransgrat"
];

const dateFields: ContasisSalesFieldName[] = [
  "ffechadoc",
  "ffechaven",
  "freffec",
  "ffechaven2",
  "ffecre"
];

export function validateContasisSalesRows(
  rows: ContasisSalesRow[]
): ContasisSalesValidationResult {
  const issues: ContasisSalesValidationIssue[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    for (const field of contasisSalesFieldNames) {
      if (!(field in row)) {
        issues.push({
          code: "contasis_sales_field_missing",
          field,
          message: `Falta el campo tecnico ${field}.`,
          rowNumber,
          severity: "error"
        });
      }
    }

    for (const field of requiredStringFields) {
      if (!String(row[field] ?? "").trim()) {
        issues.push({
          code: "contasis_sales_required_value_missing",
          field,
          message: `Campo obligatorio vacio: ${field}.`,
          rowNumber,
          severity: "error"
        });
      }
    }

    for (const field of numericFields) {
      const value = row[field];

      if (typeof value !== "number" || !Number.isFinite(value)) {
        issues.push({
          code: "contasis_sales_invalid_number",
          field,
          message: `El campo ${field} debe ser numerico.`,
          rowNumber,
          severity: "error"
        });
      }
    }

    for (const field of dateFields) {
      const value = String(row[field] ?? "");

      if (value && !isValidDate(value)) {
        issues.push({
          code: "contasis_sales_invalid_date",
          field,
          message: `Fecha invalida en ${field}.`,
          rowNumber,
          severity: "error"
        });
      }
    }

    if (!["S", "D"].includes(String(row.cmreg))) {
      issues.push({
        code: "contasis_sales_invalid_currency",
        field: "cmreg",
        message: "Moneda Contasis debe ser S o D.",
        rowNumber,
        severity: "error"
      });
    }
  });

  return {
    issues,
    rows,
    valid: issues.every((issue) => issue.severity !== "error")
  };
}

function isValidDate(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match && !isoMatch) {
    return false;
  }

  const [, first, second, third] = match ?? isoMatch ?? [];
  const year = match ? Number(third) : Number(first);
  const month = Number(second);
  const day = match ? Number(first) : Number(third);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}
