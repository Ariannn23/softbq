import { buildHeaderIndex, findHeaderIndex } from "./headers.js";
import { detectSireFileType } from "./detectSireFileType.js";
import type {
  SireObservation,
  SireRawTable,
  SireSalesRecord,
  SireSalesSummary,
  SireSalesValidation
} from "./types.js";

const expectedSalesColumnCount = 40;
const amountTolerance = 0.02;

const salesColumns = {
  ruc: ["ruc"],
  businessName: ["razon social"],
  period: ["periodo"],
  carSunat: ["car sunat"],
  issueDate: ["fecha de emision", "fecha emision"],
  dueDate: ["fecha vcto/pago", "fecha vencimiento", "fecha pago"],
  documentType: ["tipo cp/doc.", "tipo cp/doc", "tipo cp"],
  series: ["serie del cdp", "serie"],
  number: ["nro cp o doc. nro inicial (rango)", "nro cp o doc", "numero"],
  customerDocumentType: ["tipo doc identidad"],
  customerDocumentNumber: ["nro doc identidad"],
  customerName: ["apellidos nombres/ razon social", "apellidos nombres/razon social"],
  exportValue: ["valor facturado exportacion"],
  taxableBase: ["bi gravada"],
  igv: ["igv / ipm", "igv/ipm"],
  exemptAmount: ["mto exonerado"],
  unaffectedAmount: ["mto inafecto"],
  isc: ["isc"],
  icbper: ["icbper"],
  otherTaxes: ["otros tributos"],
  total: ["total cp"],
  currency: ["moneda"],
  exchangeRate: ["tipo cambio"],
  modifiedIssueDate: ["fecha emision doc modificado", "fecha emision documento modificado"],
  modifiedDocumentType: ["tipo cp modificado"],
  modifiedSeries: ["serie cp modificado"],
  modifiedNumber: ["nro cp modificado"],
  status: ["est. comp", "estado comp"],
  freeOperationsValue: ["valor op gratuitas", "valor operaciones gratuitas"]
} as const;

type SalesField = keyof typeof salesColumns;

const requiredSalesFields: SalesField[] = [
  "ruc",
  "businessName",
  "period",
  "carSunat",
  "issueDate",
  "documentType",
  "series",
  "number",
  "customerDocumentType",
  "customerDocumentNumber",
  "customerName",
  "exportValue",
  "taxableBase",
  "igv",
  "exemptAmount",
  "unaffectedAmount",
  "isc",
  "icbper",
  "otherTaxes",
  "total",
  "currency",
  "exchangeRate"
];

export function validateSireSales(table: SireRawTable): SireSalesValidation {
  const observations: SireObservation[] = [];

  if (table.headers.length === 0) {
    observations.push({
      code: "sales_header_missing",
      message: "El archivo no contiene encabezado.",
      severity: "error"
    });
  }

  if (table.headers.length > 0 && table.headers.length !== expectedSalesColumnCount) {
    observations.push({
      code: "sales_header_column_count",
      message: `El encabezado contiene ${table.headers.length} columnas; se esperaban ${expectedSalesColumnCount}.`,
      severity: "warning"
    });
  }

  const headerIndex = buildHeaderIndex(table.headers);
  const mappedColumns = mapSalesColumns(headerIndex);

  for (const field of requiredSalesFields) {
    if (mappedColumns[field] === undefined) {
      observations.push({
        code: "sales_required_column_missing",
        field,
        message: `No se encontro la columna obligatoria para ${field}.`,
        severity: "error"
      });
    }
  }

  const records: SireSalesRecord[] = [];
  const carSunatOccurrences = new Map<string, number>();
  const periods = new Set<string>();
  const rucs = new Set<string>();

  table.rows.forEach((row, index) => {
    const rowNumber = index + 2;

    if (row.length !== expectedSalesColumnCount) {
      observations.push({
        code: "sales_row_column_count",
        message: `La fila contiene ${row.length} columnas; se esperaban ${expectedSalesColumnCount}.`,
        rowNumber,
        severity: "error"
      });
    }

    const record = normalizeSalesRow(row, mappedColumns);
    const rowObservations = validateSalesRecord(record, rowNumber);

    observations.push(...rowObservations);

    if (rowObservations.some((observation) => observation.severity === "error")) {
      return;
    }

    records.push(record);
    periods.add(record.period);
    rucs.add(record.ruc);

    if (record.carSunat) {
      carSunatOccurrences.set(
        record.carSunat,
        (carSunatOccurrences.get(record.carSunat) ?? 0) + 1
      );
    }
  });

  if (periods.size > 1) {
    observations.push({
      code: "sales_period_not_unique",
      message: "El archivo contiene mas de un periodo.",
      severity: "error"
    });
  }

  if (rucs.size > 1) {
    observations.push({
      code: "sales_ruc_not_unique",
      message: "El archivo contiene mas de un RUC emisor.",
      severity: "error"
    });
  }

  const carSunatDuplicates = [...carSunatOccurrences.entries()]
    .filter(([, count]) => count > 1)
    .map(([carSunat]) => carSunat);

  for (const carSunat of carSunatDuplicates) {
    observations.push({
      code: "sales_car_sunat_duplicate",
      field: "carSunat",
      message: `CAR SUNAT duplicado: ${carSunat}.`,
      severity: "error"
    });
  }

  return {
    fileType: detectSireFileType(table.headers),
    observations,
    records,
    summary: buildSalesSummary({
      carSunatDuplicates,
      observations,
      records,
      totalRows: table.rows.length
    })
  };
}

export function normalizeSales(table: SireRawTable): SireSalesRecord[] {
  return validateSireSales(table).records;
}

