import { Ban, Pencil, UserCheck, XCircle } from "lucide-react";

import type { Client, SessionUser } from "../../shared/types";
import { IconButton, StatusPill, TableRowsSkeleton } from "../../shared/ui";

export function ClientsTable({
  clients,
  loading,
  onEdit,
  onToggleClient,
  user
}: {
  clients: Client[];
  loading: boolean;
  onEdit: (client: Client) => void;
  onToggleClient: (client: Client, action: "disable" | "enable") => void;
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
            <th className="px-5 py-4">Condicion por defecto</th>
            <th className="px-5 py-4">Medio de pago por defecto</th>
            <th className="px-5 py-4">IGV por defecto</th>
            <th className="px-5 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <TableRowsSkeleton columns={10} rows={10} /> : null}
          {!loading && clients.length === 0 ? (
            <tr>
              <td className="px-5 py-8 text-[#53698d]" colSpan={10}>No hay clientes registrados.</td>
            </tr>
          ) : null}
          {!loading
            ? clients.map((client) => (
                <tr className="border-t border-[#e2edf8]" key={client.id}>
                  <td className="px-5 py-4 font-mono">{client.ruc}</td>
                  <td className="px-5 py-4 font-medium">{client.businessName}</td>
                  <td className="px-5 py-4">{client.shortName}</td>
                  <td className="px-5 py-4"><StatusPill label={client.active ? "Activo" : "Inactivo"} tone={client.active ? "green" : "gray"} /></td>
                  <td className="px-5 py-4">{client.contasisEntityCode}</td>
                  <td className="px-5 py-4">{client.contasisEntityDescription}</td>
                  <td className="px-5 py-4">{client.defaultCondition}</td>
                  <td className="px-5 py-4">{client.defaultPaymentMethod}</td>
                  <td className="px-5 py-4">{client.defaultIgvPercent}%</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <IconButton disabled={!client.active} icon={Pencil} label="Editar" onClick={() => onEdit(client)} tone="blue" />
                      {client.active ? (
                        <IconButton icon={Ban} label="Inhabilitar" onClick={() => onToggleClient(client, "disable")} tone="red" />
                      ) : user.role === "admin" ? (
                        <IconButton icon={UserCheck} label="Habilitar" onClick={() => onToggleClient(client, "enable")} tone="green" />
                      ) : (
                        <IconButton disabled icon={XCircle} label="Inactivo" tone="gray" />
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
