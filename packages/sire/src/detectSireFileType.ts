export type SireFileType = "sales" | "purchases" | "unknown";

function normalizeHeader(header: string) {
  return header
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function detectSireFileType(headers: string[]): SireFileType {
  const normalized = headers.map(normalizeHeader);

  if (normalized.includes("bi gravada") && normalized.includes("valor facturado exportacion")) {
    return "sales";
  }

  if (normalized.includes("bi gravado dg") && normalized.includes("igv / ipm dg")) {
    return "purchases";
  }

  return "unknown";
}