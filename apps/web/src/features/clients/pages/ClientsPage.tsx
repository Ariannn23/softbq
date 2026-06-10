import { PlusCircle, Upload, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { SessionUser, Client } from "../../shared/types";
import { SearchBox } from "../../shared/ui";
import { ConfirmModal } from "../../shared/ConfirmModal";
import { ClientForm } from "../components/ClientForm";
import { ClientsTable } from "../components/ClientsTable";
import { ClientDetailsModal } from "../components/ClientDetailsModal";
import { useClientsPage } from "../hooks/useClientsPage";
import { Pagination } from "../../shared/Pagination";
import { useState } from "react";

export function ClientsPage({
  onClientsChanged,
  user
}: {
  onClientsChanged: () => void;
  user: SessionUser;
}) {
  const navigate = useNavigate();
  const state = useClientsPage(onClientsChanged);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);

  return (
    <div className="mx-auto max-w-[1540px] px-7 py-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="mt-2 text-[#26466f]">Administra la base de clientes del estudio.</p>
        </div>
        <div className="flex gap-4">
          <a href="/formato_clientes.xlsx" download className="flex h-[42.4px] items-center gap-3 rounded-md border border-[#c9dbef] bg-white px-6 font-semibold text-[#056ba6] transition-colors hover:bg-slate-50">
            <Download size={20} />
            Descargar formato
          </a>
          <button className="flex h-[42.4px] items-center gap-3 rounded-md border border-[#c9dbef] bg-white px-6 font-semibold text-[#056ba6] hover:bg-slate-50 transition-colors" onClick={() => navigate("/clients/import")} type="button">
            <Upload size={20} />
            Importar clientes
          </button>
          <button className="flex h-[42.4px] items-center gap-3 rounded-md bg-[#056ba6] px-6 font-semibold text-white hover:bg-[#045585] transition-colors" onClick={state.startCreate} type="button">
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
          onToggleClient={(client, action) => void state.startToggleClient(client, action)}
          onView={(client) => setViewingClient(client)}
          user={user}
        />
        <Pagination
          currentPage={state.currentPage}
          totalPages={state.totalPages}
          totalItems={state.clients.length}
          pageSize={10}
          onPageChange={state.setCurrentPage}
          itemName="clientes"
        />
      </section>

      {state.showForm ? (
        <ClientForm
          editingClient={state.editingClient}
          form={state.clientForm}
          onCancel={state.clearForm}
          onSubmit={(values) => void state.saveClient(values)}
        />
      ) : null}

      <ConfirmModal
        confirmText={state.confirmModalState.action === "disable" ? "S, inhabilitar" : "S, habilitar"}
        isOpen={state.confirmModalState.isOpen}
        message={`Seguro que quieres ${state.confirmModalState.action === "disable" ? "inhabilitar" : "habilitar"} al cliente ${state.confirmModalState.client?.businessName}?`}
        onClose={() => state.setConfirmModalState({ isOpen: false, client: null, action: null })}
        onConfirm={() => void state.confirmToggleClient()}
        title={`${state.confirmModalState.action === "disable" ? "Inhabilitar" : "Habilitar"} cliente`}
      />

      <ClientDetailsModal
        client={viewingClient}
        isOpen={Boolean(viewingClient)}
        onClose={() => setViewingClient(null)}
      />
    </div>
  );
}
