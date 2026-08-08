import { Banknote, Loader2, Pencil, Search, X } from "lucide-react";

import { Pagination } from "../../shared/Pagination";
import type { BillingCharge } from "../services/billingApi";

type BillingChargesTableProps = {
  charges: BillingCharge[];
  filteredCount: number;
  isLoading: boolean;
  searchTerm: string;
  page: number;
  limit: number;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
  onEditAmount: (charge: BillingCharge) => void;
  onRegisterPayment: (charge: BillingCharge) => void;
};

export function BillingChargesTable({
  charges,
  filteredCount,
  isLoading,
  searchTerm,
  page,
  limit,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onEditAmount,
  onRegisterPayment,
}: BillingChargesTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-800">Listado de deudas</h2>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg text-sm w-full sm:w-[300px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              onClick={() => onSearchChange("")}
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Cliente</th>
              <th className="px-6 py-4 font-semibold">Concepto</th>
              <th className="px-6 py-4 font-semibold text-right">Total</th>
              <th className="px-6 py-4 font-semibold text-right">Pagado</th>
              <th className="px-6 py-4 font-semibold text-right">Deuda</th>
              <th className="px-6 py-4 font-semibold text-center">Estado</th>
              <th className="px-6 py-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Cargando cobranzas...
                  </div>
                </td>
              </tr>
            ) : filteredCount === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  No se encontraron deudas para el periodo seleccionado.
                </td>
              </tr>
            ) : (
              charges.map((charge) => (
                <BillingChargeRow
                  key={charge.id}
                  charge={charge}
                  onEditAmount={onEditAmount}
                  onRegisterPayment={onRegisterPayment}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-white border-t border-slate-200">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(filteredCount / limit) || 1}
          totalItems={filteredCount}
          pageSize={limit}
          onPageChange={onPageChange}
          onPageSizeChange={(newLimit) => {
            onPageSizeChange(newLimit);
            onPageChange(1);
          }}
          itemName="deudas"
        />
      </div>
    </div>
  );
}

function BillingChargeRow({
  charge,
  onEditAmount,
  onRegisterPayment,
}: {
  charge: BillingCharge;
  onEditAmount: (charge: BillingCharge) => void;
  onRegisterPayment: (charge: BillingCharge) => void;
}) {
  const debt = charge.totalAmount - charge.paidAmount;
  const isPaid = charge.status === "pagado";
  const isPartial = charge.status === "parcial";

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-4">
        <p className="font-medium text-slate-800">{charge.client.businessName}</p>
        <p className="text-xs text-slate-500">{charge.client.ruc}</p>
      </td>
      <td className="px-6 py-4 text-slate-600">{charge.concept}</td>
      <td className="px-6 py-4 text-right font-medium text-slate-800">S/ {charge.totalAmount.toFixed(2)}</td>
      <td className="px-6 py-4 text-right font-medium text-emerald-600">S/ {charge.paidAmount.toFixed(2)}</td>
      <td className={`px-6 py-4 text-right font-bold ${isPaid ? "text-slate-400" : "text-red-600"}`}>
        S/ {debt.toFixed(2)}
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center">
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
              isPaid ? "bg-emerald-100 text-emerald-700" : isPartial ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
            }`}
          >
            {isPaid ? "Pagado" : isPartial ? "Parcial" : "Pendiente"}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => onEditAmount(charge)}
            className="p-2 rounded-lg transition-colors text-[#056ba6] hover:bg-blue-50 hover:text-[#045585]"
            title="Editar monto a cobrar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRegisterPayment(charge)}
            disabled={isPaid}
            className={`p-2 rounded-lg transition-colors ${
              isPaid ? "text-slate-300 cursor-not-allowed" : "text-[#056ba6] hover:bg-blue-50 hover:text-[#045585]"
            }`}
            title={isPaid ? "Deuda pagada" : "Registrar pago"}
          >
            <Banknote className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
