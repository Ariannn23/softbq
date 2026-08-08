import { useCallback, useEffect, useState } from "react";

import { fetchClients } from "../../clients/services/clientsApi";
import type { Client } from "../../shared/types";
import { getConversions, type ConversionHistoryResponse } from "../services/conversionsApi";

export function useConversionsPage() {
  const [period, setPeriod] = useState("");
  const [clientId, setClientId] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [data, setData] = useState<ConversionHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchClients().then(setClientsData).catch(console.error);
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await getConversions({ period, clientId, status, page, limit });
      setData(response);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [period, clientId, status, page, limit]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const clearFilters = () => {
    setPeriod("");
    setClientId("all");
    setStatus("all");
    setPage(1);
  };

  const downloadFile = (conversionId: number, fileId: number) => {
    window.location.href = `/api/conversions/${conversionId}/download/${fileId}`;
  };

  return {
    filters: {
      period,
      setPeriod,
      clientId,
      setClientId,
      status,
      setStatus,
      clear: clearFilters,
    },
    pagination: {
      page,
      setPage,
      limit,
      setLimit,
    },
    clientsData,
    data,
    isLoading,
    isError,
    reload: loadData,
    downloadFile,
  };
}
