import type { ObligationClient } from "./services/obligationsApi";

export const OBLIGATION_MONTHS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

export const OBLIGATION_COLUMNS: Array<{
  label: string;
  requiredField: keyof ObligationClient;
  declaredField: keyof ObligationClient;
}> = [
  { label: "PLAME", requiredField: "hasPlame", declaredField: "plameDeclared" },
  { label: "AFPNET", requiredField: "hasAfpnet", declaredField: "afpnetDeclared" },
  { label: "ITAN", requiredField: "hasItan", declaredField: "itanDeclared" },
  { label: "DAOT", requiredField: "hasDaot", declaredField: "daotDeclared" },
  { label: "PDT 710", requiredField: "hasPdt710", declaredField: "pdt710Declared" },
];
