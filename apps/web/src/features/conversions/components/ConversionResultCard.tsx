import { Download, Info } from "lucide-react";

type ConversionResultCardProps = {
  title: string;
  iconColor: string;
  iconBg: string;
  buttonColor: string;
  file: { fileName: string; recordsCount: number; sizeBytes: number };
  onDownload: () => void;
};

export function ConversionResultCard({
  title,
  iconColor,
  iconBg,
  buttonColor,
  file,
  onDownload,
}: ConversionResultCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg}`}>
            <Download className={`w-4 h-4 ${iconColor}`} />
          </div>
          <h3 className={`font-bold ${iconColor}`}>{title}</h3>
        </div>
        <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">Generado</span>
      </div>

      <div className="p-5 flex-1 space-y-3">
        <ResultRow label="Archivo generado" value={file.fileName} title={file.fileName} />
        <ResultRow label="Registros procesados" value={file.recordsCount.toLocaleString()} />
        <ResultRow label="Total comprobantes" value={file.recordsCount.toLocaleString()} />
        <ResultRow label="Tamano del archivo" value={`${(file.sizeBytes / 1024).toFixed(0)} KB`} />
        <ResultRow label="Generado el" value={`${new Date().toLocaleDateString("es-PE")} ${new Date().toLocaleTimeString("es-PE")}`} isLast />
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
        <button className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 flex justify-center items-center gap-2">
          <Info className="w-4 h-4" />
          Vista previa
        </button>
        <button onClick={onDownload} className={`flex-1 px-4 py-2 text-sm font-medium rounded-md flex justify-center items-center gap-2 ${buttonColor}`}>
          <Download className="w-4 h-4" />
          Descargar Excel
        </button>
      </div>
    </div>
  );
}

function ResultRow({
  label,
  value,
  title,
  isLast = false,
}: {
  label: string;
  value: string;
  title?: string;
  isLast?: boolean;
}) {
  return (
    <div className={`flex justify-between ${isLast ? "pb-2" : "border-b border-slate-100 pb-2"}`}>
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-800 text-right truncate max-w-[200px]" title={title}>
        {value}
      </span>
    </div>
  );
}
