import { CheckCircle2, Info, Loader2, XCircle } from "lucide-react";

export function ConversionStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
    case "generated":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-green-100 text-green-700 rounded border border-green-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETADA
        </span>
      );
    case "processing":
    case "validated":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-yellow-100 text-yellow-700 rounded border border-yellow-200">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> EN PROCESO
        </span>
      );
    case "error":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-red-100 text-red-700 rounded border border-red-200">
          <XCircle className="w-3.5 h-3.5" /> CON ERRORES
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-slate-200 text-slate-700 rounded border border-slate-300">
          <Info className="w-3.5 h-3.5" /> CANCELADA
        </span>
      );
    default:
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-800 rounded border border-slate-200">{status.toUpperCase()}</span>;
  }
}
