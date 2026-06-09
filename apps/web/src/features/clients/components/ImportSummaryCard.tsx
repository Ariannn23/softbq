export function ImportSummaryCard({
  label,
  tone,
  value
}: {
  label: string;
  tone: "green" | "blue" | "orange" | "red";
  value: number;
}) {
  const classes = {
    blue: "border-[#c9dbef] bg-[#f0f9ff] text-[#056ba6]",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    orange: "border-orange-200 bg-orange-50 text-orange-600",
    red: "border-red-200 bg-red-50 text-red-600"
  };

  return (
    <article className={`rounded-md border p-5 text-center ${classes[tone]}`}>
      <p className="font-semibold">{label}</p>
      <p className="mt-2 text-4xl font-bold">{value}</p>
    </article>
  );
}
