import { Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { ValidationCard } from "../components/ValidationCard";
import { ValidationSummaryBar } from "../components/ValidationSummaryBar";
import { useValidationPreviewPage } from "../hooks/useValidationPreviewPage";
import type { ValidationResponse } from "../services/conversionsApi";

export function ValidationPreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const validation = location.state?.validation as ValidationResponse | undefined;
  const preview = useValidationPreviewPage({
    validation,
    onGenerated: (conversionId, result) => navigate(`/conversions/result/${conversionId}`, { state: { result } }),
  });

  if (!validation) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center">
        <h2 className="text-xl font-bold text-slate-800">No hay datos de validacion</h2>
        <button onClick={() => navigate("/conversions/new")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Validacion / Vista previa</h1>
        <p className="text-slate-500 mt-1">Revisa los archivos cargados antes de generar los Excel para Contasis.</p>
      </div>

      <ValidationSummaryBar validation={validation} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {validation.sales && <ValidationCard result={validation.sales} title="VENTAS (SIRE)" iconColor="text-green-600" />}
        {validation.purchases && <ValidationCard result={validation.purchases} title="COMPRAS (SIRE)" iconColor="text-purple-600" />}
      </div>

      <div className="bg-white px-6 py-4 flex justify-between items-center border border-slate-200 rounded-lg shadow-sm">
        <div className="flex gap-4">
          <button onClick={() => navigate("/conversions/new")} className="px-6 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded-lg font-medium transition-colors">
            Volver
          </button>
          <button onClick={() => navigate("/conversions")} className="px-6 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-medium transition-colors">
            Cancelar
          </button>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => void preview.generate()}
            disabled={preview.isGenerating}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {preview.isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
            {preview.isGenerating ? "Generando..." : "Generar Excel Contasis"}
          </button>
          {preview.error && <span className="text-red-500 text-sm font-medium">{preview.error}</span>}
        </div>
      </div>
    </div>
  );
}
