import type { LucideIcon } from "lucide-react";

export function MetricCard({
  help,
  icon: Icon,
  label,
  tone,
  value
}: {
  help: string;
  icon: LucideIcon;
  label: string;
  tone: "blue" | "green" | "orange" | "purple" | "teal";
  value: number;
}) {
  const colors = {
    blue: "bg-[#dff1ff] text-[#056ba6]",
    green: "bg-emerald-100 text-emerald-700",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-violet-100 text-violet-700",
    teal: "bg-cyan-100 text-cyan-700"
  };

  return (
    <article className="rounded-lg border border-[#d8e8f6] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${colors[tone]}`}>
          <Icon size={30} />
        </div>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-3xl font-bold text-[#056ba6]">{value}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-[#53698d]">{help}</p>
    </article>
  );
}
