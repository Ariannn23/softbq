import type { ReactNode } from "react";

import type { DashboardSummary } from "../services/dashboardApi";
import { getDashboardCards } from "../config";

export function DashboardSummaryGrid({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {getDashboardCards(summary).map((card) => (
        <SummaryCard key={card.title} {...card} />
      ))}
    </div>
  );
}

function SummaryCard({
  title,
  subtitle,
  value,
  icon,
  iconBgColor,
}: {
  title: string;
  subtitle: string;
  value: number;
  icon: ReactNode;
  iconBgColor: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${iconBgColor}`}>{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-slate-800">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
