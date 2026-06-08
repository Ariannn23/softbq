

export type ConversionValidationObservation = {
  code: string;
  field?: string;
  message: string;
  rowNumber?: number;
  severity: "error" | "warning" | "info";
};

export type ConversionValidationSummary = {
  recordsCount: number;
  totalBase: number;
  totalIgv: number;
  totalCp: number;
  validRows: number;
  invalidRows: number;
  detectedRucs: string[];
  detectedPeriods: string[];
};

export type ConversionValidationFileResult = {
  fileName: string;
  filePath: string;
  sizeBytes: number;
  detectedType: "sales" | "purchases" | "unknown";
  expectedType: "sales" | "purchases";
  isValidType: boolean;
  summary: ConversionValidationSummary;
  observations: {
    critical: ConversionValidationObservation[];
    warnings: ConversionValidationObservation[];
    info: ConversionValidationObservation[];
  };
  error?: string;
};

export type ValidationResponse = {
  clientId: string;
  period: string;
  sales: ConversionValidationFileResult | null;
  purchases: ConversionValidationFileResult | null;
};

export async function validateConversions(data: {
  clientId: string;
  period: string;
  salesFile?: File;
  purchasesFile?: File;
}): Promise<ValidationResponse> {
  const formData = new FormData();
  formData.append("clientId", data.clientId);
  formData.append("period", data.period);
  
  if (data.salesFile) {
    formData.append("sales", data.salesFile);
  }
  
  if (data.purchasesFile) {
    formData.append("purchases", data.purchasesFile);
  }

  // Custom fetch configuration for FormData
  const res = await fetch("/api/conversions/validate", {
    method: "POST",
    body: formData,
    // Do not set Content-Type header manually, let the browser set it with the boundary
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Error al validar la conversión");
  }

  return res.json();
}
