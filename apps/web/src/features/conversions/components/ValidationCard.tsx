import { AlertCircle, Info, X } from "lucide-react";

import type { ConversionValidationFileResult, ConversionValidationObservation } from "../services/conversionsApi";

export function ValidationCard({
  result,
  title,
  iconColor,
}: {
  result: ConversionValidationFileResult;
  title: string;
  iconColor: string;
}) {
  if (result.error) {
    return (
      <div className="bg-white border border-red-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-red-100 bg-red-50 flex items-center justify-between">
          <h3 className={`font-bold ${iconColor} flex items-center gap-2`}>{title}</h3>
          <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded">Error en archivo</span>
        </div>
        <div className="p-6">
          <p className="text-red-600 text-sm">{result.error}</p>
        </div>
      </div>
    );
  }

  const { summary, observations } = result;

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className={`font-bold ${iconColor} flex items-center gap-2`}>{title}</h3>
        <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">Archivo valido</span>
      </div>

      <div className="p-5 flex-1">
        <div className="grid grid-cols-3 gap-y-4 gap-x-2 text-sm mb-6">
          <ValidationMetric label="Tipo detectado" value={result.detectedType} className="capitalize" />
          <ValidationMetric label="RUC detectado" value={summary.detectedRucs[0] || "-"} />
          <ValidationMetric label="Periodo detectado" value={summary.detectedPeriods[0] || "-"} />
          <ValidationMetric label="Registros" value={summary.recordsCount.toLocaleString()} />
          <ValidationMetric label="Total base imponible" value={`S/ ${summary.totalBase.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`} />
          <ValidationMetric label="Total IGV" value={`S/ ${summary.totalIgv.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`} />
          <ValidationMetric label="Total comprobantes" value={summary.recordsCount.toLocaleString()} />
          <ValidationMetric label="Errores criticos" value={observations.critical.length} className={observations.critical.length > 0 ? "text-red-600" : "text-slate-800"} />
          <ValidationMetric label="Advertencias" value={observations.warnings.length} className={observations.warnings.length > 0 ? "text-orange-500" : "text-slate-800"} />
        </div>

        <div className="space-y-3">
          <ValidationAlertBox type="error" title={`Errores criticos (${observations.critical.length})`} items={observations.critical} emptyMessage="No se encontraron errores criticos." />
          <ValidationAlertBox type="warning" title={`Advertencias (${observations.warnings.length})`} items={observations.warnings} />
          <ValidationAlertBox type="info" title={`Observaciones informativas (${observations.info.length})`} items={observations.info} />
        </div>
      </div>

      <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
        <span className="truncate max-w-[250px]">Archivo: {result.fileName}</span>
        <span>{(result.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
      </div>
    </div>
  );
}

function ValidationMetric({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div>
      <span className="text-slate-500 text-xs block mb-1">{label}</span>
      <span className={`font-semibold ${className}`}>{value}</span>
    </div>
  );
}

function ValidationAlertBox({
  type,
  title,
  items,
  emptyMessage,
}: {
  type: "error" | "warning" | "info";
  title: string;
  items: ConversionValidationObservation[];
  emptyMessage?: string;
}) {
  if (items.length === 0 && !emptyMessage) return null;

  const styles = {
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-orange-50 border-orange-200 text-orange-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };
  const icons = {
    error: <X className="w-4 h-4 text-red-500 mt-0.5" />,
    warning: <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />,
    info: <Info className="w-4 h-4 text-blue-500 mt-0.5" />,
  };

  return (
    <div className={`border rounded-md p-3 ${styles[type]}`}>
      <div className="flex gap-2">
        {icons[type]}
        <div>
          <h4 className="text-sm font-semibold mb-1">{title}</h4>
          {items.length > 0 ? (
            <ul className="text-xs space-y-1 list-disc ml-4">
              {items.slice(0, 5).map((item, index) => (
                <li key={`${item.code}-${item.rowNumber ?? index}`}>
                  {item.message} {item.rowNumber ? `(Fila ${item.rowNumber})` : ""}
                </li>
              ))}
              {items.length > 5 && <li className="italic">... y {items.length - 5} mas</li>}
            </ul>
          ) : (
            <p className="text-xs">{emptyMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
