import type { SirePurchaseRecord } from "@softbq/sire";

import type { ContasisPurchaseFieldName } from "../fields/purchaseFields.js";
import { contasisPurchaseFieldNames } from "../fields/purchaseFields.js";
import type { ContasisPurchaseRow } from "../mappers/purchaseMapper.js";
import type { ContasisValidationSeverity } from "./salesValidator.js";

export type ContasisPurchaseValidationIssue = {
  code: string;
  field?: ContasisPurchaseFieldName;
  message: string;
  rowNumber: number;
  severity: ContasisValidationSeverity;
};

export type ContasisPurchaseValidationResult = {
  issues: ContasisPurchaseValidationIssue[];
  rows: ContasisPurchaseRow[];
  valid: boolean;
};

const requiredStringFields: ContasisPurchaseFieldName[] = [
  "ffechadoc",
  "ccoddoc",
  "cserie",
  "cnumero",
  "ccodenti",
  "cdesenti",
  "ctipdoc",
  "ccodruc",
  "crazsoc",
  "ccodclas",
  "cmreg",
  "ffechaven2",
  "ccond",
  "ccodpago"
];

const numericFields: ContasisPurchaseFieldName[] = [
  "nbase1",
  "nigv1",
  "nbase2",
  "nigv2",
  "nbase3",
  "nigv3",
  "nina",
  "nisc",
  "nicbper",
  "nexo",
  "ntots",
  "ntc",
  "ndolar",
  "nresp",
  "nporre",
  "nimpres",
  "nigv",
  "nperdenre",
  "nbaseres"
];

const dateFields: ContasisPurchaseFieldName[] = [
  "ffechadoc",
  "ffechaven",
  "ffecre",
  "freffec",
  "ffechaven2",
  "ffecre2"
];

export function validateContasisPurchaseRows(input: {
  purchases?: SirePurchaseRecord[];
  rows: ContasisPurchaseRow[];
}): ContasisPurchaseValidationResult {
  const issues: ContasisPurchaseValidationIssue[] = [];

  input.rows.forEach((row, index) => {
    const rowNumber = index + 2;

    for (const field of contasisPurchaseFieldNames) {
      if (!(field in row)) {
        issues.push({
          code: "contasis_purchase_field_missing",
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
          code: "contasis_purchase_required_value_missing",
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
          code: "contasis_purchase_invalid_number",
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
          code: "contasis_purchase_invalid_date",
          field,
          message: `Fecha invalida en ${field}.`,
          rowNumber,
          severity: "error"
        });
      }
    }

    if (!["S", "D"].includes(String(row.cmreg))) {
      issues.push({
        code: "contasis_purchase_invalid_currency",
        field: "cmreg",
        message: "Moneda Contasis debe ser S o D.",
        rowNumber,
        severity: "error"
      });
    }

    const purchase = input.purchases?.[index];

    if (purchase?.detraction) {
      issues.push({
        code: "contasis_purchase_detraction_present",
        message: "La compra tiene detraccion; revisar manualmente en MVP.",
        rowNumber,
        severity: "warning"
      });
    }
  });

  return {
    issues,
    rows: input.rows,
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
