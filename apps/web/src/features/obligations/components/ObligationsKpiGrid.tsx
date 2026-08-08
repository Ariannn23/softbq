import { CheckCircle2, Clock } from "lucide-react";

type ObligationKpi = {
  title: string;
  total: number;
  done: number;
  pending: number;
};

export function ObligationsKpiGrid({ kpis }: { kpis: ObligationKpi[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => (
        <div key={kpi.title} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-600 mb-3">{kpi.title}</div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              Total: {kpi.total}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-emerald-50 rounded px-2 py-1.5 flex flex-col justify-center items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Hechas</span>
              <span className="text-sm font-bold text-emerald-800">{kpi.done}</span>
            </div>
            <div className="bg-orange-50 rounded px-2 py-1.5 flex flex-col justify-center items-center">
              <Clock className="w-3.5 h-3.5 text-orange-500 mb-0.5" />
              <span className="text-[10px] uppercase font-bold text-orange-700 tracking-wider">Pends</span>
              <span className="text-sm font-bold text-orange-800">{kpi.pending}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
