import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Ingresa tu usuario"),
  password: z.string().min(1, "Ingresa tu contrasena"),
});

export const clientSchema = z.object({
  ruc: z.string().regex(/^\d{11}$/, "El RUC debe tener 11 digitos"),
  businessName: z.string().trim().min(1, "Ingresa la razon social"),
  shortName: z.string().trim().min(1, "Ingresa el nombre corto"),
  contasisEntityCode: z
    .string()
    .trim()
    .min(1, "Ingresa el codigo")
    .transform((val) => val.padStart(2, "0")),
  contasisEntityDescription: z.string().trim().min(1, "Ingresa la descripcion"),
  defaultCondition: z.string().trim().min(1, "Ingresa la condicion"),
  defaultPaymentMethod: z.string().trim().min(1, "Ingresa el código de pago").transform(val => val.padStart(3, "0")),
  defaultIgvPercent: z.coerce.number().min(0).max(100),
  monthlyFee: z.coerce.number().min(0).optional().nullable(),
  hasPlame: z.boolean(),
  hasAfpnet: z.boolean().default(false),
  hasItan: z.boolean().default(false),
  hasDaot: z.boolean().default(false),
  hasPdt710: z.boolean().default(false),
  salesAccount: z.string().trim(),
  purchasesAccount: z.string().trim(),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type ClientValues = z.infer<typeof clientSchema>;

export type SessionUser = {
  id: number;
  username: string;
  role: "admin" | "principal_accountant" | "assistant";
};

export type Client = ClientValues & {
  id: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ClientImportField = keyof ClientValues;

export type ImportSheet = {
  name: string;
  rowCount: number;
  headers: string[];
  inferredMapping: Partial<Record<ClientImportField, string>>;
};

export type ImportAnalysis = {
  importId: string;
  fileName: string;
  sheets: ImportSheet[];
};

export type ImportPreview = {
  rows: ClientValues[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
  issues: Array<{
    rowNumber: number;
    field: ClientImportField;
    message: string;
  }>;
};

export type ImportSummary = {
  created: number;
  updated: number;
  omitted: number;
  errors: number;
  totalRows: number;
  importedRows: number;
};

export const emptyClient: ClientValues = {
  ruc: "",
  businessName: "",
  shortName: "",
  contasisEntityCode: "01",
  contasisEntityDescription: "MI ORGANIZACION",
  defaultCondition: "CON",
  defaultPaymentMethod: "008",
  defaultIgvPercent: 18,
  monthlyFee: null,
  hasPlame: false,
  hasAfpnet: false,
  hasItan: false,
  hasDaot: false,
  hasPdt710: false,
  salesAccount: "",
  purchasesAccount: "",
};

export const importFields: Array<{
  key: ClientImportField;
  label: string;
  required?: boolean;
}> = [
  { key: "ruc", label: "RUC", required: true },
  { key: "businessName", label: "Razon social", required: true },
  { key: "shortName", label: "Nombre corto" },
  { key: "contasisEntityCode", label: "Codigo entidad Contasis" },
  { key: "contasisEntityDescription", label: "Descripcion entidad Contasis" },
  { key: "defaultCondition", label: "Condicion por defecto" },
  { key: "defaultPaymentMethod", label: "Código de pago por defecto" },
  { key: "defaultIgvPercent", label: "IGV por defecto" },
  { key: "monthlyFee", label: "Honorarios mensuales" },
  { key: "hasPlame", label: "Declara PLAME" },
  { key: "hasAfpnet", label: "Declara AFPNET" },
  { key: "hasItan", label: "Declara ITAN" },
  { key: "hasDaot", label: "Declara DAOT" },
  { key: "hasPdt710", label: "Declara PDT 710" },
  { key: "salesAccount", label: "Cuenta de Ventas" },
  { key: "purchasesAccount", label: "Cuenta de Compras" },
];
