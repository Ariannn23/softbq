import { ArrowRightLeft, CheckCircle2, Loader2, Search, X } from "lucide-react";

import { Pagination } from "../../shared/Pagination";
import { STATUS_OPTIONS, hasStatusOrHigher } from "../config";
import type { ClientPeriodStatus, DashboardClientInfo } from "../services/dashboardApi";

type DashboardClientsStatusTableProps = {
  clients: DashboardClientInfo[];
  filteredCount: number;
  searchTerm: string;
  page: number;
  limit: number;
  updatingId: number | null;
  openMenuId: number | null;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
  onMenuChange: (id: number | null) => void;
  onStatusChange: (clientId: number, status: ClientPeriodStatus) => void;
};

export function DashboardClientsStatusTable({
  clients,
  filteredCount,
  searchTerm,
  page,
  limit,
  updatingId,
  openMenuId,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onMenuChange,
  onStatusChange,
}: DashboardClientsStatusTableProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="font-semibold text-slate-800 text-lg">Estado de clientes del periodo</h2>
        <SearchInput value={searchTerm} onChange={onSearchChange} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-white text-slate-600 text-xs font-semibold border-b border-slate-200">
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">RUC</th>
              <th className="px-4 py-3 text-center">Ventas</th>
              <th className="px-4 py-3 text-center">Compras</th>
              <th className="px-4 py-3 text-center">Archivo generado</th>
              <th className="px-4 py-3 text-center">Revisado</th>
              <th className="px-4 py-3 text-center">Declarado</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                  No se encontraron clientes activos.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <DashboardClientRow
                  key={client.id}
                  client={client}
                  isUpdating={updatingId === client.id}
                  isMenuOpen={openMenuId === client.id}
                  onMenuChange={onMenuChange}
                  onStatusChange={onStatusChange}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white border-t border-slate-200">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(filteredCount / limit) || 1}
          totalItems={filteredCount}
          pageSize={limit}
          onPageChange={onPageChange}
          onPageSizeChange={(newLimit) => {
            onPageSizeChange(newLimit);
            onPageChange(1);
          }}
          itemName="clientes"
        />
      </div>
    </div>
  );
}

function DashboardClientRow({
  client,
  isUpdating,
  isMenuOpen,
  onMenuChange,
  onStatusChange,
}: {
  client: DashboardClientInfo;
  isUpdating: boolean;
  isMenuOpen: boolean;
  onMenuChange: (id: number | null) => void;
  onStatusChange: (clientId: number, status: ClientPeriodStatus) => void;
}) {
  const milestones = [
    hasStatusOrHigher(client.status, ["ventas_cargadas", "generado", "revisado", "declarado"]),
    hasStatusOrHigher(client.status, ["compras_cargadas", "generado", "revisado", "declarado"]),
    hasStatusOrHigher(client.status, ["generado", "revisado", "declarado"]),
    hasStatusOrHigher(client.status, ["revisado", "declarado"]),
    hasStatusOrHigher(client.status, ["declarado"]),
  ];

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3 font-medium text-slate-800">{client.businessName}</td>
      <td className="px-4 py-3 text-slate-600">{client.ruc}</td>
      {milestones.map((isComplete, index) => (
        <td key={index} className="px-4 py-3 text-center">
          <MilestoneIcon active={isComplete} />
        </td>
      ))}
      <td className="px-4 py-3 text-center">
        <StatusBadge status={client.status} />
      </td>
      <td className="px-4 py-3 text-center">
        {isUpdating ? (
          <Loader2 className="w-4 h-4 animate-spin text-blue-500 mx-auto" />
        ) : (
          <StatusMenu clientId={client.id} isOpen={isMenuOpen} onMenuChange={onMenuChange} onStatusChange={onStatusChange} />
        )}
      </td>
    </tr>
  );
}

function SearchInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full pl-9 pr-8 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {value && (
          <button className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors" onClick={() => onChange("")} type="button">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function MilestoneIcon({ active }: { active: boolean }) {
  if (active) return <CheckCircle2 className="w-5 h-5 mx-auto text-green-500" />;
  return <div className="w-4 h-4 mx-auto rounded-full border-2 border-slate-200" />;
}

function StatusBadge({ status }: { status: ClientPeriodStatus }) {
  const styles: Record<ClientPeriodStatus, string> = {
    pendiente: "bg-orange-100 text-orange-700",
    ventas_cargadas: "bg-green-100 text-green-700",
    compras_cargadas: "bg-purple-100 text-purple-700",
    generado: "bg-teal-100 text-teal-700",
    revisado: "bg-blue-100 text-blue-700",
    declarado: "bg-green-100 text-green-700 border border-green-200",
  };
  const labels: Record<ClientPeriodStatus, string> = {
    pendiente: "Pendiente",
    ventas_cargadas: "Ventas cargadas",
    compras_cargadas: "Compras cargadas",
    generado: "Generado",
    revisado: "Revisado",
    declarado: "Declarado",
  };

  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
}

function StatusMenu({
  clientId,
  isOpen,
  onMenuChange,
  onStatusChange,
}: {
  clientId: number;
  isOpen: boolean;
  onMenuChange: (id: number | null) => void;
  onStatusChange: (clientId: number, status: ClientPeriodStatus) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="relative">
        <button
          onClick={(event) => {
            event.stopPropagation();
            onMenuChange(isOpen ? null : clientId);
          }}
          className="p-1.5 text-slate-500 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
          title="Cambiar estado"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-md shadow-xl py-1 z-10" onClick={(event) => event.stopPropagation()}>
            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-100 mb-1">
              Cambiar estado
            </div>
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onStatusChange(clientId, option.value);
                  onMenuChange(null);
                }}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 text-slate-700"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
