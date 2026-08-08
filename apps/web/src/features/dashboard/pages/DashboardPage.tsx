import { AlertCircle, Loader2 } from "lucide-react";

import { DashboardClientsStatusTable } from "../components/DashboardClientsStatusTable";
import { DashboardPeriodFilter } from "../components/DashboardPeriodFilter";
import { DashboardSummaryGrid } from "../components/DashboardSummaryGrid";
import { useDashboardPage } from "../hooks/useDashboardPage";

export function DashboardPage({ clientsVersion }: { clientsVersion?: number }) {
  const dashboard = useDashboardPage({ clientsVersion });

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Panel Principal</h1>
          <p className="text-slate-500 mt-1 text-sm">Resumen del estado de la cartera de clientes del periodo seleccionado.</p>
        </div>
      </div>

      <DashboardPeriodFilter
        selectedMonth={dashboard.selectedMonth}
        selectedYear={dashboard.selectedYear}
        years={dashboard.years}
        onMonthChange={dashboard.setSelectedMonth}
        onYearChange={dashboard.setSelectedYear}
        onReset={dashboard.resetPeriod}
      />

      {dashboard.isLoading && !dashboard.data ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : dashboard.isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>Ocurrio un error al cargar los datos del dashboard. Por favor, intenta nuevamente.</p>
        </div>
      ) : dashboard.data ? (
        <div className={`space-y-6 transition-opacity duration-200 ${dashboard.isLoading ? "opacity-50 pointer-events-none" : ""}`}>
          <DashboardSummaryGrid summary={dashboard.data.summary} />
          <DashboardClientsStatusTable
            clients={dashboard.paginatedClients}
            filteredCount={dashboard.filteredClients.length}
            searchTerm={dashboard.searchTerm}
            page={dashboard.page}
            limit={dashboard.limit}
            updatingId={dashboard.updatingId}
            openMenuId={dashboard.openMenuId}
            onSearchChange={dashboard.setSearchTerm}
            onPageChange={dashboard.setPage}
            onPageSizeChange={dashboard.setLimit}
            onMenuChange={dashboard.setOpenMenuId}
            onStatusChange={dashboard.handleStatusChange}
          />
        </div>
      ) : null}
    </div>
  );
}