function mapSalesColumns(headerIndex: Map<string, number>): Partial<Record<SalesField, number>> {
  const mappedColumns: Partial<Record<SalesField, number>> = {};

  for (const field of Object.keys(salesColumns) as SalesField[]) {
    mappedColumns[field] = findHeaderIndex(headerIndex, [...salesColumns[field]]);
  }

  return mappedColumns;
}

function normalizeSalesRow(
  row: string[],
  mappedColumns: Partial<Record<SalesField, number>>
): SireSalesRecord {
  const value = (field: SalesField) => readField(row, mappedColumns[field]);

  return {
    ruc: onlyDigits(value("ruc")),
    businessName: value("businessName"),
    period: onlyDigits(value("period")),
    carSunat: value("carSunat"),
    issueDate: value("issueDate"),
    dueDate: value("dueDate"),
    documentType: value("documentType"),
    series: value("series"),
    number: value("number"),
    customerDocumentType: value("customerDocumentType"),
    customerDocumentNumber: value("customerDocumentNumber"),
    customerName: value("customerName"),
    exportValue: parseAmount(value("exportValue")),
    taxableBase: parseAmount(value("taxableBase")),
    igv: parseAmount(value("igv")),
    exemptAmount: parseAmount(value("exemptAmount")),
    unaffectedAmount: parseAmount(value("unaffectedAmount")),
    isc: parseAmount(value("isc")),
    icbper: parseAmount(value("icbper")),
    otherTaxes: parseAmount(value("otherTaxes")),
    total: parseAmount(value("total")),
    currency: value("currency"),
    exchangeRate: parseAmount(value("exchangeRate")),
    modifiedIssueDate: value("modifiedIssueDate"),
    modifiedDocumentType: value("modifiedDocumentType"),
    modifiedSeries: value("modifiedSeries"),
    modifiedNumber: value("modifiedNumber"),
    status: value("status"),
    freeOperationsValue: parseAmount(value("freeOperationsValue"))
  };
}

function validateSalesRecord(record: SireSalesRecord, rowNumber: number): SireObservation[] {
  const observations: SireObservation[] = [];

  if (!/^\d{11}$/.test(record.ruc)) {
    observations.push({
      code: "sales_invalid_ruc",
      field: "ruc",
      message: "El RUC emisor debe tener 11 digitos.",
      rowNumber,
      severity: "error"
    });
  }

  if (!/^\d{6}$/.test(record.period)) {
    observations.push({
      code: "sales_invalid_period",
      field: "period",
      message: "El periodo debe tener formato YYYYMM.",
      rowNumber,
      severity: "error"
    });
  }

  for (const [field, value] of [
    ["businessName", record.businessName],
    ["carSunat", record.carSunat],
    ["issueDate", record.issueDate],
    ["documentType", record.documentType],
    ["series", record.series],
    ["number", record.number],
    ["customerName", record.customerName],
    ["currency", record.currency]
  ] as const) {
    if (!value) {
      observations.push({
        code: "sales_required_value_missing",
        field,
        message: `Campo obligatorio vacio: ${field}.`,
        rowNumber,
        severity: "error"
      });
    }
  }

  if (record.issueDate && !isValidDate(record.issueDate)) {
    observations.push({
      code: "sales_invalid_issue_date",
      field: "issueDate",
      message: "Fecha de emision invalida.",
      rowNumber,
      severity: "error"
    });
  }

  if (record.dueDate && !isValidDate(record.dueDate)) {
    observations.push({
      code: "sales_invalid_due_date",
      field: "dueDate",
      message: "Fecha Vcto/Pago invalida.",
      rowNumber,
      severity: "error"
    });
  }

  if (record.modifiedIssueDate && !isValidDate(record.modifiedIssueDate)) {
    observations.push({
      code: "sales_invalid_modified_issue_date",
      field: "modifiedIssueDate",
      message: "Fecha de emision modificada invalida.",
      rowNumber,
      severity: "error"
    });
  }

  const expectedTotal =
    record.exportValue +
    record.taxableBase +
    record.igv +
    record.exemptAmount +
    record.unaffectedAmount +
    record.isc +
    record.icbper +
    record.otherTaxes;

  if (Math.abs(roundMoney(expectedTotal) - roundMoney(record.total)) > amountTolerance) {
    observations.push({
      code: "sales_total_mismatch",
      field: "total",
      message: "Total CP no cuadra con la suma de importes.",
      rowNumber,
      severity: "error"
    });
  }

  return observations;
}

function buildSalesSummary(input: {
  carSunatDuplicates: string[];
  observations: SireObservation[];
  records: SireSalesRecord[];
  totalRows: number;
}): SireSalesSummary {
  return {
    carSunatDuplicates: input.carSunatDuplicates,
    currencies: [...new Set(input.records.map((record) => record.currency).filter(Boolean))],
    invalidRows: input.totalRows - input.records.length,
    periods: [...new Set(input.records.map((record) => record.period).filter(Boolean))],
    recordsCount: input.totalRows,
    rucs: [...new Set(input.records.map((record) => record.ruc).filter(Boolean))],
    totalCp: roundMoney(input.records.reduce((total, record) => total + record.total, 0)),
    validRows: input.records.length
  };
}

function readField(row: string[], index: number | undefined): string {
  if (index === undefined) {
    return "";
  }

  return (row[index] ?? "").trim();
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function parseAmount(value: string): number {
  const normalized = value
    .replace(/\s/g, "")
    .replace(/,/g, ".")
    .replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function isValidDate(value: string): boolean {
  const normalized = value.trim();
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(normalized);
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(normalized);

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

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
