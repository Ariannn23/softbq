import { AlertCircle, FileCheck, Loader2 } from "lucide-react";

import { ObligationsKpiGrid } from "../components/ObligationsKpiGrid";
import { ObligationsPeriodFilter } from "../components/ObligationsPeriodFilter";
import { ObligationsTable } from "../components/ObligationsTable";
import { useObligationsPage } from "../hooks/useObligationsPage";

export function ObligationsPage() {
  const obligations = useObligationsPage();

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileCheck className="w-7 h-7 text-blue-600" />
            Obligaciones Adicionales
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Control mensual de declaraciones juradas, planillas y obligaciones secundarias.</p>
        </div>
      </div>

      <ObligationsPeriodFilter
        selectedMonth={obligations.selectedMonth}
        selectedYear={obligations.selectedYear}
        years={obligations.years}
        onMonthChange={obligations.setSelectedMonth}
        onYearChange={obligations.setSelectedYear}
        onReset={obligations.resetPeriod}
      />

      {obligations.isLoading && !obligations.data ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : obligations.isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>Ocurrio un error al cargar las obligaciones. Por favor, intenta nuevamente.</p>
        </div>
      ) : obligations.data ? (
        <div className={`space-y-6 transition-opacity duration-200 ${obligations.isLoading ? "opacity-50 pointer-events-none" : ""}`}>
          {obligations.kpis && <ObligationsKpiGrid kpis={obligations.kpis} />}

          <ObligationsTable
            clients={obligations.paginatedClients}
            filteredCount={obligations.filteredClients.length}
            searchTerm={obligations.searchTerm}
            page={obligations.page}
            limit={obligations.limit}
            updatingIds={obligations.updatingIds}
            onSearchChange={obligations.setSearchTerm}
            onPageChange={obligations.setPage}
            onPageSizeChange={obligations.setLimit}
            onToggle={obligations.toggleObligation}
          />
        </div>
      ) : null}
    </div>
  );
}
