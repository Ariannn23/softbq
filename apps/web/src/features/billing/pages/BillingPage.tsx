import { useState, useEffect, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Users, 
  CircleDollarSign, 
  Receipt,
  Search,
  Banknote,
  X,
  Loader2,
  AlertCircle,
  Plus
} from "lucide-react";
import { getBillingCharges, createBillingPayment, generateMonthlyCharges, createBillingCharge, BillingCharge } from "../services/billingApi";
import { ClientCombobox } from "../../shared/ui/ClientCombobox";
import { fetchClients } from "../../clients/services/clientsApi";
import type { Client } from "../../shared/types";

export function BillingPage() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [searchTerm, setSearchTerm] = useState("");
  
  const [charges, setCharges] = useState<BillingCharge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);

  // Modal states for Payment
  const [paymentChargeId, setPaymentChargeId] = useState<number | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Yape");
  const [paymentDate, setPaymentDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [paymentNotes, setPaymentNotes] = useState<string>("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Modal states for New Charge
  const [showNewCharge, setShowNewCharge] = useState(false);
  const [newChargeClientId, setNewChargeClientId] = useState<number | "">("");
  const [newChargeConcept, setNewChargeConcept] = useState<string>("Honorarios Contables");
  const [newChargeAmount, setNewChargeAmount] = useState<string>("");
  const [isSubmittingCharge, setIsSubmittingCharge] = useState(false);

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
    fetchCharges();
  }, [fetchCharges]);

  useEffect(() => {
    if (showNewCharge && clients.length === 0) {
      fetchClients().then(setClients).catch(console.error);
    }
  }, [showNewCharge, clients.length]);

  const handleCreateCharge = async () => {
    if (!newChargeClientId) {
      alert("Selecciona un cliente.");
      return;
    }
    const amount = parseFloat(newChargeAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Ingrese un monto válido.");
      return;
    }

    setIsSubmittingCharge(true);
    try {
      await createBillingCharge({
        clientId: Number(newChargeClientId),
        period: selectedPeriod,
        concept: newChargeConcept,
        totalAmount: amount
      });
      setShowNewCharge(false);
      setNewChargeClientId("");
      setNewChargeAmount("");
      setNewChargeConcept("Honorarios Contables");
      fetchCharges();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error al crear el cargo.");
    } finally {
      setIsSubmittingCharge(false);
    }
  };

  const handleGenerateMonthly = async () => {
    if (!window.confirm("¿Seguro que deseas generar las deudas por Honorarios para todos los clientes activos este mes?")) {
      return;
    }
    
    setIsGenerating(true);
    try {
      const { generatedCount } = await generateMonthlyCharges(selectedPeriod);
      alert(`Se generaron ${generatedCount} nuevas deudas de honorarios.`);
      fetchCharges();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error al generar deudas.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePayment = async () => {
    if (!paymentChargeId) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Ingrese un monto válido.");
      return;
    }

    setIsSubmittingPayment(true);
    try {
      await createBillingPayment(paymentChargeId, {
        amount,
        paymentMethod,
        paymentDate,
        notes: paymentNotes || undefined
      });
      setPaymentChargeId(null);
      setPaymentAmount("");
      setPaymentNotes("");
      fetchCharges();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error al registrar el pago.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const activeChargeForModal = useMemo(() => {
    return charges.find(c => c.id === paymentChargeId);
  }, [charges, paymentChargeId]);

  const filteredCharges = useMemo(() => {
    return charges.filter(c => 
      c.client.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.client.ruc.includes(searchTerm)
    );
  }, [charges, searchTerm]);

  // Kardex calculations
  const totalCollected = useMemo(() => charges.reduce((acc, c) => acc + c.paidAmount, 0), [charges]);
  const totalDebt = useMemo(() => charges.reduce((acc, c) => acc + (c.totalAmount - c.paidAmount), 0), [charges]);
  const clientsWithDebt = useMemo(() => charges.filter(c => c.status !== "pagado").length, [charges]);

  // Years for select
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = [
    { value: 1, label: "Enero" }, { value: 2, label: "Febrero" }, { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" }, { value: 5, label: "Mayo" }, { value: 6, label: "Junio" },
    { value: 7, label: "Julio" }, { value: 8, label: "Agosto" }, { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" }, { value: 11, label: "Noviembre" }, { value: 12, label: "Diciembre" }
  ];

  const isPanelOpen = !!paymentChargeId || showNewCharge;

  return (
    <div className={`transition-all duration-300 ease-in-out ${isPanelOpen ? 'pr-[360px]' : ''}`}>
      <>
      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">Control de Cobranzas</h1>
            <p className="text-slate-500 mt-1 max-w-sm">Gestiona las deudas y pagos de tus clientes del periodo seleccionado.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border-none bg-transparent text-sm font-medium text-slate-700 focus:ring-0 py-1.5 pl-2 pr-6 cursor-pointer text-center"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <div className="w-px h-5 bg-slate-200" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border-none bg-transparent text-sm font-medium text-slate-700 focus:ring-0 py-1.5 pl-2 pr-6 cursor-pointer text-center"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => setShowNewCharge(true)}
              className="flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 text-sm rounded-lg font-medium shadow-sm transition-colors leading-tight text-center"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Nuevo<br className="hidden sm:block lg:hidden" /> Cargo</span>
            </button>
            <button 
              onClick={() => window.location.href = '/billing/history'}
              className="flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 text-sm rounded-lg font-medium shadow-sm transition-colors leading-tight text-center"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span>Historial por<br className="hidden sm:block lg:hidden" /> Cliente</span>
            </button>
            <button 
              onClick={handleGenerateMonthly}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm rounded-lg font-medium shadow-sm transition-colors disabled:opacity-70 leading-tight text-center"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 shrink-0 animate-spin" /> : <Receipt className="w-4 h-4 shrink-0" />}
              <span>Generar Deudas<br className="hidden sm:block lg:hidden" /> del Mes</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CircleDollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Recaudado</p>
              <p className="text-2xl font-bold text-emerald-600">
                S/ {totalCollected.toFixed(2)}
              </p>
              <p className="text-xs text-slate-400 mt-1">Total de pagos recibidos en el periodo.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Por Cobrar</p>
              <p className="text-2xl font-bold text-red-600">
                S/ {totalDebt.toFixed(2)}
              </p>
              <p className="text-xs text-slate-400 mt-1">Total pendiente de cobro en el periodo.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Clientes con Deuda</p>
              <p className="text-2xl font-bold text-blue-600">
                {clientsWithDebt}
              </p>
              <p className="text-xs text-slate-400 mt-1">Clientes con saldos pendientes.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Listado de deudas</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full sm:w-[300px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Cliente</th>
                  <th className="px-6 py-4 font-semibold">Concepto</th>
                  <th className="px-6 py-4 font-semibold text-right">Total</th>
                  <th className="px-6 py-4 font-semibold text-right">Pagado</th>
                  <th className="px-6 py-4 font-semibold text-right">Deuda</th>
                  <th className="px-6 py-4 font-semibold text-center">Estado</th>
                  <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Cargando cobranzas...
                      </div>
                    </td>
                  </tr>
                ) : filteredCharges.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                      No se encontraron deudas para el periodo seleccionado.
                    </td>
                  </tr>
                ) : (
                  filteredCharges.map((charge) => {
                    const debt = charge.totalAmount - charge.paidAmount;
                    const isPaid = charge.status === "pagado";
                    const isPartial = charge.status === "parcial";

                    return (
                      <tr key={charge.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-800">{charge.client.businessName}</p>
                          <p className="text-xs text-slate-500">{charge.client.ruc}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {charge.concept}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-slate-800">
                          S/ {charge.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-emerald-600">
                          S/ {charge.paidAmount.toFixed(2)}
                        </td>
                        <td className={`px-6 py-4 text-right font-bold ${isPaid ? 'text-slate-400' : 'text-red-600'}`}>
                          S/ {debt.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                              isPaid 
                                ? 'bg-emerald-100 text-emerald-700'
                                : isPartial
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-red-100 text-red-700'
                            }`}>
                              {isPaid ? 'Pagado' : isPartial ? 'Parcial' : 'Pendiente'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => {
                                setPaymentChargeId(charge.id);
                                setPaymentAmount(debt.toString());
                              }}
                              disabled={isPaid}
                              className={`p-2 rounded-lg transition-colors ${
                                isPaid 
                                  ? 'text-slate-300 cursor-not-allowed' 
                                  : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                              }`}
                              title={isPaid ? "Deuda pagada" : "Registrar pago"}
                            >
                              <Banknote className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-200 bg-slate-50 text-sm text-slate-500">
            Mostrando {filteredCharges.length} registros
          </div>
        </div>
      </div>

      {/* Payment Modal (Side Panel) */}
      {paymentChargeId && activeChargeForModal && (
        <div 
          className="fixed right-0 bottom-0 w-[360px] bg-white shadow-[-10px_0_40px_-10px_rgba(0,0,0,0.1)] z-[100] flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200"
          style={{ top: '66px' }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Registrar Pago</h2>
            <button 
              onClick={() => setPaymentChargeId(null)}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Cliente</p>
                <p className="font-semibold text-slate-800 line-clamp-1">{activeChargeForModal.client.businessName}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-500 mb-1">Deuda pendiente</p>
              <p className="text-3xl font-bold text-red-600">
                S/ {(activeChargeForModal.totalAmount - activeChargeForModal.paidAmount).toFixed(2)}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Monto a pagar
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">S/</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={activeChargeForModal.totalAmount - activeChargeForModal.paidAmount}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Medio de Pago
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="Yape">Yape</option>
                  <option value="Transferencia BCP">Transferencia BCP</option>
                  <option value="Efectivo">Efectivo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fecha de pago
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Observaciones (Opcional)
                </label>
                <textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="Añadir una nota..."
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50">
            <button 
              onClick={() => setPaymentChargeId(null)}
              className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors flex items-center gap-2 bg-white"
            >
              <X className="w-4 h-4" /> Cancelar
            </button>
            <button 
              onClick={handleSavePayment}
              disabled={isSubmittingPayment}
              className="flex-1 py-2.5 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isSubmittingPayment && <Loader2 className="w-4 h-4 animate-spin" />}
              Guardar Pago
            </button>
          </div>
        </div>
      )}

      {/* New Charge Modal (Side Panel) */}
      {showNewCharge && (
        <div 
          className="fixed right-0 bottom-0 w-[360px] bg-white shadow-[-10px_0_40px_-10px_rgba(0,0,0,0.1)] z-[100] flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200"
          style={{ top: '66px' }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Nuevo Cargo Manual</h2>
            <button 
              onClick={() => setShowNewCharge(false)}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cliente
                </label>
                <ClientCombobox 
                  clients={clients} 
                  value={newChargeClientId} 
                  onChange={(val) => setNewChargeClientId(Number(val) || "")} 
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Concepto
                </label>
                <input
                  type="text"
                  value={newChargeConcept}
                  onChange={(e) => setNewChargeConcept(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Ej: Honorarios Contables"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Total a cobrar
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">S/</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={newChargeAmount}
                    onChange={(e) => setNewChargeAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50">
            <button 
              onClick={() => setShowNewCharge(false)}
              className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors flex items-center gap-2 bg-white"
            >
              <X className="w-4 h-4" /> Cancelar
            </button>
            <button 
              onClick={handleCreateCharge}
              disabled={isSubmittingCharge || !newChargeClientId || !newChargeConcept || !newChargeAmount}
              className="flex-1 py-2.5 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isSubmittingCharge && <Loader2 className="w-4 h-4 animate-spin" />}
              Crear Cargo
            </button>
          </div>
        </div>
      )}
      </>
    </div>
  );
}
