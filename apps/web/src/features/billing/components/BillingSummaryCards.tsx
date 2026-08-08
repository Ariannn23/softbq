import type { ReactNode } from "react";
import { CircleDollarSign, Receipt, Users } from "lucide-react";

type BillingSummaryCardsProps = {
  totalCollected: number;
  totalDebt: number;
  clientsWithDebt: number;
};

export function BillingSummaryCards({ totalCollected, totalDebt, clientsWithDebt }: BillingSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard
        icon={<CircleDollarSign className="w-6 h-6" />}
        iconClassName="bg-emerald-50 text-emerald-600"
        label="Total Recaudado"
        value={`S/ ${totalCollected.toFixed(2)}`}
        valueClassName="text-emerald-600"
        description="Total de pagos recibidos en el periodo."
      />
      <SummaryCard
        icon={<Receipt className="w-6 h-6" />}
        iconClassName="bg-red-50 text-red-600"
        label="Por Cobrar"
        value={`S/ ${totalDebt.toFixed(2)}`}
        valueClassName="text-red-600"
        description="Total pendiente de cobro en el periodo."
      />
      <SummaryCard
        icon={<Users className="w-6 h-6" />}
        iconClassName="bg-blue-50 text-[#056ba6]"
        label="Clientes con Deuda"
        value={String(clientsWithDebt)}
        valueClassName="text-[#056ba6]"
        description="Clientes con saldos pendientes."
      />
    </div>
  );
}

function SummaryCard({
  icon,
  iconClassName,
  label,
  value,
  valueClassName,
  description,
}: {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value: string;
  valueClassName: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconClassName}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  );
}
