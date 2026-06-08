import type { UseFormReturn } from "react-hook-form";

import type { Client, ClientValues } from "../../shared/types";
import { ClientField } from "./ClientField";

export function ClientForm({
  editingClient,
  form,
  onCancel,
  onSubmit
}: {
  editingClient: Client | null;
  form: UseFormReturn<ClientValues>;
  onCancel: () => void;
  onSubmit: (values: ClientValues) => void;
}) {
  return (
    <section className="mt-6 rounded-lg border border-[#d8e8f6] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">{editingClient ? "Editar cliente" : "Crear cliente"}</h2>
        <button className="text-sm font-semibold text-[#007fcb]" onClick={onCancel} type="button">Cerrar</button>
      </div>
      <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={form.handleSubmit(onSubmit)}>
        <ClientField form={form} label="RUC" maxLength={11} name="ruc" onlyDigits />
        <ClientField form={form} label="Razon social" name="businessName" />
        <ClientField form={form} label="Nombre corto" name="shortName" />
        <ClientField form={form} label="Codigo entidad" name="contasisEntityCode" />
        <ClientField form={form} label="Descripcion entidad" name="contasisEntityDescription" />
        <ClientField form={form} label="Condicion" name="defaultCondition" />
        <ClientField form={form} label="Medio de pago" name="defaultPaymentMethod" />
        <ClientField form={form} inputMode="decimal" label="IGV" name="defaultIgvPercent" step="0.01" type="number" />
        <div className="flex items-end gap-3 xl:col-span-4">
          <button className="h-11 rounded-md bg-[#007fcb] px-7 font-semibold text-white" type="submit">Guardar</button>
          <button className="h-11 rounded-md border border-[#c9dbef] px-7 font-semibold" onClick={onCancel} type="button">Cancelar</button>
        </div>
      </form>
    </section>
  );
}
