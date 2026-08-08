import { importFields, type ClientImportField } from "../../shared/types";
import { SkeletonLine } from "../../shared/ui";

export function ImportMappingStep({
  busy,
  hasAnalysis,
  headers,
  mapping,
  onMappingChange,
}: {
  busy: boolean;
  hasAnalysis: boolean;
  headers: string[];
  mapping: Partial<Record<ClientImportField, string>>;
  onMappingChange: (mapping: Partial<Record<ClientImportField, string>>) => void;
}) {
  return (
    <section className="rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-[#045585]">4. Mapear columnas a campos de GRUPO BQ</h2>
      <div className="mt-5 space-y-3">
        {busy && !hasAnalysis
          ? Array.from({ length: 8 }, (_, index) => (
              <div className="grid grid-cols-[1fr_24px_1fr] items-center gap-3" key={index}>
                <SkeletonLine className="h-5 w-full" />
                <span className="text-center text-[#53698d]">{"->"}</span>
                <SkeletonLine className="h-9 w-full" />
              </div>
            ))
          : null}
        {!busy &&
          importFields.map((field) => (
            <div className="grid grid-cols-[1fr_24px_1fr] items-center gap-3 text-sm" key={field.key}>
              <span className="font-semibold">
                {field.label}
                {field.required ? <span className="text-red-600"> *</span> : null}
              </span>
              <span className="text-center text-[#53698d]">{"->"}</span>
              <select className="h-9 rounded-md border border-[#c9dbef] px-2 outline-none" onChange={(event) => onMappingChange({ ...mapping, [field.key]: event.target.value })} value={mapping[field.key] ?? ""}>
                <option value="">No mapear</option>
                {headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
          ))}
      </div>
    </section>
  );
}
