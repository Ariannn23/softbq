import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { clientSchema, emptyClient, type Client, type ClientValues } from "../../shared/types";
import { fetchClients, saveClient as saveClientRequest, updateClientStatus } from "../services/clientsApi";

const pageSize = 10;

export function useClientsPage(onClientsChanged: () => void) {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
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
      setMessage(error instanceof Error ? error.message : "No se pudo cargar clientes.");
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
    setMessage(null);
    clientForm.reset(emptyClient);
  }

  function startEdit(client: Client) {
    if (!client.active) {
      setMessage("No se puede editar un cliente inhabilitado.");
      return;
    }

    setEditingClient(client);
    setShowForm(true);
    setMessage(null);
    clientForm.reset(client);
  }

  function clearForm() {
    setEditingClient(null);
    setShowForm(false);
    setMessage(null);
    clientForm.reset(emptyClient);
  }

  async function saveClient(values: ClientValues) {
    setMessage(null);

    try {
      await saveClientRequest({
        clientId: editingClient?.id,
        values
      });
      setMessage(editingClient ? "Cliente actualizado." : "Cliente creado.");
      clearForm();
      await loadClients();
      onClientsChanged();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar el cliente.");
    }
  }

  async function toggleClient(client: Client, action: "disable" | "enable") {
    const confirmed = window.confirm(`${action === "disable" ? "Inhabilitar" : "Habilitar"} cliente ${client.shortName}?`);

    if (!confirmed) {
      return;
    }

    try {
      await updateClientStatus({ action, clientId: client.id });
      setMessage(action === "disable" ? "Cliente inhabilitado." : "Cliente habilitado.");
      await loadClients();
      onClientsChanged();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo actualizar el estado del cliente.");
    }
  }

  return {
    clientForm,
    clients,
    clearForm,
    currentPage,
    editingClient,
    loading,
    message,
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
    toggleClient,
    totalPages
  };
}
