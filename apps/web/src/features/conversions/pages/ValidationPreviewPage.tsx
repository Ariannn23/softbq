import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import type { ValidationResponse, ConversionValidationFileResult } from "../services/conversionsApi";

export function ValidationPreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const validation = location.state?.validation as ValidationResponse | undefined;

  if (!validation) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center">
        <h2 className="text-xl font-bold text-slate-800">No hay datos de validación</h2>
        <button
          onClick={() => navigate("/conversiones/nueva")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Validación / Vista previa</h1>
        <p className="text-slate-500 mt-1">Revisa los archivos cargados antes de generar los Excel para Contasis.</p>
      </div>

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
            {validation.sales && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-200">
                <CheckCircle2 className="w-3 h-3" />
                Ventas: {validation.sales.fileName}
              </span>
            )}
            {validation.purchases && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-200">
                <CheckCircle2 className="w-3 h-3" />
                Compras: {validation.purchases.fileName}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {validation.sales && <ValidationCard result={validation.sales} title="VENTAS (SIRE)" iconColor="text-green-600" />}
        {validation.purchases && <ValidationCard result={validation.purchases} title="COMPRAS (SIRE)" iconColor="text-purple-600" />}
      </div>

      <div className="bg-white px-6 py-4 flex justify-between items-center border border-slate-200 rounded-lg shadow-sm">
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/conversiones/nueva")}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Volver a cargar
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancelar
          </button>
        </div>
        <button
          onClick={() => {
            // Trigger Excel generation API call here later
            alert("En el siguiente sprint conectaremos la generación de Excel.");
          }}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Generar Excel Contasis
        </button>
      </div>
    </div>
  );
}

function ValidationCard({ result, title, iconColor }: { result: ConversionValidationFileResult; title: string; iconColor: string }) {
  if (result.error) {
    return (
      <div className="bg-white border border-red-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-red-100 bg-red-50 flex items-center justify-between">
          <h3 className={`font-bold \${iconColor} flex items-center gap-2`}>{title}</h3>
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
        <h3 className={`font-bold \${iconColor} flex items-center gap-2`}>{title}</h3>
        <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">Archivo válido</span>
      </div>

      <div className="p-5 flex-1">
        <div className="grid grid-cols-3 gap-y-4 gap-x-2 text-sm mb-6">
          <div>
            <span className="text-slate-500 text-xs block mb-1">Tipo detectado</span>
            <span className="font-semibold capitalize">{result.detectedType}</span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block mb-1">RUC detectado</span>
            <span className="font-semibold">{summary.detectedRucs[0] || "-"}</span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block mb-1">Periodo detectado</span>
            <span className="font-semibold">{summary.detectedPeriods[0] || "-"}</span>
          </div>
          
          <div>
            <span className="text-slate-500 text-xs block mb-1">Registros</span>
            <span className="font-semibold">{summary.recordsCount.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block mb-1">Total base imponible</span>
            <span className="font-semibold">S/ {summary.totalBase.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block mb-1">Total IGV</span>
            <span className="font-semibold">S/ {summary.totalIgv.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</span>
          </div>

          <div>
            <span className="text-slate-500 text-xs block mb-1">Total comprobantes</span>
            <span className="font-semibold">{summary.recordsCount.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block mb-1">Errores críticos</span>
            <span className={`font-semibold \${observations.critical.length > 0 ? "text-red-600" : "text-slate-800"}`}>
              {observations.critical.length}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block mb-1">Advertencias</span>
            <span className={`font-semibold \${observations.warnings.length > 0 ? "text-orange-500" : "text-slate-800"}`}>
              {observations.warnings.length}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <AlertBox
            type="error"
            title={`Errores críticos (\${observations.critical.length})`}
            items={observations.critical}
            emptyMessage="No se encontraron errores críticos."
          />
          <AlertBox
            type="warning"
            title={`Advertencias (\${observations.warnings.length})`}
            items={observations.warnings}
          />
          <AlertBox
            type="info"
            title={`Observaciones informativas (\${observations.info.length})`}
            items={observations.info}
          />
        </div>
      </div>
      
      <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
        <span className="truncate max-w-[250px]">Archivo: {result.fileName}</span>
        <span>{(result.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
      </div>
    </div>
  );
}

function AlertBox({ 
  type, 
  title, 
  items, 
  emptyMessage 
}: { 
  type: "error" | "warning" | "info"; 
  title: string; 
  items: any[]; 
  emptyMessage?: string 
}) {
  if (items.length === 0 && !emptyMessage) return null;

  const styles = {
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-orange-50 border-orange-200 text-orange-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  };
  
  const icons = {
    error: <X className="w-4 h-4 text-red-500 mt-0.5" />,
    warning: <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />,
    info: <Info className="w-4 h-4 text-blue-500 mt-0.5" />
  };

  return (
    <div className={`border rounded-md p-3 \${styles[type]}`}>
      <div className="flex gap-2">
        {icons[type]}
        <div>
          <h4 className="text-sm font-semibold mb-1">{title}</h4>
          {items.length > 0 ? (
            <ul className="text-xs space-y-1 list-disc ml-4">
              {items.slice(0, 5).map((item, i) => (
                <li key={i}>{item.message} {item.rowNumber ? `(Fila \${item.rowNumber})` : ""}</li>
              ))}
              {items.length > 5 && (
                <li className="italic">... y {items.length - 5} más</li>
              )}
            </ul>
          ) : (
            <p className="text-xs">{emptyMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
