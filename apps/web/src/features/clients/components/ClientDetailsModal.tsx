import { X } from "lucide-react";
import type { Client } from "../../shared/types";

export function ClientDetailsModal({
  client,
  isOpen,
  onClose,
}: {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">
          Detalles del Cliente
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">Razón Social</span>
            <p className="font-medium text-slate-800">{client.businessName}</p>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">RUC</span>
            <p className="font-mono text-slate-800">{client.ruc}</p>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">Nombre Corto</span>
            <p className="text-slate-800">{client.shortName}</p>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">Estado</span>
            <p className="text-slate-800">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${client.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {client.active ? "Activo" : "Inactivo"}
              </span>
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 mt-2 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Información Contable</h3>
          </div>

          <div>
            <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">Condición por defecto</span>
            <p className="text-slate-800">{client.defaultCondition}</p>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">Medio de pago por defecto</span>
            <p className="text-slate-800">{client.defaultPaymentMethod}</p>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">IGV por defecto</span>
            <p className="text-slate-800">{client.defaultIgvPercent}%</p>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">Honorarios</span>
            <p className="text-slate-800">{client.monthlyFee ? `S/ ${client.monthlyFee}` : "No especificado"}</p>
          </div>

          <div className="col-span-1 md:col-span-2 mt-2 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Configuración de Cuentas y Declaraciones</h3>
          </div>

          <div>
            <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">Cuenta de Ventas</span>
            <p className="font-mono text-slate-800">{client.salesAccount || "-"}</p>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">Cuenta de Compras</span>
            <p className="font-mono text-slate-800">{client.purchasesAccount || "-"}</p>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">Declara PLAME</span>
            <p className="text-slate-800">
              {client.hasPlame ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-800">SÍ</span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">NO</span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Cerrar Detalles
          </button>
        </div>
      </div>
    </div>
  );
}
