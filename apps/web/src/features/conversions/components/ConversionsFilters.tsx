import { Calendar, Filter, RefreshCcw } from "lucide-react";

import type { Client } from "../../shared/types";

type ConversionsFiltersProps = {
  period: string;
  clientId: string;
  status: string;
  clients: Client[];
  onPeriodChange: (value: string) => void;
  onClientChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
};

export function ConversionsFilters({
  period,
  clientId,
  status,
  clients,
  onPeriodChange,
  onClientChange,
  onStatusChange,
  onClear,
}: ConversionsFiltersProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-700">
        <Filter className="w-4 h-4" />
        Filtros
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">Periodo</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Ej. 202405"
              value={period}
              onChange={(event) => onPeriodChange(event.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-1.5 lg:col-span-1">
          <label className="text-xs font-medium text-slate-600">Cliente</label>
          <select
            value={clientId}
            onChange={(event) => onClientChange(event.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">Seleccione un cliente...</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.businessName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">Estado</label>
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">Todos los estados</option>
            <option value="generated">Completada</option>
            <option value="processing">En proceso</option>
            <option value="error">Con errores</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        <div className="pt-2 md:pt-0 flex items-center justify-end">
          <button onClick={onClear} className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors">
            <RefreshCcw className="w-4 h-4" />
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
