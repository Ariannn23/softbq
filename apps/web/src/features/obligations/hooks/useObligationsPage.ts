import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { OBLIGATION_COLUMNS } from "../config";
import {
  type ObligationClient,
  type ObligationsResponse,
  getObligationsData,
  updateObligationStatus,
} from "../services/obligationsApi";

export function useObligationsPage() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [data, setData] = useState<ObligationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const period = `${selectedYear}${selectedMonth.toString().padStart(2, "0")}`;

  const years = useMemo(() => {
    const year = new Date().getFullYear();
    return Array.from({ length: 5 }).map((_, index) => year - index);
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await getObligationsData(period);
      setData(response);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void loadData();
    setPage(1);
  }, [loadData]);

  const filteredClients = useMemo(() => {
    if (!data) return [];
    const normalizedSearch = searchTerm.toLowerCase();
    return data.clients.filter(
      (client) => client.businessName.toLowerCase().includes(normalizedSearch) || client.ruc.includes(searchTerm),
    );
  }, [data, searchTerm]);

  const paginatedClients = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredClients.slice(start, start + limit);
  }, [filteredClients, page, limit]);

  const kpis = useMemo(() => {
    if (!data) return null;

    return OBLIGATION_COLUMNS.map((column) => {
      const total = data.clients.filter((client) => Boolean(client[column.requiredField])).length;
      const done = data.clients.filter((client) => Boolean(client[column.requiredField]) && Boolean(client[column.declaredField])).length;
      return {
        title: column.label,
        total,
        done,
        pending: total - done,
      };
    });
  }, [data]);

  const resetPeriod = () => {
    const date = new Date();
    setSelectedMonth(date.getMonth() + 1);
    setSelectedYear(date.getFullYear());
  };

  const toggleObligation = async (clientId: number, field: keyof ObligationClient, currentValue: boolean) => {
    const updateKey = `${clientId}-${field}`;

    setData((previous) => {
      if (!previous) return previous;
      return {
        ...previous,
        clients: previous.clients.map((client) => (client.id === clientId ? { ...client, [field]: !currentValue } : client)),
      };
    });

    setUpdatingIds((previous) => new Set(previous).add(updateKey));

    try {
      await updateObligationStatus(clientId, period, field, !currentValue);
    } catch (error) {
      toast.error("Error al guardar estado");
      setData((previous) => {
        if (!previous) return previous;
        return {
          ...previous,
          clients: previous.clients.map((client) => (client.id === clientId ? { ...client, [field]: currentValue } : client)),
        };
      });
    } finally {
      setUpdatingIds((previous) => {
        const next = new Set(previous);
        next.delete(updateKey);
        return next;
      });
    }
  };

  return {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    years,
    data,
    isLoading,
    isError,
    updatingIds,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    limit,
    setLimit,
    filteredClients,
    paginatedClients,
    kpis,
    resetPeriod,
    toggleObligation,
  };
}
