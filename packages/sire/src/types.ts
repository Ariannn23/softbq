export type SireDetectedFileType = "sales" | "purchases" | "unknown";

export type SireDelimiter = "|" | ",";

export type SireObservationSeverity = "error" | "warning" | "info";

export type SireObservation = {
  code: string;
  field?: string;
  message: string;
  rowNumber?: number;
  severity: SireObservationSeverity;
};

export type SireRawTable = {
  delimiter: SireDelimiter;
  headers: string[];
  rows: string[][];
};

export type SireSalesRecord = {
  ruc: string;
  businessName: string;
  period: string;
  carSunat: string;
  issueDate: string;
  dueDate: string;
  documentType: string;
  series: string;
  number: string;
  customerDocumentType: string;
  customerDocumentNumber: string;
  customerName: string;
  exportValue: number;
  taxableBase: number;
  igv: number;
  exemptAmount: number;
  unaffectedAmount: number;
  isc: number;
  icbper: number;
  otherTaxes: number;
  total: number;
  currency: string;
  exchangeRate: number;
  modifiedIssueDate: string;
  modifiedDocumentType: string;
  modifiedSeries: string;
  modifiedNumber: string;
  status: string;
  freeOperationsValue: number;
};

export type SireSalesSummary = {
  carSunatDuplicates: string[];
  currencies: string[];
  invalidRows: number;
  periods: string[];
  recordsCount: number;
  rucs: string[];
  totalCp: number;
  validRows: number;
};

export type SireSalesValidation = {
  fileType: SireDetectedFileType;
  observations: SireObservation[];
  records: SireSalesRecord[];
  summary: SireSalesSummary;
};
