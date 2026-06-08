import type { SireDelimiter, SireRawTable } from "./types.js";

export function parseSireTxt(content: string): SireRawTable {
  return parseDelimited(content, "|");
}

export function parseSireCsv(content: string): SireRawTable {
  return parseDelimited(content, ",");
}

function parseDelimited(content: string, delimiter: SireDelimiter): SireRawTable {
  const rows = splitRows(content)
    .map((line) => parseLine(line, delimiter))
    .filter((columns) => columns.some((column) => column.trim()));
  const [headers = [], ...dataRows] = rows;

  return {
    delimiter,
    headers: headers.map(cleanCell),
    rows: dataRows.map((row) => row.map(cleanCell))
  };
}

function splitRows(content: string): string[] {
  return content
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
}

function parseLine(line: string, delimiter: SireDelimiter): string[] {
  if (delimiter === "|") {
    return line.split(delimiter);
  }

  const cells: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && next === '"' && inQuotes) {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === delimiter && !inQuotes) {
      cells.push(cell);
      cell = "";
      continue;
    }

    cell += char;
  }

  cells.push(cell);

  return cells;
}

function cleanCell(value: string): string {
  return value.trim().replace(/^"|"$/g, "").trim();
}
