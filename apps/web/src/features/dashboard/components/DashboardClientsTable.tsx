import { Eye } from "lucide-react";

import type { Client } from "../../shared/types";
import { StatusDot, StatusPill, TableRowsSkeleton } from "../../shared/ui";

export function DashboardClientsTable({
  clients,
  loading,
  onOpenClients
}: {
  clients: Client[];
  loading: boolean;
  onOpenClients: () => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[#f2f8fe] text-xs font-semibold text-[#072d4a]">
          <tr>
            <th className="px-5 py-3">Cliente</th>
            <th className="px-5 py-3">RUC</th>
            <th className="px-5 py-3 text-center">Ventas</th>
            <th className="px-5 py-3 text-center">Compras</th>
            <th className="px-5 py-3 text-center">Archivo generado</th>
            <th className="px-5 py-3 text-center">Revisado</th>
            <th className="px-5 py-3 text-center">Declarado</th>
            <th className="px-5 py-3">Estado</th>
            <th className="px-5 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <TableRowsSkeleton columns={9} rows={6} /> : null}
          {!loading && clients.slice(0, 6).map((client) => (
            <tr className="border-t border-[#e2edf8]" key={client.id}>
              <td className="px-5 py-3 font-medium">{client.businessName}</td>
              <td className="px-5 py-3 font-mono">{client.ruc}</td>
              <StatusDot checked={false} />
              <StatusDot checked={false} />
              <StatusDot checked={false} />
              <StatusDot checked={false} />
              <StatusDot checked={false} />
              <td className="px-5 py-3"><StatusPill label={client.active ? "Pendiente" : "Inactivo"} tone={client.active ? "orange" : "gray"} /></td>
              <td className="px-5 py-3 text-right">
                <button className="rounded-md border border-[#c9dbef] px-3 py-2 text-[#0a4770]" onClick={onOpenClients} type="button">
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
          {!loading && clients.length === 0 ? (
            <tr>
              <td className="px-5 py-8 text-[#53698d]" colSpan={9}>No hay clientes para mostrar.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
