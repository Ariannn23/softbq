import { Loader2, X } from "lucide-react";

type EditAmountModalProps = {
  value: string;
  isSubmitting: boolean;
  onValueChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export function EditAmountModal({ value, isSubmitting, onValueChange, onClose, onSave }: EditAmountModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Editar Monto de Cobro</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">Nuevo Monto (S/)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="0.00"
          />
        </div>
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={isSubmitting || !value}
            className="px-4 py-2 text-sm font-medium text-white bg-[#056ba6] hover:bg-[#045585] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
