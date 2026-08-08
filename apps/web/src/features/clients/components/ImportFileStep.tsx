import { CheckCircle, FileSpreadsheet } from "lucide-react";

export function ImportFileStep({
  fileName,
  fileSize,
  onFileChange,
}: {
  fileName: string | null;
  fileSize: string | null;
  onFileChange: (file?: File) => void;
}) {
  return (
    <section className="row-span-2 rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-[#045585]">1. Subir archivo Excel</h2>
      <label className="mt-5 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[#b9d9f9] bg-[#fbfdff] p-6 text-center">
        <FileSpreadsheet className="h-12 w-12 text-emerald-600" />
        <span className="mt-4 font-semibold text-[#26466f]">Arrastra y suelta tu archivo aqui</span>
        <span className="mt-2 text-sm text-[#53698d]">o</span>
        <span className="mt-4 rounded-md bg-[#056ba6] px-5 py-3 font-semibold text-white">Seleccionar archivo</span>
        <input accept=".xlsx" className="hidden" onChange={(event) => onFileChange(event.target.files?.[0])} type="file" />
      </label>
      {fileName ? (
        <div className="mt-4 flex items-center justify-between rounded-md border border-[#d8e8f6] p-3">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-7 w-7 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold">{fileName}</p>
              <p className="text-xs text-[#53698d]">{fileSize}</p>
            </div>
          </div>
          <CheckCircle className="h-5 w-5 text-emerald-600" />
        </div>
      ) : null}
      <p className="mt-5 text-sm leading-6 text-[#53698d]">
        Formato permitido: .xlsx
        <br />
        Tamano maximo: 10 MB
      </p>
    </section>
  );
}
