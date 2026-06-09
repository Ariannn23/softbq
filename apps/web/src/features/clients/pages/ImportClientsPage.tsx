import { CheckCircle, FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { importFields, type SessionUser } from "../../shared/types";
import { SkeletonLine } from "../../shared/ui";
import { ImportPreviewTable } from "../components/ImportPreviewTable";
import { ImportSteps } from "../components/ImportSteps";
import { ImportSummaryCard } from "../components/ImportSummaryCard";
import { useClientImport } from "../hooks/useClientImport";

export function ImportClientsPage({
  onClientsChanged,
  user
}: {
  onClientsChanged: () => void;
  user: SessionUser;
}) {
  const navigate = useNavigate();
  const state = useClientImport(onClientsChanged);

  if (user.role !== "admin") {
    return (
      <div className="mx-auto max-w-[1540px] px-7 py-8">
        <h1 className="text-3xl font-bold">Importar clientes</h1>
        <p className="mt-4 rounded-md border border-[#d8e8f6] bg-white p-5 text-[#26466f]">Solo admin puede importar clientes desde Excel.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1540px] px-7 py-7">
      <div className="text-sm text-[#53698d]">
        <button className="hover:text-[#056ba6]" onClick={() => navigate("/clients")} type="button">Clientes</button>
        <span className="mx-3">{">"}</span>
        <span>Importar clientes</span>
      </div>
      <h1 className="mt-3 text-3xl font-bold">Importar clientes</h1>
      <p className="mt-2 text-[#26466f]">Carga la base inicial de clientes desde un archivo Excel.</p>

      <ImportSteps currentStep={state.currentStep} />

      <div className="mt-6 grid gap-3 xl:grid-cols-[330px_minmax(0,1fr)_minmax(0,1fr)]">
        <section className="row-span-2 rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#045585]">1. Subir archivo Excel</h2>
          <label className="mt-5 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[#b9d9f9] bg-[#fbfdff] p-6 text-center">
            <FileSpreadsheet className="h-12 w-12 text-emerald-600" />
            <span className="mt-4 font-semibold text-[#26466f]">Arrastra y suelta tu archivo aqui</span>
            <span className="mt-2 text-sm text-[#53698d]">o</span>
            <span className="mt-4 rounded-md bg-[#056ba6] px-5 py-3 font-semibold text-white">Seleccionar archivo</span>
            <input accept=".xlsx" className="hidden" onChange={(event) => void state.handleFileChange(event.target.files?.[0])} type="file" />
          </label>
          {state.fileName ? (
            <div className="mt-4 flex items-center justify-between rounded-md border border-[#d8e8f6] p-3">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-7 w-7 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold">{state.fileName}</p>
                  <p className="text-xs text-[#53698d]">{state.fileSize}</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
          ) : null}
          <p className="mt-5 text-sm leading-6 text-[#53698d]">Formato permitido: .xlsx<br />Tamano maximo: 10 MB</p>
        </section>

        <section className="rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#045585]">2. Seleccionar hoja</h2>
          <p className="mt-4 text-sm text-[#53698d]">Hojas detectadas en el archivo:</p>
          {state.busy && !state.analysis ? <SkeletonLine className="mt-4 h-11 w-full" /> : (
            <select className="mt-4 h-11 w-full rounded-md border border-[#c9dbef] px-3 outline-none" disabled={!state.analysis} onChange={(event) => state.setSelectedSheet(event.target.value)} value={state.selectedSheet}>
              {state.analysis?.sheets.map((sheet) => <option key={sheet.name} value={sheet.name}>{sheet.name}</option>)}
            </select>
          )}
          {state.selectedSheetInfo ? <p className="mt-4 flex items-center gap-2 text-sm text-emerald-700"><CheckCircle size={16} />{state.selectedSheetInfo.rowCount} filas encontradas en la hoja seleccionada.</p> : null}
        </section>

        <section className="rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#045585]">3. Columnas detectadas</h2>
          <p className="mt-4 text-sm text-[#53698d]">Se detectaron {state.headers.length} columnas en la hoja seleccionada.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {state.busy && !state.analysis
              ? Array.from({ length: 5 }, (_, index) => <SkeletonLine className="h-8 w-24" key={index} />)
              : state.headers.slice(0, 8).map((header, index) => <span className="rounded border border-[#c9dbef] px-3 py-2 text-xs" key={header}>{String.fromCharCode(65 + index)} {header}</span>)}
            {!state.busy && state.headers.length > 8 ? <span className="rounded border border-[#c9dbef] px-3 py-2 text-xs">+ {state.headers.length - 8} mas</span> : null}
          </div>
        </section>

        <section className="rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#045585]">4. Mapear columnas a campos de SOFTBQ</h2>
          <div className="mt-5 space-y-3">
            {state.busy && !state.analysis
              ? Array.from({ length: 8 }, (_, index) => <div className="grid grid-cols-[1fr_24px_1fr] items-center gap-3" key={index}><SkeletonLine className="h-5 w-full" /><span className="text-center text-[#53698d]">{"->"}</span><SkeletonLine className="h-9 w-full" /></div>)
              : null}
            {!state.busy && importFields.map((field) => (
              <div className="grid grid-cols-[1fr_24px_1fr] items-center gap-3 text-sm" key={field.key}>
                <span className="font-semibold">{field.label}{field.required ? <span className="text-red-600"> *</span> : null}</span>
                <span className="text-center text-[#53698d]">{"->"}</span>
                <select className="h-9 rounded-md border border-[#c9dbef] px-2 outline-none" onChange={(event) => state.setMapping((current) => ({ ...current, [field.key]: event.target.value }))} value={state.mapping[field.key] ?? ""}>
                  <option value="">No mapear</option>
                  {state.headers.map((header) => <option key={header} value={header}>{header}</option>)}
                </select>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#045585]">5. Vista previa de datos</h2>
          <p className="mt-3 text-sm text-[#53698d]">Se muestran las primeras 5 filas con el mapeo aplicado.</p>
          <div className="mt-5 overflow-x-auto">
            <ImportPreviewTable busy={state.busy} hasAnalysis={Boolean(state.analysis)} preview={state.preview} />
          </div>
          {state.preview ? <p className="mt-5 text-sm text-[#26466f]">{state.preview.validRows} filas validas seran importadas. {state.preview.invalidRows} filas tienen observaciones.</p> : null}
        </section>
      </div>

      <section className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#045585]">6. Confirmar importacion</h2>
          <div className="mt-5 rounded-md border border-[#9ed8ff] bg-[#f0f9ff] p-4 text-sm leading-6 text-[#072d4a]">Se importaran {state.preview?.validRows ?? 0} filas con el mapeo configurado.<br />Por favor verifica la vista previa antes de continuar.</div>
          <div className="mt-12 flex flex-wrap gap-4">
            <button className="h-11 rounded-md border border-[#c9dbef] px-8 font-semibold" onClick={() => navigate("/clients")} type="button">Cancelar</button>
            <button className="h-11 rounded-md bg-[#056ba6] px-8 font-semibold text-white disabled:opacity-60" disabled={!state.preview || state.preview.validRows === 0 || state.busy} onClick={() => void state.confirmImport()} type="button">Confirmar importacion</button>
          </div>
          {state.message ? <p className="mt-4 text-sm text-red-600">{state.message}</p> : null}
        </div>
        <div className="rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#045585]">7. Resumen de la importacion</h2>
          <p className="mt-3 text-sm text-[#53698d]">{state.summary ? "La importacion se completo correctamente." : "El resumen aparecera despues de confirmar."}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <ImportSummaryCard label="Creados" value={state.summary?.created ?? 0} tone="green" />
            <ImportSummaryCard label="Actualizados" value={state.summary?.updated ?? 0} tone="blue" />
            <ImportSummaryCard label="Omitidos" value={state.summary?.omitted ?? 0} tone="orange" />
            <ImportSummaryCard label="Errores" value={state.summary?.errors ?? 0} tone="red" />
          </div>
        </div>
      </section>
    </div>
  );
}
