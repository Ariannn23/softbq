import { SkeletonLine } from "../../shared/ui";

export function ImportColumnsStep({ busy, hasAnalysis, headers }: { busy: boolean; hasAnalysis: boolean; headers: string[] }) {
  return (
    <section className="rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-[#045585]">3. Columnas detectadas</h2>
      <p className="mt-4 text-sm text-[#53698d]">Se detectaron {headers.length} columnas en la hoja seleccionada.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {busy && !hasAnalysis
          ? Array.from({ length: 5 }, (_, index) => <SkeletonLine className="h-8 w-24" key={index} />)
          : headers.slice(0, 8).map((header, index) => (
              <span className="rounded border border-[#c9dbef] px-3 py-2 text-xs" key={header}>
                {String.fromCharCode(65 + index)} {header}
              </span>
            ))}
        {!busy && headers.length > 8 ? <span className="rounded border border-[#c9dbef] px-3 py-2 text-xs">+ {headers.length - 8} mas</span> : null}
      </div>
    </section>
  );
}
