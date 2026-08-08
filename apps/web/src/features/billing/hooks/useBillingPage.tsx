import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

import { fetchClients } from "../../clients/services/clientsApi";
import type { Client } from "../../shared/types";
import { DEFAULT_CHARGE_CONCEPT } from "../config";
import {
  type BillingCharge,
  createBillingCharge,
  createBillingPayment,
  generateMonthlyCharges,
  getBillingCharges,
  updateBillingChargeAmount,
} from "../services/billingApi";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function useBillingPage() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [charges, setCharges] = useState<BillingCharge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [paymentChargeId, setPaymentChargeId] = useState<number | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Yape");
  const [paymentDate, setPaymentDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [showNewCharge, setShowNewCharge] = useState(false);
  const [newChargeClientId, setNewChargeClientId] = useState<number | "">("");
  const [newChargeConcept, setNewChargeConcept] = useState(DEFAULT_CHARGE_CONCEPT);
  const [newChargeAmount, setNewChargeAmount] = useState("");
  const [isSubmittingCharge, setIsSubmittingCharge] = useState(false);
  const [editingAmountChargeId, setEditingAmountChargeId] = useState<number | null>(null);
  const [editingAmountValue, setEditingAmountValue] = useState("");
  const [isSubmittingAmount, setIsSubmittingAmount] = useState(false);

  const selectedPeriod = `${selectedYear}${selectedMonth.toString().padStart(2, "0")}`;

  const fetchCharges = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await getBillingCharges(selectedPeriod);
      setCharges(response.charges);
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    void fetchCharges();
  }, [fetchCharges]);

  useEffect(() => {
    if (showNewCharge && clients.length === 0) {
      fetchClients().then(setClients).catch(console.error);
    }
  }, [showNewCharge, clients.length]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedMonth, selectedYear]);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  }, []);

  const activeChargeForPayment = useMemo(
    () => charges.find((charge) => charge.id === paymentChargeId),
    [charges, paymentChargeId],
  );

  const filteredCharges = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    return charges.filter(
      (charge) =>
        charge.client.businessName.toLowerCase().includes(normalizedSearch) ||
        charge.client.ruc.includes(searchTerm),
    );
  }, [charges, searchTerm]);

  const paginatedCharges = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredCharges.slice(start, start + limit);
  }, [filteredCharges, page, limit]);

  const totals = useMemo(
    () => ({
      totalCollected: charges.reduce((acc, charge) => acc + charge.paidAmount, 0),
      totalDebt: charges.reduce((acc, charge) => acc + charge.totalAmount - charge.paidAmount, 0),
      clientsWithDebt: charges.filter((charge) => charge.status !== "pagado").length,
    }),
    [charges],
  );

  const openPaymentPanel = (charge: BillingCharge) => {
    setPaymentChargeId(charge.id);
    setPaymentAmount((charge.totalAmount - charge.paidAmount).toString());
  };

  const closePaymentPanel = () => {
    setPaymentChargeId(null);
    setPaymentAmount("");
    setPaymentNotes("");
  };

  const openEditAmountModal = (charge: BillingCharge) => {
    setEditingAmountChargeId(charge.id);
    setEditingAmountValue(charge.totalAmount.toString());
  };

  const handleCreateCharge = async () => {
    if (!newChargeClientId) {
      toast.error("Selecciona un cliente.");
      return;
    }

    const amount = Number.parseFloat(newChargeAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Ingrese un monto valido.");
      return;
    }

    setIsSubmittingCharge(true);
    const toastId = toast.loading("Creando cargo...");
    try {
      await createBillingCharge({
        clientId: Number(newChargeClientId),
        period: selectedPeriod,
        concept: newChargeConcept,
        totalAmount: amount,
      });
      setShowNewCharge(false);
      setNewChargeClientId("");
      setNewChargeAmount("");
      setNewChargeConcept(DEFAULT_CHARGE_CONCEPT);
      toast.success("Cargo creado exitosamente.", { id: toastId });
      void fetchCharges();
    } catch (error) {
      toast.error(getErrorMessage(error, "Error al crear el cargo."), { id: toastId });
    } finally {
      setIsSubmittingCharge(false);
    }
  };

  const executeGenerateMonthly = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("Generando deudas...");
    try {
      const { generated } = await generateMonthlyCharges(selectedPeriod);
      if (generated > 0) {
        toast.success(`Se generaron ${generated} nuevas deudas de honorarios.`, { id: toastId });
        void fetchCharges();
      } else {
        toast("No hay nuevas deudas que agregar para el mes.", {
          id: toastId,
          icon: <AlertCircle className="text-[#056ba6]" />,
        });
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Error al generar deudas."), { id: toastId });
    } finally {
      setIsGenerating(false);
      setShowConfirmModal(false);
    }
  };

  const handleSavePayment = async () => {
    if (!paymentChargeId) return;

    const amount = Number.parseFloat(paymentAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Ingrese un monto valido.");
      return;
    }

    setIsSubmittingPayment(true);
    const toastId = toast.loading("Registrando pago...");
    try {
      await createBillingPayment(paymentChargeId, {
        amount,
        paymentMethod,
        paymentDate,
        notes: paymentNotes || undefined,
      });
      closePaymentPanel();
      toast.success("Pago registrado correctamente.", { id: toastId });
      void fetchCharges();
    } catch (error) {
      toast.error(getErrorMessage(error, "Error al registrar el pago."), { id: toastId });
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleSaveAmount = async () => {
    if (!editingAmountChargeId) return;

    const amount = Number.parseFloat(editingAmountValue);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Ingrese un monto valido mayor a 0.");
      return;
    }

    setIsSubmittingAmount(true);
    const toastId = toast.loading("Actualizando monto...");
    try {
      await updateBillingChargeAmount(editingAmountChargeId, amount);
      setEditingAmountChargeId(null);
      setEditingAmountValue("");
      toast.success("Monto actualizado correctamente.", { id: toastId });
      void fetchCharges();
    } catch (error) {
      toast.error(getErrorMessage(error, "Error al actualizar el monto."), { id: toastId });
    } finally {
      setIsSubmittingAmount(false);
    }
  };

  return {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    selectedPeriod,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    limit,
    setLimit,
    years,
    charges,
    filteredCharges,
    paginatedCharges,
    isLoading,
    isError,
    isGenerating,
    showConfirmModal,
    setShowConfirmModal,
    clients,
    totals,
    payment: {
      charge: activeChargeForPayment,
      amount: paymentAmount,
      setAmount: setPaymentAmount,
      method: paymentMethod,
      setMethod: setPaymentMethod,
      date: paymentDate,
      setDate: setPaymentDate,
      notes: paymentNotes,
      setNotes: setPaymentNotes,
      isSubmitting: isSubmittingPayment,
      close: closePaymentPanel,
      save: handleSavePayment,
    },
    newCharge: {
      isOpen: showNewCharge,
      open: () => setShowNewCharge(true),
      close: () => setShowNewCharge(false),
      clientId: newChargeClientId,
      setClientId: setNewChargeClientId,
      concept: newChargeConcept,
      setConcept: setNewChargeConcept,
      amount: newChargeAmount,
      setAmount: setNewChargeAmount,
      isSubmitting: isSubmittingCharge,
      save: handleCreateCharge,
    },
    editAmount: {
      isOpen: editingAmountChargeId !== null,
      value: editingAmountValue,
      setValue: setEditingAmountValue,
      isSubmitting: isSubmittingAmount,
      close: () => setEditingAmountChargeId(null),
      save: handleSaveAmount,
    },
    actions: {
      openPaymentPanel,
      openEditAmountModal,
      generateMonthly: () => setShowConfirmModal(true),
      executeGenerateMonthly,
    },
  };
}
