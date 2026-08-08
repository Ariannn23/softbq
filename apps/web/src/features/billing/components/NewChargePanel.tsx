import { Loader2, X } from "lucide-react";

import { ClientCombobox } from "../../shared/ui/ClientCombobox";
import type { Client } from "../../shared/types";
import { MoneyInput } from "./BillingPaymentPanel";

type NewChargePanelProps = {
  clients: Client[];
  clientId: number | "";
  concept: string;
  amount: string;
  isSubmitting: boolean;
  onClientChange: (value: number | "") => void;
  onConceptChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export function NewChargePanel({
  clients,
  clientId,
  concept,
  amount,
  isSubmitting,
  onClientChange,
  onConceptChange,
  onAmountChange,
  onClose,
  onSave,
}: NewChargePanelProps) {
  return (
    <div
      className="fixed right-0 bottom-0 w-[360px] bg-white shadow-[-10px_0_40px_-10px_rgba(0,0,0,0.1)] z-[100] flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200"
      style={{ top: "66px" }}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">Nuevo Cargo Manual</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
            <ClientCombobox clients={clients} value={clientId} onChange={(value) => onClientChange(Number(value) || "")} className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Concepto</label>
            <input
              type="text"
              value={concept}
              onChange={(event) => onConceptChange(event.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Ej: Honorarios Contables"
            />
          </div>

          <MoneyInput label="Total a cobrar" value={amount} onChange={onAmountChange} />
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50">
        <button onClick={onClose} className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors flex items-center gap-2 bg-white">
          <X className="w-4 h-4" /> Cancelar
        </button>
        <button
          onClick={onSave}
          disabled={isSubmitting || !clientId || !concept || !amount}
          className="flex-1 py-2.5 bg-[#056ba6] rounded-lg text-white font-medium hover:bg-[#045585] transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Crear Cargo
        </button>
      </div>
    </div>
  );
}
