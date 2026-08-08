export const SETTINGS_FIELDS = [
  { key: "moneda_pen", label: "Moneda PEN (Soles)", fallback: "S", placeholder: "S", helper: "Mapeo Contasis para Soles", type: "text" },
  { key: "moneda_usd", label: "Moneda USD (Dolares)", fallback: "D", placeholder: "D", helper: "Mapeo Contasis para Dolares", type: "text" },
  { key: "condicion_defecto", label: "Condicion por defecto", fallback: "CON", placeholder: "CON", type: "text" },
  { key: "medio_pago_defecto", label: "Codigo de pago por defecto", fallback: "008", placeholder: "008", type: "text" },
  { key: "igv_porcentaje", label: "IGV (%)", fallback: "18", placeholder: "18", type: "number" },
  { key: "min_version_required", label: "Version Minima Requerida", fallback: "0.0.0", placeholder: "0.1.0", helper: "Obliga a los usuarios a actualizar (ej. 0.1.2)", type: "text" },
];
