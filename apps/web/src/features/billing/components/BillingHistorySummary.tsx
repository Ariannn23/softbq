import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, FileText } from "lucide-react";

import type { ClientBillingHistory } from "../services/billingApi";

export function BillingHistorySummary({ kpis }: { kpis: ClientBillingHistory["kpis"] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard icon={<FileText className="w-6 h-6" />} iconClassName="bg-slate-100 text-slate-600" label="Total Historico Facturado" value={`S/ ${kpis.totalBilled.toFixed(2)}`} valueClassName="text-slate-800" />
      <SummaryCard icon={<CheckCircle2 className="w-6 h-6" />} iconClassName="bg-green-100 text-green-600" label="Total Pagado" value={`S/ ${kpis.totalPaid.toFixed(2)}`} valueClassName="text-green-600" />
      <SummaryCard icon={<AlertCircle className="w-6 h-6" />} iconClassName="bg-orange-100 text-orange-500" label="Deuda Acumulada" value={`S/ ${kpis.totalDebt.toFixed(2)}`} valueClassName="text-orange-500" />
    </div>
  );
}

function SummaryCard({
  icon,
  iconClassName,
  label,
  value,
  valueClassName,
}: {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value: string;
  valueClassName: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconClassName}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
      </div>
    </div>
  );
}
