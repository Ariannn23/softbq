import { useEffect, useState } from "react";

import { fetchClients } from "../../clients/services/clientsApi";
import type { Client } from "../../shared/types";
import { type ClientBillingHistory, getBillingHistory } from "../services/billingApi";

export function useBillingHistoryPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [history, setHistory] = useState<ClientBillingHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients()
      .then((data) => setClients(data.filter((client) => client.active)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!clientId) {
      setHistory(null);
      return;
    }

    async function fetchHistory() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getBillingHistory(Number(clientId));
        setHistory(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar el historial del cliente");
      } finally {
        setIsLoading(false);
      }
    }

    void fetchHistory();
  }, [clientId]);

  return {
    clients,
    clientId,
    setClientId,
    history,
    isLoading,
    error,
  };
}
