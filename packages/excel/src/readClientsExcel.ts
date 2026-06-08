import ExcelJS from "exceljs";

export type ClientImportField =
  | "ruc"
  | "businessName"
  | "shortName"
  | "contasisEntityCode"
  | "contasisEntityDescription"
  | "defaultCondition"
  | "defaultPaymentMethod"
  | "defaultIgvPercent";

export type ClientImportMapping = Partial<Record<ClientImportField, string>>;

export type ClientImportRow = {
  ruc: string;
  businessName: string;
  shortName: string;
  contasisEntityCode: string;
  contasisEntityDescription: string;
  defaultCondition: string;
  defaultPaymentMethod: string;
  defaultIgvPercent: number;
};

export type ClientImportIssue = {
  rowNumber: number;
  field: ClientImportField;
  message: string;
};

export type ClientImportSheet = {
  name: string;
  rowCount: number;
  headers: string[];
  hasHeaderRow: boolean;
  sampleRows: string[][];
};

export type ClientImportAnalysis = {
  sheets: ClientImportSheet[];
};

export type ClientImportPreview = {
  rows: ClientImportRow[];
  issues: ClientImportIssue[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
};

const fieldAliases: Record<ClientImportField, string[]> = {
  ruc: ["ruc", "rut", "documento", "numero documento"],
  businessName: ["razon social", "razon social", "cliente", "empresa"],
  shortName: ["nombre corto", "nombre comercial", "alias"],
  contasisEntityCode: ["codigo entidad", "codigo contasis"],
  contasisEntityDescription: ["descripcion entidad", "descripcion contasis"],
  defaultCondition: ["condicion", "condicion por defecto"],
  defaultPaymentMethod: ["medio de pago", "medio pago", "forma de pago"],
  defaultIgvPercent: ["igv", "igv por defecto", "porcentaje igv"]
};

const requiredFields: ClientImportField[] = ["ruc", "businessName"];

export async function analyzeClientsWorkbook(
  buffer: Buffer
): Promise<ClientImportAnalysis> {
  const workbook = await loadWorkbook(buffer);

  return {
    sheets: workbook.worksheets.map((worksheet) => {
      const layout = getWorksheetLayout(worksheet);

      return {
        name: worksheet.name,
        headers: layout.headers,
        hasHeaderRow: layout.hasHeaderRow,
        sampleRows: readSampleRows(worksheet, layout.dataStartRow),
        rowCount: countDataRows(worksheet, layout.dataStartRow)
      };
    })
  };
}

export async function previewClientsWorkbook(input: {
  buffer: Buffer;
  sheetName: string;
  mapping: ClientImportMapping;
  limit?: number;
}): Promise<ClientImportPreview> {
  const worksheet = await getWorksheet(input.buffer, input.sheetName);

  return parseClientsWorksheet({
    worksheet,
    mapping: input.mapping,
    limit: input.limit ?? 5
  });
}

export async function readClientsWorkbook(input: {
  buffer: Buffer;
  sheetName: string;
  mapping: ClientImportMapping;
}): Promise<ClientImportPreview> {
  const worksheet = await getWorksheet(input.buffer, input.sheetName);

  return parseClientsWorksheet({
    worksheet,
    mapping: input.mapping
  });
}

export function inferClientImportMapping(
  headers: string[],
  sampleRows: string[][] = []
): ClientImportMapping {
  const mapping: ClientImportMapping = {};

  for (const field of Object.keys(fieldAliases) as ClientImportField[]) {
    const aliases = fieldAliases[field];
    const header = headers.find((candidate) =>
      aliases.some((alias) => normalizeHeader(candidate).includes(normalizeHeader(alias)))
    );

    if (header) {
      mapping[field] = header;
    }
  }

  if (!mapping.ruc) {
    const rucHeader = inferRucColumn(headers, sampleRows);

    if (rucHeader) {
      mapping.ruc = rucHeader;
    }
  }

  if (!mapping.businessName) {
    const businessNameHeader = inferBusinessNameColumn(headers, sampleRows, mapping.ruc);

    if (businessNameHeader) {
      mapping.businessName = businessNameHeader;
    }
  }

  return mapping;
}

function parseClientsWorksheet(input: {
  worksheet: ExcelJS.Worksheet;
  mapping: ClientImportMapping;
  limit?: number;
}): ClientImportPreview {
  const layout = getWorksheetLayout(input.worksheet);
  const headers = layout.headers;
  const headerIndex = new Map(headers.map((header, index) => [header, index + 1]));
  const rows: ClientImportRow[] = [];
  const issues: ClientImportIssue[] = [];
  let totalRows = 0;
  let validRows = 0;
  let invalidRows = 0;

  for (let rowNumber = layout.dataStartRow; rowNumber <= input.worksheet.rowCount; rowNumber += 1) {
    const row = input.worksheet.getRow(rowNumber);

    if (isEmptyRow(row)) {
      continue;
    }

    totalRows += 1;

    const parsedRow = buildClientRow({
      headerIndex,
      mapping: input.mapping,
      row
    });
    const rowIssues = validateClientRow(parsedRow, rowNumber);

    if (rowIssues.length > 0) {
      invalidRows += 1;
      issues.push(...rowIssues);
      continue;
    }

    validRows += 1;

    if (!input.limit || rows.length < input.limit) {
      rows.push(parsedRow);
    }
  }

  return {
    rows,
    issues,
    totalRows,
    validRows,
    invalidRows
  };
}

function buildClientRow(input: {
  headerIndex: Map<string, number>;
  mapping: ClientImportMapping;
  row: ExcelJS.Row;
}): ClientImportRow {
  return {
    ruc: onlyDigits(readMappedCell(input, "ruc")),
    businessName: readMappedCell(input, "businessName"),
    shortName:
      readMappedCell(input, "shortName") ||
      makeShortName(readMappedCell(input, "businessName")),
    contasisEntityCode: readMappedCell(input, "contasisEntityCode") || "01",
    contasisEntityDescription:
      readMappedCell(input, "contasisEntityDescription") || "MI ORGANIZACION",
    defaultCondition: readMappedCell(input, "defaultCondition") || "CON",
    defaultPaymentMethod: readMappedCell(input, "defaultPaymentMethod") || "008",
    defaultIgvPercent: parseIgv(readMappedCell(input, "defaultIgvPercent"))
  };
}

function validateClientRow(row: ClientImportRow, rowNumber: number): ClientImportIssue[] {
  const issues: ClientImportIssue[] = [];

  for (const field of requiredFields) {
    if (!row[field]) {
      issues.push({
        rowNumber,
        field,
        message: "Campo obligatorio vacio."
      });
    }
  }

  if (row.ruc && !/^\d{11}$/.test(row.ruc)) {
    issues.push({
      rowNumber,
      field: "ruc",
      message: "El RUC debe tener 11 digitos."
    });
  }

  return issues;
}

function readMappedCell(
  input: {
    headerIndex: Map<string, number>;
    mapping: ClientImportMapping;
    row: ExcelJS.Row;
  },
  field: ClientImportField
): string {
  const header = input.mapping[field];

  if (!header) {
    return "";
  }

  const index = input.headerIndex.get(header);

  if (!index) {
    return "";
  }

  return normalizeCellValue(input.row.getCell(index).value);
}

async function getWorksheet(buffer: Buffer, sheetName: string) {
  const workbook = await loadWorkbook(buffer);
  const worksheet = workbook.getWorksheet(sheetName);

  if (!worksheet) {
    throw new Error("Hoja no encontrada.");
  }

  return worksheet;
}

async function loadWorkbook(buffer: Buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as Parameters<typeof workbook.xlsx.load>[0]);

  return workbook;
}

