import { Loader2, Plus, Receipt, Search } from "lucide-react";

import { BILLING_MONTHS } from "../config";

type BillingHeaderProps = {
  selectedMonth: number;
  selectedYear: number;
  years: number[];
  isGenerating: boolean;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onNewCharge: () => void;
  onGenerateMonthly: () => void;
};

export function BillingHeader({
  selectedMonth,
  selectedYear,
  years,
  isGenerating,
  onMonthChange,
  onYearChange,
  onNewCharge,
  onGenerateMonthly,
}: BillingHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-slate-800">Control de Cobranzas</h1>
        <p className="text-slate-500 mt-1 max-w-sm">Gestiona las deudas y pagos de tus clientes.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          <select
            value={selectedMonth}
            onChange={(event) => onMonthChange(Number(event.target.value))}
            className="border-none bg-transparent text-sm font-medium text-slate-700 focus:ring-0 py-1.5 pl-2 pr-6 cursor-pointer text-center"
          >
            {BILLING_MONTHS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <div className="w-px h-5 bg-slate-200" />
          <select
            value={selectedYear}
            onChange={(event) => onYearChange(Number(event.target.value))}
            className="border-none bg-transparent text-sm font-medium text-slate-700 focus:ring-0 py-1.5 pl-2 pr-6 cursor-pointer text-center"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={onNewCharge}
          className="flex h-[42.4px] items-center justify-center gap-3 rounded-md border border-[#c9dbef] bg-white px-6 font-semibold text-[#056ba6] hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nuevo Cargo
        </button>
        <button
          onClick={() => {
            window.location.href = "/billing/history";
          }}
          className="flex h-[42.4px] items-center justify-center gap-3 rounded-md border border-[#c9dbef] bg-white px-6 font-semibold text-[#056ba6] hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Search className="w-5 h-5" />
          Historial por Cliente
        </button>
        <button
          onClick={onGenerateMonthly}
          disabled={isGenerating}
          className="flex h-[42.4px] items-center justify-center gap-3 rounded-md bg-[#056ba6] px-6 font-semibold text-white hover:bg-[#045585] transition-colors disabled:opacity-70 shadow-sm"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Receipt className="w-5 h-5" />}
          Generar Deudas del Mes
        </button>
      </div>
    </div>
  );
}
