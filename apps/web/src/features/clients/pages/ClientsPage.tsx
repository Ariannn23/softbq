import { PlusCircle, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { SessionUser } from "../../shared/types";
import { SearchBox } from "../../shared/ui";
import { ClientForm } from "../components/ClientForm";
import { ClientsTable } from "../components/ClientsTable";
import { useClientsPage } from "../hooks/useClientsPage";

export function ClientsPage({
  onClientsChanged,
  user
}: {
  onClientsChanged: () => void;
  user: SessionUser;
}) {
  const navigate = useNavigate();
  const state = useClientsPage(onClientsChanged);

  return (
    <div className="mx-auto max-w-[1540px] px-7 py-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="mt-2 text-[#26466f]">Administra la base de clientes del estudio.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex h-12 items-center gap-3 rounded-md border border-[#c9dbef] bg-white px-6 font-semibold text-[#007fcb] disabled:opacity-60" disabled={user.role !== "admin"} onClick={() => navigate("/importar-clientes")} type="button">
            <Upload size={20} />
            Importar clientes
          </button>
          <button className="flex h-12 items-center gap-3 rounded-md bg-[#007fcb] px-6 font-semibold text-white" onClick={state.startCreate} type="button">
            <PlusCircle size={20} />
            Crear cliente
          </button>
        </div>
      </div>

      <section className="mt-7 overflow-hidden rounded-lg border border-[#d8e8f6] bg-white shadow-sm">
        <div className="border-b border-[#d8e8f6] p-5">
          <SearchBox onChange={state.setSearch} placeholder="Buscar por RUC, razon social o nombre corto..." value={state.search} />
        </div>
        <ClientsTable
          clients={state.paginatedClients}
          loading={state.loading}
          onEdit={state.startEdit}
          onToggleClient={(client, action) => void state.toggleClient(client, action)}
          user={user}
        />
        <div className="flex items-center justify-between border-t border-[#e2edf8] px-5 py-4 text-sm text-[#53698d]">
          <span>Mostrando {state.pageStart} a {state.pageEnd} de {state.clients.length} clientes</span>
          <div className="flex items-center gap-3">
            <button className="rounded-md border border-[#c9dbef] px-4 py-2 disabled:opacity-50" disabled={state.currentPage === 1} onClick={() => state.setCurrentPage((page) => Math.max(page - 1, 1))} type="button">{"<"}</button>
            <span className="rounded-md bg-[#007fcb] px-4 py-2 font-semibold text-white">{state.currentPage}</span>
            <button className="rounded-md border border-[#c9dbef] px-4 py-2 disabled:opacity-50" disabled={state.currentPage >= state.totalPages} onClick={() => state.setCurrentPage((page) => Math.min(page + 1, state.totalPages))} type="button">{">"}</button>
            <button className="rounded-md border border-[#c9dbef] px-4 py-2" type="button">10</button>
            <span>por pagina</span>
          </div>
        </div>
      </section>

      {state.showForm ? (
        <ClientForm
          editingClient={state.editingClient}
          form={state.clientForm}
          onCancel={state.clearForm}
          onSubmit={(values) => void state.saveClient(values)}
        />
      ) : null}

      {state.message ? <p className="mt-5 rounded-md border border-[#d8e8f6] bg-white p-4 text-sm text-[#26466f]">{state.message}</p> : null}
    </div>
  );
}
