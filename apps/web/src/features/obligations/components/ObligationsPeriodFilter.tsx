import { CalendarDays, RefreshCcw } from "lucide-react";

import { OBLIGATION_MONTHS } from "../config";

type ObligationsPeriodFilterProps = {
  selectedMonth: number;
  selectedYear: number;
  years: number[];
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onReset: () => void;
};

export function ObligationsPeriodFilter({
  selectedMonth,
  selectedYear,
  years,
  onMonthChange,
  onYearChange,
  onReset,
}: ObligationsPeriodFilterProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
        <CalendarDays className="w-4 h-4" />
        Periodo
      </label>
      <div className="flex items-center gap-2">
        <select
          value={selectedMonth}
          onChange={(event) => onMonthChange(Number(event.target.value))}
          className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
        >
          {OBLIGATION_MONTHS.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(event) => onYearChange(Number(event.target.value))}
          className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
          title="Limpiar"
        >
          <RefreshCcw className="w-4 h-4" />
          Limpiar
        </button>
      </div>
    </div>
  );
}
