import { Calendar, CheckCircle, Eye, FileSpreadsheet, Files, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { Client } from "../../shared/types";
import { fetchClients } from "../../clients/services/clientsApi";

export function useDashboardPage(clientsVersion: number) {
  const [clients, setClients] = useState<Client[]>([]);
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const activeClients = clients.filter((client) => client.active).length;
  const inactiveClients = clients.length - activeClients;
  const filteredClients = useMemo(() => {
    const search = dashboardSearch.trim().toLowerCase();

    if (!search) {
      return clients;
    }

    return clients.filter((client) =>
      client.ruc.includes(search) ||
      client.businessName.toLowerCase().includes(search) ||
      client.shortName.toLowerCase().includes(search)
    );
  }, [clients, dashboardSearch]);
  const metrics = [
    { label: "Clientes activos", value: activeClients, help: "Total de clientes", icon: Users, tone: "blue" },
    { label: "Pendientes", value: activeClients, help: "Clientes pendientes", icon: Calendar, tone: "orange" },
    { label: "Ventas procesadas", value: 0, help: "Ventas cargadas", icon: FileSpreadsheet, tone: "green" },
    { label: "Compras procesadas", value: 0, help: "Compras cargadas", icon: Files, tone: "purple" },
    { label: "Archivos generados", value: 0, help: "Archivos generados", icon: Files, tone: "teal" },
    { label: "Clientes revisados", value: 0, help: "Clientes revisados", icon: Eye, tone: "blue" },
    { label: "Clientes declarados", value: 0, help: "Clientes declarados", icon: CheckCircle, tone: "green" }
  ] as const;

  useEffect(() => {
    async function loadClients() {
      setLoading(true);

      try {
        setClients(await fetchClients());
      } finally {
        setLoading(false);
      }
    }

    void loadClients();
  }, [clientsVersion]);

  return {
    dashboardSearch,
    filteredClients,
    inactiveClients,
    loading,
    metrics,
    setDashboardSearch
  };
}
