import { normalizeHeader } from "./headers.js";
import type { SireDetectedFileType } from "./types.js";

export function detectSireFileType(headers: string[]): SireDetectedFileType {
  const normalized = headers.map(normalizeHeader);

  if (normalized.includes("bi gravada") && normalized.includes("valor facturado exportacion")) {
    return "sales";
  }

  if (normalized.includes("bi gravado dg") && normalized.includes("igv / ipm dg")) {
    return "purchases";
  }

  return "unknown";
}
