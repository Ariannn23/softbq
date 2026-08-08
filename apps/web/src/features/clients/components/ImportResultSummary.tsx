import { ImportSummaryCard } from "./ImportSummaryCard";
import type { ImportSummary } from "../../shared/types";

export function ImportResultSummary({ summary }: { summary: ImportSummary | null }) {
  return (
    <div className="rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-[#045585]">7. Resumen de la importacion</h2>
      <p className="mt-3 text-sm text-[#53698d]">{summary ? "La importacion se completo correctamente." : "El resumen aparecera despues de confirmar."}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <ImportSummaryCard label="Creados" value={summary?.created ?? 0} tone="green" />
        <ImportSummaryCard label="Actualizados" value={summary?.updated ?? 0} tone="blue" />
        <ImportSummaryCard label="Omitidos" value={summary?.omitted ?? 0} tone="orange" />
        <ImportSummaryCard label="Errores" value={summary?.errors ?? 0} tone="red" />
      </div>
    </div>
  );
}
