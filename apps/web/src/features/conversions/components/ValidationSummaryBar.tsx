import { CheckCircle2 } from "lucide-react";

import type { ValidationResponse } from "../services/conversionsApi";

export function ValidationSummaryBar({ validation }: { validation: ValidationResponse }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-wrap gap-8 items-center">
      <div>
        <span className="text-xs text-slate-500 font-medium">Cliente</span>
        <p className="font-semibold text-slate-800">{validation.clientId}</p>
      </div>
      <div>
        <span className="text-xs text-slate-500 font-medium">Periodo seleccionado</span>
        <p className="font-semibold text-slate-800">{validation.period}</p>
      </div>
      <div className="flex-1">
        <span className="text-xs text-slate-500 font-medium">Archivos cargados</span>
        <div className="flex gap-3 mt-1">
          {validation.sales && <LoadedFileBadge label="Ventas" fileName={validation.sales.fileName} />}
          {validation.purchases && <LoadedFileBadge label="Compras" fileName={validation.purchases.fileName} />}
        </div>
      </div>
    </div>
  );
}

function LoadedFileBadge({ label, fileName }: { label: string; fileName: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-200">
      <CheckCircle2 className="w-3 h-3" />
      {label}: {fileName}
    </span>
  );
}
