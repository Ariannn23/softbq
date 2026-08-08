import { BarChart3, FileSpreadsheet, Files, ShieldCheck } from "lucide-react";

import { BrandMark } from "../../shared/ui";

export function LoginVisualPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#0aa0ed] via-[#056ba6] to-[#072d4a] p-8 lg:block">
      <div className="relative z-10 flex flex-col items-center text-center">
        <BrandMark size="lg" />
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#063b5f]">Software Contable</p>
      </div>
      <div className="relative z-10 mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <FileCard label="TXT" tone="blue" />
        <div className="text-3xl font-semibold text-white/90">...</div>
        <FileCard label="XLSX" tone="green" />
      </div>
      <div className="relative z-10 mx-auto mt-8 flex h-24 max-w-[200px] items-center justify-center rounded-lg border border-white/25 bg-white/10 p-4 shadow-2xl backdrop-blur">
        <BarChart3 className="h-10 w-10 text-[#7bd0fe]" />
      </div>
      <div className="relative z-10 mt-8 grid grid-cols-3 gap-3 text-center">
        <FeatureMini icon={ShieldCheck} label="Seguro" text="Protegemos tu informacion" />
        <FeatureMini icon={FileSpreadsheet} label="Conversion" text="TXT a Excel eficiente" />
        <FeatureMini icon={Files} label="Listo" text="Para tu plataforma contable" />
      </div>
    </div>
  );
}

function FileCard({ label, tone }: { label: string; tone: "blue" | "green" }) {
  return (
    <div className="relative h-24 rounded-lg bg-white p-4 shadow-2xl">
      <div className={`absolute left-3 top-6 rounded px-3 py-1.5 text-lg font-bold text-white ${tone === "blue" ? "bg-[#056ba6]" : "bg-emerald-600"}`}>{label}</div>
    </div>
  );
}

function FeatureMini({
  icon: Icon,
  label,
  text,
}: {
  icon: typeof ShieldCheck;
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm transition-all hover:bg-white/15">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
        <Icon className="h-4 w-4 text-[#7bd0fe]" />
      </div>
      <p className="mt-1.5 text-sm font-bold text-white">{label}</p>
      <p className="mt-0.5 text-[11px] leading-tight text-white/80">{text}</p>
    </div>
  );
}
