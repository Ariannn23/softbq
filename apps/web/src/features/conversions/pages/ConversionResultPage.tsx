import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Download, Info, ArrowLeft, ArrowRight } from "lucide-react";
import type { GenerateConversionResponse } from "../services/conversionsApi";

export function ConversionResultPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as GenerateConversionResponse | undefined;

  if (!result) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center">
        <h2 className="text-xl font-bold text-slate-800">No hay datos de la conversión</h2>
        <button
          onClick={() => navigate("/conversiones")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Volver a Conversiones
        </button>
      </div>
    );
  }

  const handleDownload = (fileId: number) => {
    window.location.href = `/api/conversions/${result.conversionId}/download/${fileId}`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
          <button onClick={() => navigate("/conversiones")} className="hover:underline">Conversiones</button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">Resultado de conversión</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Resultado de conversión</h1>
        <p className="text-slate-500 mt-1">La conversión se completó correctamente.</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-wrap gap-8 items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-green-700">Conversión completada</h3>
            <p className="text-sm text-slate-600">La conversión se realizó correctamente.</p>
          </div>
        </div>
        
        {/* We don't have the period or client name in the result object, 
            but in a real scenario we could fetch it from the API or pass it in state.
            For now, we'll keep it simple based on the response. */}
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Archivos generados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.sales && (
            <ResultCard 
              title="Ventas (SIRE)"
              iconColor="text-green-600"
              iconBg="bg-green-100"
              btnColor="bg-green-600 hover:bg-green-700 text-white"
              file={result.sales}
              onDownload={() => handleDownload(result.sales!.fileId)}
            />
          )}
          
          {result.purchases && (
            <ResultCard 
              title="Compras (SIRE)"
              iconColor="text-purple-600"
              iconBg="bg-purple-100"
              btnColor="bg-purple-600 hover:bg-purple-700 text-white"
              file={result.purchases}
              onDownload={() => handleDownload(result.purchases!.fileId)}
            />
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-blue-800 mb-1">Observaciones</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc ml-4">
            <li>Los archivos generados están en formato compatible con Contasis.</li>
            <li>Se recomienda verificar la información en el sistema contable antes de su importación.</li>
          </ul>
        </div>
      </div>

      <div className="bg-white px-6 py-4 flex justify-between items-center border border-slate-200 rounded-lg shadow-sm">
        <button
          onClick={() => navigate("/conversiones/nueva")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Nueva conversión
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Ir al panel principal
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ResultCard({
  title,
  iconColor,
  iconBg,
  btnColor,
  file,
  onDownload
}: {
  title: string;
  iconColor: string;
  iconBg: string;
  btnColor: string;
  file: { fileName: string; recordsCount: number; sizeBytes: number };
  onDownload: () => void;
}) {
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
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-sm text-slate-500">Archivo generado</span>
          <span className="text-sm font-medium text-slate-800 text-right truncate max-w-[200px]" title={file.fileName}>
            {file.fileName}
          </span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-sm text-slate-500">Registros procesados</span>
          <span className="text-sm font-medium text-slate-800">{file.recordsCount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-sm text-slate-500">Total comprobantes</span>
          <span className="text-sm font-medium text-slate-800">{file.recordsCount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-sm text-slate-500">Tamaño del archivo</span>
          <span className="text-sm font-medium text-slate-800">{(file.sizeBytes / 1024).toFixed(0)} KB</span>
        </div>
        <div className="flex justify-between pb-2">
          <span className="text-sm text-slate-500">Generado el</span>
          <span className="text-sm font-medium text-slate-800">{new Date().toLocaleDateString("es-PE")} {new Date().toLocaleTimeString("es-PE")}</span>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
        <button
          className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 flex justify-center items-center gap-2"
        >
          <Info className="w-4 h-4" />
          Vista previa
        </button>
        <button
          onClick={onDownload}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md flex justify-center items-center gap-2 ${btnColor}`}
        >
          <Download className="w-4 h-4" />
          Descargar Excel
        </button>
      </div>
    </div>
  );
}
