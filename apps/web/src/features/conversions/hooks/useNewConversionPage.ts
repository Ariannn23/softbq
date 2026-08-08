import { type FormEvent, useEffect, useMemo, useState } from "react";

import { fetchClients } from "../../clients/services/clientsApi";
import type { Client } from "../../shared/types";
import { validateConversions } from "../services/conversionsApi";

export function useNewConversionPage({
  onValidated,
}: {
  onValidated: (validation: Awaited<ReturnType<typeof validateConversions>>) => void;
}) {
  const now = useMemo(() => new Date(), []);
  const years = useMemo(() => Array.from({ length: 10 }, (_, index) => String(now.getFullYear() - index)), [now]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  const [salesFile, setSalesFile] = useState<File | null>(null);
  const [purchasesFile, setPurchasesFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients()
      .then((data) => {
        const activeClients = data.filter((client) => client.active);
        setClients(activeClients);
        const firstClient = activeClients[0];
        if (firstClient) {
          setClientId(firstClient.id.toString());
        }
      })
      .catch(console.error);
  }, []);

  const setFileFromDrop = (event: React.DragEvent<HTMLDivElement>, type: "sales" | "purchases") => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file || (!file.name.endsWith(".txt") && !file.name.endsWith(".csv"))) return;

    if (type === "sales") setSalesFile(file);
    else setPurchasesFile(file);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!clientId) {
      setError("Debe seleccionar un cliente.");
      return;
    }

    const period = `${selectedYear}${selectedMonth}`;
    if (!/^\d{6}$/.test(period)) {
      setError("El periodo debe tener el formato YYYYMM.");
      return;
    }

    if (!salesFile && !purchasesFile) {
      setError("Debe cargar al menos un archivo (Ventas o Compras) para continuar.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await validateConversions({
        clientId,
        period,
        salesFile: salesFile || undefined,
        purchasesFile: purchasesFile || undefined,
      });
      onValidated(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error validando los archivos.");
      setIsSubmitting(false);
    }
  };

  return {
    clients,
    clientId,
    setClientId,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    years,
    salesFile,
    setSalesFile,
    purchasesFile,
    setPurchasesFile,
    isSubmitting,
    error,
    setFileFromDrop,
    submit,
  };
}
