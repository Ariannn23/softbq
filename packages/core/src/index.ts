export type UserRole = "admin" | "principal_accountant" | "assistant";

export type SireFileType = "sales" | "purchases";

export type ConversionKind = SireFileType;

export type ConversionStatus =
  | "draft"
  | "validated"
  | "generated"
  | "failed"
  | "cancelled";

export type ConversionFileStatus =
  | "uploaded"
  | "validated"
  | "generated"
  | "failed";

export type ObservationSeverity = "error" | "warning" | "info";

export type PeriodStatus =
  | "pendiente"
  | "ventas_cargadas"
  | "compras_cargadas"
  | "generado"
  | "revisado"
  | "declarado";

export interface ClientConfig {
  ruc: string;
  businessName: string;
  shortName: string;
  contasisEntityCode: string;
  contasisEntityDescription: string;
  defaultCondition: string;
  defaultPaymentMethod: string;
  defaultIgvPercent: number;
  monthlyFee?: number | null;
  hasPlame: boolean;
  hasAfpnet: boolean;
  hasItan: boolean;
  hasDaot: boolean;
  hasPdt710: boolean;
  hasFinalBeneficiary: boolean;
  salesBaseAccount: string;
  salesTotalAccount: string;
  purchasesBaseAccount: string;
  purchasesTotalAccount: string;
}

export interface User {
  id: number;
  username: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Client extends ClientConfig {
  id: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversion {
  id: number;
  clientId: number;
  period: string;
  createdBy: number;
  status: ConversionStatus;
  salesStatus: ConversionFileStatus | null;
  purchasesStatus: ConversionFileStatus | null;
  salesRecordsCount: number;
  purchasesRecordsCount: number;
  salesTotal: number;
  purchasesTotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  description: string | null;
  updatedAt: string;
}
