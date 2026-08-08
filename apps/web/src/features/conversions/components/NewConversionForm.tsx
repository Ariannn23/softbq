import { AlertCircle } from "lucide-react";

import { ClientCombobox } from "../../shared/ui/ClientCombobox";
import type { Client } from "../../shared/types";
import { CONVERSION_MONTHS } from "../config";
import { FileDropzone } from "./FileDropzone";

type NewConversionFormProps = {
  clients: Client[];
  clientId: string;
  selectedMonth: string;
  selectedYear: string;
  years: string[];
  salesFile: File | null;
  purchasesFile: File | null;
  isSubmitting: boolean;
  error: string | null;
  onClientChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onSalesFileChange: (file: File | null) => void;
  onPurchasesFileChange: (file: File | null) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>, type: "sales" | "purchases") => void;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
};

export function NewConversionForm({
  clients,
  clientId,
  selectedMonth,
  selectedYear,
  years,
  salesFile,
  purchasesFile,
  isSubmitting,
  error,
  onClientChange,
  onMonthChange,
  onYearChange,
  onSalesFileChange,
  onPurchasesFileChange,
  onDrop,
  onSubmit,
  onCancel,
}: NewConversionFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="z-20">
            <label className="block text-sm font-medium text-slate-700 mb-2">1. Cliente</label>
            <ClientCombobox clients={clients} value={clientId} onChange={(value) => onClientChange(value.toString())} />
          </div>
          <div className="z-10">
            <label className="block text-sm font-medium text-slate-700 mb-2">2. Periodo</label>
            <div className="flex gap-2">
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" value={selectedMonth} onChange={(event) => onMonthChange(event.target.value)}>
                {CONVERSION_MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" value={selectedYear} onChange={(event) => onYearChange(event.target.value)}>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileDropzone
            label="3. Archivo SIRE - Ventas (opcional)"
            description="Puede cargar solo ventas, solo compras o ambos archivos."
            file={salesFile}
            onDrop={(event) => onDrop(event, "sales")}
            onChange={(event) => onSalesFileChange(event.target.files?.[0] ?? null)}
            onRemove={() => onSalesFileChange(null)}
            iconColor="text-green-600"
          />
          <FileDropzone
            label="4. Archivo SIRE - Compras (opcional)"
            description="Puede cargar solo ventas, solo compras o ambos archivos."
            file={purchasesFile}
            onDrop={(event) => onDrop(event, "purchases")}
            onChange={(event) => onPurchasesFileChange(event.target.files?.[0] ?? null)}
            onRemove={() => onPurchasesFileChange(null)}
            iconColor="text-purple-600"
          />
        </div>

        <div className="bg-blue-50 text-blue-800 p-4 rounded-md flex gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="font-semibold mb-1">Regla de carga</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Al menos un archivo debe estar cargado para continuar.</li>
              <li>Los archivos deben corresponder al mismo cliente y periodo seleccionado.</li>
            </ul>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm border border-red-200">{error}</div>}
      </div>

      <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-slate-200">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting || (!salesFile && !purchasesFile)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2">
          {isSubmitting ? "Validando..." : "Validar archivos"}
        </button>
      </div>
    </form>
  );
}
