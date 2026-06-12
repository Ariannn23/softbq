import { AlertTriangle, Download } from "lucide-react";

export function BlockingUpdateOverlay({ minVersion }: { minVersion: string }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Actualización Obligatoria
        </h2>
        <p className="text-slate-600 mb-6 leading-relaxed">
          Estás usando una versión muy antigua de SoftBQ. Para continuar, es
          necesario que el sistema se actualice a la versión <b>{minVersion}</b> o superior.
        </p>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-500 mb-6 flex flex-col items-center gap-2">
          <Download className="w-5 h-5 text-brand-500 animate-bounce" />
          <p>
            La actualización se está descargando automáticamente en segundo plano.
            Espera unos segundos a que aparezca la alerta y haz clic en "Reiniciar y Actualizar".
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
        >
          Forzar Recarga Manual
        </button>
      </div>
    </div>
  );
}
