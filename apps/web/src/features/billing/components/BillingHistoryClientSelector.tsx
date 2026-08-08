import type { Client } from "../../shared/types";
import { ClientCombobox } from "../../shared/ui/ClientCombobox";

export function BillingHistoryClientSelector({
  clients,
  clientId,
  onClientChange,
}: {
  clients: Client[];
  clientId: string;
  onClientChange: (value: string) => void;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <label className="block text-sm font-medium text-slate-700 mb-2">Seleccionar Cliente</label>
      <div className="max-w-md">
        <ClientCombobox clients={clients} value={clientId} onChange={(value) => onClientChange(value.toString())} placeholder="Escribe el RUC o Nombre..." />
      </div>
    </div>
  );
}
