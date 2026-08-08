import { useNavigate } from "react-router-dom";
import { useState } from "react";

import type { SessionUser, Client } from "../../shared/types";
import { ConfirmModal } from "../../shared/ConfirmModal";
import { ClientForm } from "../components/ClientForm";
import { ClientDetailsModal } from "../components/ClientDetailsModal";
import { ClientsListPanel } from "../components/ClientsListPanel";
import { ClientsPageHeader } from "../components/ClientsPageHeader";
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
  const [viewingClient, setViewingClient] = useState<Client | null>(null);

  return (
    <div className="mx-auto max-w-[1540px] px-7 py-8">
      <ClientsPageHeader user={user} onImport={() => navigate("/clients/import")} onCreate={state.startCreate} />

      <ClientsListPanel
        clients={state.paginatedClients}
        currentPage={state.currentPage}
        loading={state.loading}
        pageSize={10}
        search={state.search}
        totalItems={state.clients.length}
        totalPages={state.totalPages}
        user={user}
        onEdit={state.startEdit}
        onPageChange={state.setCurrentPage}
        onSearchChange={state.setSearch}
        onToggleClient={(client, action) => void state.startToggleClient(client, action)}
        onView={setViewingClient}
      />

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
