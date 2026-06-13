import type { LucideIcon } from "lucide-react";
import { Search, X } from "lucide-react";

export function BrandMark({
  dark = false,
  size,
  iconOnly = false
}: {
  dark?: boolean;
  size: "md" | "lg" | "xl";
  iconOnly?: boolean;
}) {
  const markSize = size === "xl" ? "h-20 w-20 text-5xl" : size === "lg" ? "h-16 w-16 text-4xl" : "h-12 w-12 text-3xl";
  const wordSize = size === "xl" ? "text-6xl" : size === "lg" ? "text-4xl" : "text-3xl";

  return (
    <div className="flex items-center gap-4">
      <div className={`${markSize} flex shrink-0 items-center justify-center overflow-hidden rounded-2xl`}>
        <img src="/images/icono.png" alt="Grupo BQ Logo" className="h-full w-full object-contain" />
      </div>
      {!iconOnly && (
        <div className={`flex items-center justify-center overflow-hidden ${size === "xl" ? "h-16" : size === "lg" ? "h-12" : "h-8"}`}>
          <img src="/images/logo2.png" alt="Grupo BQ" className="h-full object-contain" />
        </div>
      )}
    </div>
  );
}

export function SearchBox({
  onChange,
  placeholder,
  value
}: {
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="relative block w-full">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#53698d]" />
      <input
        className="h-11 w-full rounded-md border border-[#c9dbef] bg-white pl-12 pr-10 text-sm outline-none focus:border-[#0aa0ed]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
      {value && (
        <button
          className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-[#53698d] hover:bg-slate-100 hover:text-slate-800 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            onChange("");
          }}
          type="button"
        >
          <X size={14} />
        </button>
      )}
    </label>
  );
}

export function StatusPill({ label, tone }: { label: string; tone: "green" | "gray" | "orange" }) {
  const tones = {
    green: "bg-emerald-100 text-emerald-700",
    gray: "bg-slate-100 text-slate-600",
    orange: "bg-orange-100 text-orange-700"
  };

  return <span className={`rounded-md px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{label}</span>;
}

export function StatusDot({ checked }: { checked: boolean }) {
  return (
    <td className="px-5 py-3 text-center">
      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${checked ? "border-emerald-600 text-emerald-600" : "border-slate-300"}`}>
        {checked ? "✓" : ""}
      </span>
    </td>
  );
}

export function IconButton({
  disabled,
  icon: Icon,
  label,
  onClick,
  tone
}: {
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  tone: "blue" | "green" | "gray" | "red" | "indigo" | "purple";
}) {
  const tones = {
    blue: "border-[#b9d9f9] text-[#056ba6]",
    green: "border-emerald-200 text-emerald-700",
    gray: "border-slate-200 text-slate-400",
    red: "border-red-200 text-red-600",
    indigo: "border-indigo-200 text-indigo-600",
    purple: "border-purple-200 text-purple-600"
  };

  return (
    <button
      className={`flex h-10 w-10 items-center justify-center rounded-md border bg-white disabled:opacity-50 ${tones[tone]}`}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      <Icon size={18} />
    </button>
  );
}

export function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-[#d8e8f6] ${className}`} />;
}

export function TableRowsSkeleton({ columns, rows }: { columns: number; rows: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <tr className="border-t border-[#e2edf8]" key={rowIndex}>
          {Array.from({ length: columns }, (_, columnIndex) => (
            <td className="px-5 py-4" key={columnIndex}>
              <SkeletonLine className={columnIndex === columns - 1 ? "ml-auto h-9 w-20" : "h-4 w-full"} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <SkeletonLine className="h-14 w-14" />
        <div className="flex-1">
          <SkeletonLine className="h-4 w-28" />
          <SkeletonLine className="mt-3 h-8 w-16" />
        </div>
      </div>
      <SkeletonLine className="mt-5 h-4 w-36" />
    </div>
  );
}
