import type { ImportPreview } from "../../shared/types";

export function ImportConfirmationStep({
  busy,
  message,
  preview,
  onCancel,
  onConfirm,
}: {
  busy: boolean;
  message: string | null;
  preview: ImportPreview | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-[#045585]">6. Confirmar importacion</h2>
      <div className="mt-5 rounded-md border border-[#9ed8ff] bg-[#f0f9ff] p-4 text-sm leading-6 text-[#072d4a]">
        Se importaran {preview?.validRows ?? 0} filas con el mapeo configurado.
        <br />
        Por favor verifica la vista previa antes de continuar.
      </div>
      <div className="mt-12 flex flex-wrap gap-4">
        <button className="h-11 rounded-md border border-[#c9dbef] px-8 font-semibold" onClick={onCancel} type="button">
          Cancelar
        </button>
        <button className="h-11 rounded-md bg-[#056ba6] px-8 font-semibold text-white disabled:opacity-60" disabled={!preview || preview.validRows === 0 || busy} onClick={onConfirm} type="button">
          Confirmar importacion
        </button>
      </div>
      {message ? <p className="mt-4 text-sm text-red-600">{message}</p> : null}
    </div>
  );
}
