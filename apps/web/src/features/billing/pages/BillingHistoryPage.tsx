import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchClients } from "../../clients/services/clientsApi";
import type { Client } from "../../shared/types";
import { ClientCombobox } from "../../shared/ui/ClientCombobox";
import { getBillingHistory, ClientBillingHistory } from "../services/billingApi";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function BillingHistoryPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState<string>("");
  const [history, setHistory] = useState<ClientBillingHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients().then((data) => {
      setClients(data.filter(c => c.active));
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!clientId) {
      setHistory(null);
      return;
    }

    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getBillingHistory(Number(clientId));
        setHistory(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar el historial del cliente");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [clientId]);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link 
          to="/billing" 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Cobranzas
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Historial por Cliente</h1>
        <p className="text-slate-500 mt-1">Consulta los cargos, deudas y pagos específicos de un cliente.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-medium text-slate-700 mb-2">Seleccionar Cliente</label>
        <div className="max-w-md">
          <ClientCombobox
            clients={clients}
            value={clientId}
            onChange={(val) => setClientId(val.toString())}
            placeholder="Escribe el RUC o Nombre..."
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && history && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Histórico Facturado</p>
                <p className="text-2xl font-bold text-slate-800">S/ {history.kpis.totalBilled.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Pagado</p>
                <p className="text-2xl font-bold text-green-600">S/ {history.kpis.totalPaid.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Deuda Acumulada</p>
                <p className="text-2xl font-bold text-orange-500">S/ {history.kpis.totalDebt.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Detalle de Cargos y Pagos</h2>
            </div>
            {history.charges.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                Este cliente no tiene cargos registrados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Fecha Cargo</th>
                      <th className="px-6 py-4">Concepto</th>
                      <th className="px-6 py-4">Periodo</th>
                      <th className="px-6 py-4 text-right">Total</th>
                      <th className="px-6 py-4 text-right">Deuda</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Pagos Registrados</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.charges.map(charge => (
                      <tr key={charge.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(new Date(charge.createdAt), "dd MMM yyyy", { locale: es })}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {charge.concept}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {charge.period || "-"}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap font-medium text-slate-700">
                          S/ {Number(charge.totalAmount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap text-orange-500 font-medium">
                          S/ {(Number(charge.totalAmount) - Number(charge.paidAmount)).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            charge.status === "pagado" ? "bg-green-50 text-green-700 border-green-200" :
                            charge.status === "parcial" ? "bg-orange-50 text-orange-700 border-orange-200" :
                            "bg-red-50 text-red-700 border-red-200"
                          }`}>
                            {charge.status === "pagado" ? "Pagado" : 
                             charge.status === "parcial" ? "Parcial" : "Pendiente"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {charge.payments.length === 0 ? (
                            <span className="text-slate-400 italic">Sin pagos</span>
                          ) : (
                            <div className="space-y-1">
                              {charge.payments.map(p => (
                                <div key={p.id} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 flex justify-between">
                                  <span>{format(new Date(p.date), "dd/MM/yyyy")}</span>
                                  <span className="font-medium">S/ {Number(p.amount).toFixed(2)} ({p.method})</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
