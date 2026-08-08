import { Loader2, Users, X } from "lucide-react";

import { PAYMENT_METHODS } from "../config";
import type { BillingCharge } from "../services/billingApi";

type BillingPaymentPanelProps = {
  charge: BillingCharge;
  amount: string;
  method: string;
  date: string;
  notes: string;
  isSubmitting: boolean;
  onAmountChange: (value: string) => void;
  onMethodChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export function BillingPaymentPanel({
  charge,
  amount,
  method,
  date,
  notes,
  isSubmitting,
  onAmountChange,
  onMethodChange,
  onDateChange,
  onNotesChange,
  onClose,
  onSave,
}: BillingPaymentPanelProps) {
  const pendingDebt = charge.totalAmount - charge.paidAmount;

  return (
    <div
      className="fixed right-0 bottom-0 w-[360px] bg-white shadow-[-10px_0_40px_-10px_rgba(0,0,0,0.1)] z-[100] flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200"
      style={{ top: "66px" }}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">Registrar Pago</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-[#056ba6]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Cliente</p>
            <p className="font-semibold text-slate-800 line-clamp-1">{charge.client.businessName}</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-500 mb-1">Deuda pendiente</p>
          <p className="text-3xl font-bold text-red-600">S/ {pendingDebt.toFixed(2)}</p>
        </div>

        <div className="space-y-4">
          <MoneyInput label="Monto a pagar" value={amount} max={pendingDebt} onChange={onAmountChange} />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Medio de Pago</label>
            <select
              value={method}
              onChange={(event) => onMethodChange(event.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              {PAYMENT_METHODS.map((paymentMethod) => (
                <option key={paymentMethod} value={paymentMethod}>
                  {paymentMethod}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de pago</label>
            <input
              type="date"
              value={date}
              onChange={(event) => onDateChange(event.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones (Opcional)</label>
            <textarea
              value={notes}
              onChange={(event) => onNotesChange(event.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Anadir una nota..."
            />
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50">
        <button onClick={onClose} className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors flex items-center gap-2 bg-white">
          <X className="w-4 h-4" /> Cancelar
        </button>
        <button onClick={onSave} disabled={isSubmitting} className="flex-1 py-2.5 bg-[#056ba6] rounded-lg text-white font-medium hover:bg-[#045585] transition-colors flex justify-center items-center gap-2 disabled:opacity-70">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Guardar Pago
        </button>
      </div>
    </div>
  );
}

export function MoneyInput({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: string;
  max?: number;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">S/</span>
        <input
          type="number"
          step="0.01"
          min="0.01"
          max={max}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="0.00"
        />
      </div>
    </div>
  );
}
