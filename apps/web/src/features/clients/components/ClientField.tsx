import type { UseFormReturn } from "react-hook-form";

import type { ClientValues } from "../../shared/types";

export function ClientField({
  form,
  inputMode,
  label,
  maxLength,
  name,
  onlyDigits = false,
  step,
  type = "text"
}: {
  form: UseFormReturn<ClientValues>;
  inputMode?: "decimal" | "email" | "none" | "numeric" | "search" | "tel" | "text" | "url";
  label: string;
  maxLength?: number;
  name: keyof ClientValues;
  onlyDigits?: boolean;
  step?: string;
  type?: string;
}) {
  const error = form.formState.errors[name]?.message;
  const registration = form.register(name);

  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        className="mt-2 h-11 w-full rounded-md border border-[#c9dbef] px-3 text-sm font-normal outline-none focus:border-[#0aa0ed]"
        inputMode={onlyDigits ? "numeric" : inputMode}
        maxLength={maxLength}
        step={step}
        type={type}
        {...registration}
        onChange={(event) => {
          if (onlyDigits) {
            event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, maxLength);
          }

          void registration.onChange(event);
        }}
      />
      {error ? <span className="mt-2 block text-xs text-red-600">{String(error)}</span> : null}
    </label>
  );
}
