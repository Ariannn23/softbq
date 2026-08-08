import { ImportPreviewTable } from "./ImportPreviewTable";
import type { ImportPreview } from "../../shared/types";

export function ImportPreviewStep({
  busy,
  hasAnalysis,
  preview,
}: {
  busy: boolean;
  hasAnalysis: boolean;
  preview: ImportPreview | null;
}) {
  return (
    <section className="rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-[#045585]">5. Vista previa de datos</h2>
      <p className="mt-3 text-sm text-[#53698d]">Se muestran las primeras 5 filas con el mapeo aplicado.</p>
      <div className="mt-5 overflow-x-auto">
        <ImportPreviewTable busy={busy} hasAnalysis={hasAnalysis} preview={preview} />
      </div>
      {preview ? (
        <p className="mt-5 text-sm text-[#26466f]">
          {preview.validRows} filas validas seran importadas. {preview.invalidRows} filas tienen observaciones.
        </p>
      ) : null}
    </section>
  );
}
