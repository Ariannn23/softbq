import { format } from "date-fns";
import { es } from "date-fns/locale";

import type { ClientBillingHistory } from "../services/billingApi";

export function BillingHistoryTable({ charges }: { charges: ClientBillingHistory["charges"] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Detalle de Cargos y Pagos</h2>
      </div>
      {charges.length === 0 ? (
        <div className="p-8 text-center text-slate-500">Este cliente no tiene cargos registrados.</div>
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
              {charges.map((charge) => (
                <tr key={charge.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">{format(new Date(charge.createdAt), "dd MMM yyyy", { locale: es })}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{charge.concept}</td>
                  <td className="px-6 py-4 text-slate-500">{charge.period || "-"}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap font-medium text-slate-700">S/ {Number(charge.totalAmount).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap text-orange-500 font-medium">S/ {(Number(charge.totalAmount) - Number(charge.paidAmount)).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <ChargeStatusBadge status={charge.status} />
                  </td>
                  <td className="px-6 py-4">
                    <PaymentsList payments={charge.payments} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ChargeStatusBadge({ status }: { status: "pendiente" | "parcial" | "pagado" }) {
  const styles = {
    pagado: "bg-green-50 text-green-700 border-green-200",
    parcial: "bg-orange-50 text-orange-700 border-orange-200",
    pendiente: "bg-red-50 text-red-700 border-red-200",
  };
  const labels = {
    pagado: "Pagado",
    parcial: "Parcial",
    pendiente: "Pendiente",
  };

  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>{labels[status]}</span>;
}

function PaymentsList({ payments }: { payments: ClientBillingHistory["charges"][number]["payments"] }) {
  if (payments.length === 0) {
    return <span className="text-slate-400 italic">Sin pagos</span>;
  }

  return (
    <div className="space-y-1">
      {payments.map((payment) => (
        <div key={payment.id} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 flex justify-between">
          <span>{format(new Date(payment.date), "dd/MM/yyyy")}</span>
          <span className="font-medium">
            S/ {Number(payment.amount).toFixed(2)} ({payment.method})
          </span>
        </div>
      ))}
    </div>
  );
}