function getWorksheetLayout(worksheet: ExcelJS.Worksheet): {
  dataStartRow: number;
  hasHeaderRow: boolean;
  headers: string[];
} {
  const firstRowValues = readRowValues(worksheet.getRow(1));
  const hasHeaderRow = looksLikeHeaderRow(firstRowValues);

  if (hasHeaderRow) {
    return {
      dataStartRow: 2,
      hasHeaderRow,
      headers: readHeaderRow(worksheet)
    };
  }

  return {
    dataStartRow: 1,
    hasHeaderRow,
    headers: getColumnLabels(worksheet)
  };
}

function readHeaderRow(worksheet: ExcelJS.Worksheet): string[] {
  const headerRow = worksheet.getRow(1);
  const headers: string[] = [];

  headerRow.eachCell({ includeEmpty: false }, (cell) => {
    const value = normalizeCellValue(cell.value);

    if (value) {
      headers.push(value);
    }
  });

  return headers;
}

function getColumnLabels(worksheet: ExcelJS.Worksheet): string[] {
  const labels: string[] = [];
  const maxColumn = Math.max(worksheet.columnCount, worksheet.getRow(1).cellCount);

  for (let index = 1; index <= maxColumn; index += 1) {
    labels.push(columnLabel(index));
  }

  return labels;
}

