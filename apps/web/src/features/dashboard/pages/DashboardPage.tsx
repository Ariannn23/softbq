import { Calendar, ChevronDown, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { MetricCardSkeleton, SearchBox } from "../../shared/ui";
import { DashboardClientsTable } from "../components/DashboardClientsTable";
import { MetricCard } from "../components/MetricCard";
import { useDashboardPage } from "../hooks/useDashboardPage";

export function DashboardPage({ clientsVersion }: { clientsVersion: number }) {
  const navigate = useNavigate();
  const state = useDashboardPage(clientsVersion);

  return (
    <div className="mx-auto max-w-[1500px] px-8 py-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#072d4a]">Panel Principal</h1>
          <p className="mt-2 text-[#26466f]">Resumen del estado de la cartera de clientes del periodo seleccionado.</p>
        </div>
        <button className="flex h-12 items-center justify-center gap-3 rounded-md bg-[#007fcb] px-6 font-semibold text-white shadow-[0_10px_24px_rgba(0,127,203,0.2)]" type="button">
          <PlusCircle size={20} />
          Nueva conversion
        </button>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <span className="font-medium">Periodo</span>
        <button className="flex h-10 min-w-56 items-center justify-between rounded-md border border-[#c9dbef] bg-white px-4 text-[#0a4770]" type="button">
          <span className="flex items-center gap-3"><Calendar size={18} />Junio 2026</span>
          <ChevronDown size={18} />
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {state.loading
          ? Array.from({ length: 7 }, (_, index) => <MetricCardSkeleton key={index} />)
          : state.metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>

      <section className="mt-7 overflow-hidden rounded-lg border border-[#d8e8f6] bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#d8e8f6] px-5 py-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-bold">Estado de clientes del periodo</h2>
          <SearchBox value={state.dashboardSearch} placeholder="Buscar cliente..." onChange={state.setDashboardSearch} />
        </div>
        <DashboardClientsTable
          clients={state.filteredClients}
          loading={state.loading}
          onOpenClients={() => navigate("/clientes")}
        />
        <div className="flex items-center justify-between border-t border-[#e2edf8] px-5 py-4 text-sm text-[#53698d]">
          <span>
            {state.loading
              ? "Cargando estado de clientes..."
              : `Mostrando ${Math.min(state.filteredClients.length, 6)} de ${state.filteredClients.length} clientes${state.inactiveClients > 0 ? ` (${state.inactiveClients} inactivos)` : ""}`}
          </span>
          <button className="rounded-md bg-[#007fcb] px-4 py-2 font-semibold text-white" onClick={() => navigate("/clientes")} type="button">Ver clientes</button>
        </div>
      </section>
    </div>
  );
}
