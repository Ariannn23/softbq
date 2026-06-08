import { detectSireFileType } from "./detectSireFileType.js";
import { buildHeaderIndex, findHeaderIndex } from "./headers.js";
import type {
  SireObservation,
  SirePurchaseRecord,
  SirePurchaseSummary,
  SirePurchaseValidation,
  SireRawTable
} from "./types.js";

const expectedPurchaseColumnCount = 34;
const amountTolerance = 0.02;

const purchaseColumns = {
  ruc: ["ruc"],
  businessName: ["apellidos y nombres o razon social", "razon social"],
  period: ["periodo"],
  carSunat: ["car sunat"],
  issueDate: ["fecha de emision", "fecha emision"],
  dueDate: ["fecha vcto/pago", "fecha vencimiento", "fecha pago"],
  documentType: ["tipo cp/doc.", "tipo cp/doc", "tipo cp"],
  series: ["serie del cdp", "serie"],
  year: ["ano", "año"],
  number: ["nro cp o doc. nro inicial (rango)", "nro cp o doc", "numero"],
  supplierDocumentType: ["tipo doc identidad"],
  supplierDocumentNumber: ["nro doc identidad"],
  supplierName: ["apellidos nombres/ razon social", "apellidos nombres/razon social"],
  taxableBaseDg: ["bi gravado dg"],
  igvDg: ["igv / ipm dg", "igv/ipm dg"],
  taxableBaseDgng: ["bi gravado dgng"],
  igvDgng: ["igv / ipm dgng", "igv/ipm dgng"],
  taxableBaseDng: ["bi gravado dng"],
  igvDng: ["igv / ipm dng", "igv/ipm dng"],
  nonTaxedAcquisitionValue: ["valor adq. ng", "valor adq ng"],
  isc: ["isc"],
  icbper: ["icbper"],
  otherCharges: ["otros trib/ cargos", "otros tributos", "otros cargos"],
  total: ["total cp"],
  currency: ["moneda"],
  exchangeRate: ["tipo de cambio", "tipo cambio"],
  modifiedIssueDate: ["fecha emision doc modificado", "fecha emision documento modificado"],
  modifiedDocumentType: ["tipo cp modificado"],
  modifiedSeries: ["serie cp modificado"],
  damDsiCode: ["cod. dam o dsi", "cod dam o dsi"],
  modifiedNumber: ["nro cp modificado"],
  goodsServicesClassification: ["clasif de bss y sss", "clasificacion de bss y sss"],
  detraction: ["detraccion"],
  status: ["est. comp.", "est. comp", "estado comp"]
} as const;

type PurchaseField = keyof typeof purchaseColumns;

const requiredPurchaseFields: PurchaseField[] = [
  "ruc",
  "businessName",
  "period",
  "carSunat",
  "issueDate",
  "documentType",
  "series",
  "number",
  "supplierDocumentType",
  "supplierDocumentNumber",
  "supplierName",
  "taxableBaseDg",
  "igvDg",
  "taxableBaseDgng",
  "igvDgng",
  "taxableBaseDng",
  "igvDng",
  "nonTaxedAcquisitionValue",
  "isc",
  "icbper",
  "otherCharges",
  "total",
  "currency",
  "exchangeRate"
];

export function validateSirePurchases(table: SireRawTable): SirePurchaseValidation {
  const observations: SireObservation[] = [];

  if (table.headers.length === 0) {
    observations.push({
      code: "purchases_header_missing",
      message: "El archivo no contiene encabezado.",
      severity: "error"
    });
  }

  if (table.headers.length > 0 && table.headers.length !== expectedPurchaseColumnCount) {
    observations.push({
      code: "purchases_header_column_count",
      message: `El encabezado contiene ${table.headers.length} columnas; se esperaban ${expectedPurchaseColumnCount}.`,
      severity: "warning"
    });
  }

  const headerIndex = buildHeaderIndex(table.headers);
  const mappedColumns = mapPurchaseColumns(headerIndex);

  for (const field of requiredPurchaseFields) {
    if (mappedColumns[field] === undefined) {
      observations.push({
        code: "purchases_required_column_missing",
        field,
        message: `No se encontro la columna obligatoria para ${field}.`,
        severity: "error"
      });
    }
  }

  const records: SirePurchaseRecord[] = [];
  const carSunatOccurrences = new Map<string, number>();
  const periods = new Set<string>();
  const rucs = new Set<string>();

  table.rows.forEach((row, index) => {
    const rowNumber = index + 2;

    if (row.length !== expectedPurchaseColumnCount) {
      observations.push({
        code: "purchases_row_column_count",
        message: `La fila contiene ${row.length} columnas; se esperaban ${expectedPurchaseColumnCount}.`,
        rowNumber,
        severity: "error"
      });
    }

    const record = normalizePurchaseRow(row, mappedColumns);
    const rowObservations = validatePurchaseRecord(record, rowNumber);

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
      code: "purchases_period_not_unique",
      message: "El archivo contiene mas de un periodo.",
      severity: "error"
    });
  }

  if (rucs.size > 1) {
    observations.push({
      code: "purchases_ruc_not_unique",
      message: "El archivo contiene mas de un RUC.",
      severity: "error"
    });
  }

  const carSunatDuplicates = [...carSunatOccurrences.entries()]
    .filter(([, count]) => count > 1)
    .map(([carSunat]) => carSunat);

  for (const carSunat of carSunatDuplicates) {
    observations.push({
      code: "purchases_car_sunat_duplicate",
      field: "carSunat",
      message: `CAR SUNAT duplicado: ${carSunat}.`,
      severity: "error"
    });
  }

  return {
    fileType: detectSireFileType(table.headers),
    observations,
    records,
    summary: buildPurchaseSummary({
      carSunatDuplicates,
      records,
      totalRows: table.rows.length
    })
  };
}