function countDataRows(worksheet: ExcelJS.Worksheet, startRow: number): number {
  let count = 0;

  for (let rowNumber = startRow; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    if (!isEmptyRow(worksheet.getRow(rowNumber))) {
      count += 1;
    }
  }

  return count;
}

function readSampleRows(worksheet: ExcelJS.Worksheet, startRow: number): string[][] {
  const sampleRows: string[][] = [];
  const maxColumn = Math.max(worksheet.columnCount, worksheet.getRow(1).cellCount);

  for (let rowNumber = startRow; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);

    if (isEmptyRow(row)) {
      continue;
    }

    const values: string[] = [];

    for (let columnNumber = 1; columnNumber <= maxColumn; columnNumber += 1) {
      values.push(normalizeCellValue(row.getCell(columnNumber).value));
    }

    sampleRows.push(values);

    if (sampleRows.length >= 10) {
      break;
    }
  }

  return sampleRows;
}

function readRowValues(row: ExcelJS.Row): string[] {
  const values: string[] = [];

  for (let columnNumber = 1; columnNumber <= row.cellCount; columnNumber += 1) {
    values.push(normalizeCellValue(row.getCell(columnNumber).value));
  }

  return values;
}

function looksLikeHeaderRow(values: string[]): boolean {
  const normalizedValues = values.map(normalizeHeader).filter(Boolean);
  const aliasHits = normalizedValues.filter((value) =>
    Object.values(fieldAliases).some((aliases) =>
      aliases.some((alias) => value.includes(normalizeHeader(alias)))
    )
  ).length;
  const numericLikeValues = normalizedValues.filter((value) => onlyDigits(value).length >= 6)
    .length;

  return aliasHits >= 2 && numericLikeValues === 0;
}

function isEmptyRow(row: ExcelJS.Row): boolean {
  let hasValue = false;

  row.eachCell({ includeEmpty: false }, (cell) => {
    if (normalizeCellValue(cell.value)) {
      hasValue = true;
    }
  });

  return !hasValue;
}

function normalizeCellValue(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object") {
    if ("text" in value && typeof value.text === "string") {
      return value.text.trim();
    }

    if ("result" in value) {
      return normalizeCellValue(value.result as ExcelJS.CellValue);
    }

    if ("richText" in value && Array.isArray(value.richText)) {
      return value.richText.map((item) => item.text).join("").trim();
    }

    return "";
  }

  return String(value).trim();
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function parseIgv(value: string): number {
  const normalized = value.replace("%", "").replace(",", ".").trim();

  if (!normalized) {
    return 18;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 18;
}

function inferRucColumn(headers: string[], sampleRows: string[][]): string | undefined {
  let bestHeader: string | undefined;
  let bestScore = 0;

  headers.forEach((header, index) => {
    const score = sampleRows.filter((row) => /^\d{11}$/.test(onlyDigits(row[index] ?? "")))
      .length;

    if (score > bestScore) {
      bestScore = score;
      bestHeader = header;
    }
  });

  return bestScore > 0 ? bestHeader : undefined;
}

function inferBusinessNameColumn(
  headers: string[],
  sampleRows: string[][],
  rucHeader: string | undefined
): string | undefined {
  const rucIndex = rucHeader ? headers.indexOf(rucHeader) : -1;
  let bestHeader: string | undefined;
  let bestScore = 0;

  headers.forEach((header, index) => {
    if (index === rucIndex) {
      return;
    }

    const score = sampleRows.reduce((total, row) => {
      const value = row[index] ?? "";
      const digits = onlyDigits(value);

      if (!value || digits.length === value.length) {
        return total;
      }

      return total + Math.min(value.length, 80);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestHeader = header;
    }
  });

  return bestScore > 0 ? bestHeader : undefined;
}

function makeShortName(businessName: string): string {
  return businessName.trim().slice(0, 24).trim() || "CLIENTE";
}

function columnLabel(index: number): string {
  let label = "";
  let current = index;

  while (current > 0) {
    const remainder = (current - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    current = Math.floor((current - 1) / 26);
  }

  return label;
}

function normalizeHeader(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}
