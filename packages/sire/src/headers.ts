export function normalizeHeader(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function buildHeaderIndex(headers: string[]): Map<string, number> {
  const index = new Map<string, number>();

  headers.forEach((header, position) => {
    const normalized = normalizeHeader(header);

    if (normalized && !index.has(normalized)) {
      index.set(normalized, position);
    }
  });

  return index;
}

export function findHeaderIndex(
  headerIndex: Map<string, number>,
  aliases: string[]
): number | undefined {
  for (const alias of aliases) {
    const exact = headerIndex.get(normalizeHeader(alias));

    if (exact !== undefined) {
      return exact;
    }
  }

  for (const [header, index] of headerIndex.entries()) {
    if (aliases.some((alias) => header.includes(normalizeHeader(alias)))) {
      return index;
    }
  }

  return undefined;
}
