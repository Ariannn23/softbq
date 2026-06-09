import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { clientSchema, emptyClient, type Client, type ClientValues } from "../../shared/types";
import { fetchClients, saveClient as saveClientRequest, updateClientStatus } from "../services/clientsApi";

const pageSize = 10;

export function useClientsPage(onClientsChanged: () => void) {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmModalState, setConfirmModalState] = useState<{isOpen: boolean, client: Client | null, action: "enable" | "disable" | null}>({isOpen: false, client: null, action: null});
  const [currentPage, setCurrentPage] = useState(1);
  const clientForm = useForm<ClientValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: emptyClient
  });
  const totalPages = Math.max(Math.ceil(clients.length / pageSize), 1);
  const pageStart = clients.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const pageEnd = Math.min(currentPage * pageSize, clients.length);
  const paginatedClients = useMemo(
    () => clients.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [clients, currentPage]
  );

  async function loadClients(searchTerm = search) {
    setLoading(true);

    try {
      setClients(await fetchClients(searchTerm));
      setCurrentPage(1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo cargar clientes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadClients("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadClients(search);
    }, 250);

    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function startCreate() {
    setEditingClient(null);
    setShowForm(true);
    clientForm.reset(emptyClient);
  }

  function startEdit(client: Client) {
    if (!client.active) {
      toast.error("No se puede editar un cliente inhabilitado.");
      return;
    }

    setEditingClient(client);
    setShowForm(true);
    clientForm.reset(client);
  }

  function clearForm() {
    setEditingClient(null);
    setShowForm(false);
    clientForm.reset(emptyClient);
  }

  async function saveClient(values: ClientValues) {
    const toastId = toast.loading("Guardando cliente...");
    try {
      await saveClientRequest({
        clientId: editingClient?.id,
        values
      });
      toast.success(editingClient ? "Cliente actualizado." : "Cliente creado.", { id: toastId });
      clearForm();
      await loadClients();
      onClientsChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar el cliente.", { id: toastId });
    }
  }

  function startToggleClient(client: Client, action: "disable" | "enable") {
    setConfirmModalState({isOpen: true, client, action});
  }

  async function confirmToggleClient() {
    const { client, action } = confirmModalState;
    if (!client || !action) return;

    const toastId = toast.loading(`${action === "disable" ? "Inhabilitando" : "Habilitando"} cliente...`);
    try {
      await updateClientStatus({ action, clientId: client.id });
      toast.success(action === "disable" ? "Cliente inhabilitado." : "Cliente habilitado.", { id: toastId });
      await loadClients();
      onClientsChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el estado del cliente.", { id: toastId });
    } finally {
      setConfirmModalState({isOpen: false, client: null, action: null});
    }
  }

  return {
    clientForm,
    clients,
    clearForm,
    currentPage,
    editingClient,
    loading,
    confirmModalState,
    setConfirmModalState,
    confirmToggleClient,
    pageEnd,
    pageStart,
    paginatedClients,
    saveClient,
    search,
    setCurrentPage,
    setSearch,
    showForm,
    startCreate,
    startEdit,
    startToggleClient,
    totalPages
  };
}
