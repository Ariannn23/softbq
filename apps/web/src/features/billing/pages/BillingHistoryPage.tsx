import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import { BillingHistoryClientSelector } from "../components/BillingHistoryClientSelector";
import { BillingHistorySummary } from "../components/BillingHistorySummary";
import { BillingHistoryTable } from "../components/BillingHistoryTable";
import { useBillingHistoryPage } from "../hooks/useBillingHistoryPage";

export function BillingHistoryPage() {
  const billingHistory = useBillingHistoryPage();

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link to="/billing" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          Volver a Cobranzas
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Historial por Cliente</h1>
        <p className="text-slate-500 mt-1">Consulta los cargos, deudas y pagos especificos de un cliente.</p>
      </div>

      <BillingHistoryClientSelector clients={billingHistory.clients} clientId={billingHistory.clientId} onClientChange={billingHistory.setClientId} />

      {billingHistory.isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {billingHistory.error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>{billingHistory.error}</p>
        </div>
      )}

      {!billingHistory.isLoading && !billingHistory.error && billingHistory.history && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <BillingHistorySummary kpis={billingHistory.history.kpis} />
          <BillingHistoryTable charges={billingHistory.history.charges} />
        </div>
      )}
    </div>
  );
}
