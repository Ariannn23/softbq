

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

export type ConversionHistoryItem = {
  id: number;
  createdAt: string;
  status: "draft" | "processing" | "validated" | "completed" | "error" | "cancelled";
  period: string;
  salesRecordsCount: number;
  purchasesRecordsCount: number;
  salesStatus: "uploaded" | "processing" | "completed" | "error" | null;
  purchasesStatus: "uploaded" | "processing" | "completed" | "error" | null;
  clientName: string;
  clientRuc: string;
  userName: string;
  files: {
    sales: { id: number; status: string; sizeKb: number } | null;
    purchases: { id: number; status: string; sizeKb: number } | null;
  };
};

export type ConversionHistoryResponse = {
  data: ConversionHistoryItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type GetConversionsParams = {
  page?: number;
  limit?: number;
  period?: string;
  clientId?: string;
  status?: string;
  fileType?: string;
};

export async function getConversions(params: GetConversionsParams = {}): Promise<ConversionHistoryResponse> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const res = await fetch(`/api/conversions?${searchParams.toString()}`);

  if (!res.ok) {
    throw new Error("Error al cargar el historial de conversiones");
  }

  return res.json();
}

export type GenerateConversionPayload = {
  clientId: string;
  period: string;
  salesFile?: { name: string; path: string; size: number };
  purchasesFile?: { name: string; path: string; size: number };
};

export type GenerateConversionResponse = {
  conversionId: number;
  sales: { fileId: number; fileName: string; recordsCount: number; sizeBytes: number } | null;
  purchases: { fileId: number; fileName: string; recordsCount: number; sizeBytes: number } | null;
};

export async function generateConversion(data: GenerateConversionPayload): Promise<GenerateConversionResponse> {
  const res = await fetch("/api/conversions/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Error al generar la conversión");
  }

  return res.json();
}
