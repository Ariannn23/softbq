export function formatConversionDateTime(dateString: string) {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("es-PE"),
    time: date.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function formatConversionPeriod(period: string) {
  if (!period || period.length !== 6) return period;

  const year = period.substring(0, 4);
  const month = Number.parseInt(period.substring(4, 6), 10);
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  return `${months[month - 1] ?? month} ${year}`;
}

export function buildConversionResultPayload(item: {
  id: number;
  clientRuc: string;
  period: string;
  salesRecordsCount: number;
  purchasesRecordsCount: number;
  files: {
    sales?: { id: number; sizeKb: number } | null;
    purchases?: { id: number; sizeKb: number } | null;
  };
}) {
  return {
    conversionId: item.id,
    sales: item.files.sales
      ? {
          fileId: item.files.sales.id,
          fileName: `Ventas_${item.clientRuc}_${item.period}.xlsx`,
          recordsCount: item.salesRecordsCount,
          sizeBytes: item.files.sales.sizeKb * 1024,
        }
      : null,
    purchases: item.files.purchases
      ? {
          fileId: item.files.purchases.id,
          fileName: `Compras_${item.clientRuc}_${item.period}.xlsx`,
          recordsCount: item.purchasesRecordsCount,
          sizeBytes: item.files.purchases.sizeKb * 1024,
        }
      : null,
  };
}
