import { Loader2, Search, X } from "lucide-react";

import { Pagination } from "../../shared/Pagination";
import { OBLIGATION_COLUMNS } from "../config";
import type { ObligationClient } from "../services/obligationsApi";

type ObligationsTableProps = {
  clients: ObligationClient[];
  filteredCount: number;
  searchTerm: string;
  page: number;
  limit: number;
  updatingIds: Set<string>;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
  onToggle: (clientId: number, field: keyof ObligationClient, currentValue: boolean) => void;
};

export function ObligationsTable({
  clients,
  filteredCount,
  searchTerm,
  page,
  limit,
  updatingIds,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onToggle,
}: ObligationsTableProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="font-semibold text-slate-800 text-lg">Estado de obligaciones del periodo</h2>
        <SearchInput value={searchTerm} onChange={onSearchChange} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white text-slate-600 text-xs font-semibold border-b border-slate-200">
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">RUC</th>
              {OBLIGATION_COLUMNS.map((column) => (
                <th key={column.label} className="px-4 py-3 text-center">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  No se encontraron clientes activos.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{client.businessName}</td>
                  <td className="px-4 py-3 text-slate-600">{client.ruc}</td>
                  {OBLIGATION_COLUMNS.map((column) => (
                    <td key={column.label} className="px-4 py-3 text-center">
                      <ObligationCheckbox
                        client={client}
                        requiredField={column.requiredField}
                        declaredField={column.declaredField}
                        updatingIds={updatingIds}
                        onToggle={onToggle}
                      />
                    </td>
                  ))}
                </tr>
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

function ObligationCheckbox({
  client,
  requiredField,
  declaredField,
  updatingIds,
  onToggle,
}: {
  client: ObligationClient;
  requiredField: keyof ObligationClient;
  declaredField: keyof ObligationClient;
  updatingIds: Set<string>;
  onToggle: (clientId: number, field: keyof ObligationClient, currentValue: boolean) => void;
}) {
  const isRequired = Boolean(client[requiredField]);
  const isDeclared = Boolean(client[declaredField]);
  const isUpdating = updatingIds.has(`${client.id}-${declaredField}`);

  if (!isRequired) {
    return <div className="text-slate-300 text-xs font-semibold">N/A</div>;
  }

  if (isUpdating) {
    return <Loader2 className="w-5 h-5 text-blue-500 animate-spin mx-auto" />;
  }

  return (
    <input
      type="checkbox"
      className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
      checked={isDeclared}
      onChange={() => onToggle(client.id, declaredField, isDeclared)}
    />
  );
}
