import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import {
  type ClientPeriodStatus,
  type DashboardResponse,
  getDashboardData,
  updateClientPeriodStatus,
} from "../services/dashboardApi";

export function useDashboardPage({ clientsVersion }: { clientsVersion?: number }) {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
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
      const response = await getDashboardData(period);
      setData(response);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [period, clientsVersion]);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

  const resetPeriod = () => {
    const date = new Date();
    setSelectedMonth(date.getMonth() + 1);
    setSelectedYear(date.getFullYear());
  };

  const handleStatusChange = async (clientId: number, newStatus: ClientPeriodStatus) => {
    setUpdatingId(clientId);
    const toastId = toast.loading("Actualizando estado...");
    try {
      await updateClientPeriodStatus(clientId, period, newStatus);
      await loadData();
      toast.success("Estado actualizado exitosamente", { id: toastId });
    } catch (error) {
      toast.error("Error al actualizar el estado", { id: toastId });
    } finally {
      setUpdatingId(null);
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
    updatingId,
    openMenuId,
    setOpenMenuId,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    limit,
    setLimit,
    filteredClients,
    paginatedClients,
    resetPeriod,
    handleStatusChange,
  };
}
