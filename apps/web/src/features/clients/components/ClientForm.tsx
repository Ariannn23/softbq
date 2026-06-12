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
        <button className="text-sm font-semibold text-[#056ba6]" onClick={onCancel} type="button">Cerrar</button>
      </div>
      <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={form.handleSubmit(onSubmit)}>
        <ClientField form={form} label="RUC" maxLength={11} name="ruc" onlyDigits />
        <ClientField form={form} label="Razon social" name="businessName" />
        <ClientField form={form} label="Nombre corto" name="shortName" />
        <ClientField form={form} label="Codigo entidad" name="contasisEntityCode" />
        <ClientField form={form} label="Descripcion entidad" name="contasisEntityDescription" />
        <ClientField form={form} label="Condicion" name="defaultCondition" />
        <ClientField form={form} label="Código de pago" name="defaultPaymentMethod" />
        <ClientField form={form} inputMode="decimal" label="IGV" name="defaultIgvPercent" step="0.01" type="number" />
        <ClientField form={form} inputMode="decimal" label="Honorarios" name="monthlyFee" step="0.01" type="number" />
        <ClientField form={form} label="Cuenta de ventas base" name="salesBaseAccount" />
        <ClientField form={form} label="Cuenta venta total" name="salesTotalAccount" />
        <ClientField form={form} label="Cuenta de compras base" name="purchasesBaseAccount" />
        <ClientField form={form} label="Cuenta compra total" name="purchasesTotalAccount" />
        
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold uppercase text-slate-500">¿Declara PLAME?</label>
          <label className="relative inline-flex cursor-pointer items-center mt-2">
            <input
              type="checkbox"
              className="peer sr-only"
              {...form.register("hasPlame")}
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
          </label>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold uppercase text-slate-500">¿Declara AFPNET?</label>
          <label className="relative inline-flex cursor-pointer items-center mt-2">
            <input
              type="checkbox"
              className="peer sr-only"
              {...form.register("hasAfpnet")}
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
          </label>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold uppercase text-slate-500">¿Declara ITAN?</label>
          <label className="relative inline-flex cursor-pointer items-center mt-2">
            <input
              type="checkbox"
              className="peer sr-only"
              {...form.register("hasItan")}
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
          </label>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold uppercase text-slate-500">¿Declara DAOT?</label>
          <label className="relative inline-flex cursor-pointer items-center mt-2">
            <input
              type="checkbox"
              className="peer sr-only"
              {...form.register("hasDaot")}
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
          </label>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold uppercase text-slate-500">¿Declara PDT 710?</label>
          <label className="relative inline-flex cursor-pointer items-center mt-2">
            <input
              type="checkbox"
              className="peer sr-only"
              {...form.register("hasPdt710")}
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
          </label>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold uppercase text-slate-500">¿Declara Benif. Final?</label>
          <label className="relative inline-flex cursor-pointer items-center mt-2">
            <input
              type="checkbox"
              className="peer sr-only"
              {...form.register("hasFinalBeneficiary")}
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
          </label>
        </div>

        <div className="flex items-end gap-3 xl:col-span-4 mt-2">
          <button className="h-11 rounded-md bg-[#056ba6] px-7 font-semibold text-white" type="submit">Guardar</button>
          <button className="h-11 rounded-md border border-[#c9dbef] px-7 font-semibold" onClick={onCancel} type="button">Cancelar</button>
        </div>
      </form>
    </section>
  );
}
