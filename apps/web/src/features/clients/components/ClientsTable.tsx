import { Ban, Pencil, UserCheck, XCircle, Eye } from "lucide-react";

import type { Client, SessionUser } from "../../shared/types";
import { IconButton, StatusPill, TableRowsSkeleton } from "../../shared/ui";

export function ClientsTable({
  clients,
  loading,
  onEdit,
  onToggleClient,
  onView,
  user
}: {
  clients: Client[];
  loading: boolean;
  onEdit: (client: Client) => void;
  onToggleClient: (client: Client, action: "disable" | "enable") => void;
  onView: (client: Client) => void;
  user: SessionUser;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[1120px] w-full text-left text-sm">
        <thead className="bg-[#f2f8fe] text-xs font-bold text-[#072d4a]">
          <tr>
            <th className="px-5 py-4">RUC</th>
            <th className="px-5 py-4">Razon social</th>
            <th className="px-5 py-4">Nombre corto</th>
            <th className="px-5 py-4">Estado</th>
            <th className="px-5 py-4">Codigo entidad Contasis</th>
            <th className="px-5 py-4">Descripcion entidad Contasis</th>
            <th className="px-5 py-4">IGV por defecto</th>
            <th className="px-5 py-4">Ventas Base</th>
            <th className="px-5 py-4">Ventas Total</th>
            <th className="px-5 py-4">Compras Base</th>
            <th className="px-5 py-4">Compras Total</th>
            <th className="px-5 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading && clients.length === 0 ? <TableRowsSkeleton columns={8} rows={10} /> : null}
          {!loading && clients.length === 0 ? (
            <tr>
              <td className="px-5 py-8 text-[#53698d]" colSpan={12}>No hay clientes registrados.</td>
            </tr>
          ) : null}
          {clients.length > 0
            ? clients.map((client) => (
                <tr className={`border-t border-[#e2edf8] ${loading ? "opacity-50" : ""}`} key={client.id}>
                  <td className="px-5 py-4 font-mono">{client.ruc}</td>
                  <td className="px-5 py-4 font-medium">{client.businessName}</td>
                  <td className="px-5 py-4">{client.shortName}</td>
                  <td className="px-5 py-4"><StatusPill label={client.active ? "Activo" : "Inactivo"} tone={client.active ? "green" : "gray"} /></td>
                  <td className="px-5 py-4">{client.contasisEntityCode}</td>
                  <td className="px-5 py-4">{client.contasisEntityDescription}</td>
                  <td className="px-5 py-4">{client.defaultIgvPercent}%</td>
                  <td className="px-5 py-4 font-mono">{client.salesBaseAccount || "-"}</td>
                  <td className="px-5 py-4 font-mono">{client.salesTotalAccount || "-"}</td>
                  <td className="px-5 py-4 font-mono">{client.purchasesBaseAccount || "-"}</td>
                  <td className="px-5 py-4 font-mono">{client.purchasesTotalAccount || "-"}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <IconButton disabled={!client.active || loading} icon={Eye} label="Ver detalles" onClick={() => onView(client)} tone="purple" />
                      {user.role !== "assistant" && (
                        <IconButton disabled={!client.active || loading} icon={Pencil} label="Editar" onClick={() => onEdit(client)} tone="blue" />
                      )}
                      {user.role === "admin" && (
                        client.active ? (
                          <IconButton disabled={loading} icon={Ban} label="Inhabilitar" onClick={() => onToggleClient(client, "disable")} tone="red" />
                        ) : (
                          <IconButton disabled={loading} icon={UserCheck} label="Habilitar" onClick={() => onToggleClient(client, "enable")} tone="green" />
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
}