export function normalizePurchases(table: SireRawTable): SirePurchaseRecord[] {
  return validateSirePurchases(table).records;
}

function mapPurchaseColumns(headerIndex: Map<string, number>): Partial<Record<PurchaseField, number>> {
  const mappedColumns: Partial<Record<PurchaseField, number>> = {};

  for (const field of Object.keys(purchaseColumns) as PurchaseField[]) {
    mappedColumns[field] = findHeaderIndex(headerIndex, [...purchaseColumns[field]]);
  }

  return mappedColumns;
}

function normalizePurchaseRow(
  row: string[],
  mappedColumns: Partial<Record<PurchaseField, number>>
): SirePurchaseRecord {
  const value = (field: PurchaseField) => readField(row, mappedColumns[field]);

  return {
    ruc: onlyDigits(value("ruc")),
    businessName: value("businessName"),
    period: onlyDigits(value("period")),
    carSunat: value("carSunat"),
    issueDate: value("issueDate"),
    dueDate: value("dueDate"),
    documentType: value("documentType"),
    series: value("series"),
    year: onlyDigits(value("year")),
    number: value("number"),
    supplierDocumentType: value("supplierDocumentType"),
    supplierDocumentNumber: value("supplierDocumentNumber"),
    supplierName: value("supplierName"),
    taxableBaseDg: parseAmount(value("taxableBaseDg")),
    igvDg: parseAmount(value("igvDg")),
    taxableBaseDgng: parseAmount(value("taxableBaseDgng")),
    igvDgng: parseAmount(value("igvDgng")),
    taxableBaseDng: parseAmount(value("taxableBaseDng")),
    igvDng: parseAmount(value("igvDng")),
    nonTaxedAcquisitionValue: parseAmount(value("nonTaxedAcquisitionValue")),
    isc: parseAmount(value("isc")),
    icbper: parseAmount(value("icbper")),
    otherCharges: parseAmount(value("otherCharges")),
    total: parseAmount(value("total")),
    currency: value("currency"),
    exchangeRate: parseAmount(value("exchangeRate")),
    modifiedIssueDate: value("modifiedIssueDate"),
    modifiedDocumentType: value("modifiedDocumentType"),
    modifiedSeries: value("modifiedSeries"),
    damDsiCode: value("damDsiCode"),
    modifiedNumber: value("modifiedNumber"),
    goodsServicesClassification: value("goodsServicesClassification"),
    detraction: value("detraction"),
    status: value("status")
  };
}

function validatePurchaseRecord(record: SirePurchaseRecord, rowNumber: number): SireObservation[] {
  const observations: SireObservation[] = [];

  if (!/^\d{11}$/.test(record.ruc)) {
    observations.push({
      code: "purchases_invalid_ruc",
      field: "ruc",
      message: "El RUC debe tener 11 digitos.",
      rowNumber,
      severity: "error"
    });
  }

  if (!/^\d{6}$/.test(record.period)) {
    observations.push({
      code: "purchases_invalid_period",
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
    ["supplierDocumentNumber", record.supplierDocumentNumber],
    ["supplierName", record.supplierName],
    ["currency", record.currency]
  ] as const) {
    if (!value) {
      observations.push({
        code: "purchases_required_value_missing",
        field,
        message: `Campo obligatorio vacio: ${field}.`,
        rowNumber,
        severity: "error"
      });
    }
  }

  if (record.issueDate && !isValidDate(record.issueDate)) {
    observations.push({
      code: "purchases_invalid_issue_date",
      field: "issueDate",
      message: "Fecha de emision invalida.",
      rowNumber,
      severity: "error"
    });
  }

  if (record.dueDate && !isValidDate(record.dueDate)) {
    observations.push({
      code: "purchases_invalid_due_date",
      field: "dueDate",
      message: "Fecha Vcto/Pago invalida.",
      rowNumber,
      severity: "error"
    });
  }

  if (record.modifiedIssueDate && !isValidDate(record.modifiedIssueDate)) {
    observations.push({
      code: "purchases_invalid_modified_issue_date",
      field: "modifiedIssueDate",
      message: "Fecha de emision modificada invalida.",
      rowNumber,
      severity: "error"
    });
  }

  const expectedTotal =
    record.taxableBaseDg +
    record.igvDg +
    record.taxableBaseDgng +
    record.igvDgng +
    record.taxableBaseDng +
    record.igvDng +
    record.nonTaxedAcquisitionValue +
    record.isc +
    record.icbper +
    record.otherCharges;

  if (Math.abs(roundMoney(expectedTotal) - roundMoney(record.total)) > amountTolerance) {
    observations.push({
      code: "purchases_total_mismatch",
      field: "total",
      message: "Total CP no cuadra con la suma de importes.",
      rowNumber,
      severity: "error"
    });
  }

  return observations;
}

function buildPurchaseSummary(input: {
  carSunatDuplicates: string[];
  records: SirePurchaseRecord[];
  totalRows: number;
}): SirePurchaseSummary {
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
