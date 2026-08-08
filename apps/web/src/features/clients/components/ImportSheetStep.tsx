import { CheckCircle } from "lucide-react";

import { SkeletonLine } from "../../shared/ui";
import type { ImportAnalysis, ImportSheet } from "../../shared/types";

export function ImportSheetStep({
  analysis,
  busy,
  selectedSheet,
  selectedSheetInfo,
  onSheetChange,
}: {
  analysis: ImportAnalysis | null;
  busy: boolean;
  selectedSheet: string;
  selectedSheetInfo?: ImportSheet;
  onSheetChange: (sheet: string) => void;
}) {
  return (
    <section className="rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-[#045585]">2. Seleccionar hoja</h2>
      <p className="mt-4 text-sm text-[#53698d]">Hojas detectadas en el archivo:</p>
      {busy && !analysis ? (
        <SkeletonLine className="mt-4 h-11 w-full" />
      ) : (
        <select className="mt-4 h-11 w-full rounded-md border border-[#c9dbef] px-3 outline-none" disabled={!analysis} onChange={(event) => onSheetChange(event.target.value)} value={selectedSheet}>
          {analysis?.sheets.map((sheet) => (
            <option key={sheet.name} value={sheet.name}>
              {sheet.name}
            </option>
          ))}
        </select>
      )}
      {selectedSheetInfo ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
          <CheckCircle size={16} />
          {selectedSheetInfo.rowCount} filas encontradas en la hoja seleccionada.
        </p>
      ) : null}
    </section>
  );
}
