import { ArrowLeft, ArrowRight, CheckCircle2, Info } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { ConversionResultFiles } from "../components/ConversionResultFiles";
import type { GenerateConversionResponse } from "../services/conversionsApi";

export function ConversionResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as GenerateConversionResponse | undefined;

  if (!result) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center">
        <h2 className="text-xl font-bold text-slate-800">No hay datos de la conversion</h2>
        <button onClick={() => navigate("/conversions")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
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
          <button onClick={() => navigate("/conversions")} className="hover:underline">
            Conversiones
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">Resultado de conversion</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Resultado de conversion</h1>
        <p className="text-slate-500 mt-1">La conversion se completo correctamente.</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-wrap gap-8 items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-green-700">Conversion completada</h3>
            <p className="text-sm text-slate-600">La conversion se realizo correctamente.</p>
          </div>
        </div>
      </div>

      <ConversionResultFiles result={result} onDownload={handleDownload} />

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-blue-800 mb-1">Observaciones</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc ml-4">
            <li>Los archivos generados estan en formato compatible con Contasis.</li>
            <li>Se recomienda verificar la informacion en el sistema contable antes de su importacion.</li>
          </ul>
        </div>
      </div>

      <div className="bg-white px-6 py-4 flex justify-between items-center border border-slate-200 rounded-lg shadow-sm">
        <button onClick={() => navigate("/conversions/new")} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
          <ArrowLeft className="w-4 h-4" />
          Nueva conversion
        </button>
        <button onClick={() => navigate("/conversions")} className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Volver a Conversiones
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
