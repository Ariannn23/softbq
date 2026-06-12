import type { ImportPreview } from "../../shared/types";
import { TableRowsSkeleton } from "../../shared/ui";

export function ImportPreviewTable({
  busy,
  hasAnalysis,
  preview
}: {
  busy: boolean;
  hasAnalysis: boolean;
  preview: ImportPreview | null;
}) {
  return (
    <table className="min-w-[760px] w-full text-left text-xs">
      <thead className="bg-[#f2f8fe] font-bold">
        <tr>
          <th className="px-3 py-3">RUC</th>
          <th className="px-3 py-3">Razon social</th>
          <th className="px-3 py-3">Nombre corto</th>
          <th className="px-3 py-3">Codigo entidad</th>
          <th className="px-3 py-3">Descripcion entidad</th>
          <th className="px-3 py-3">Condicion</th>
          <th className="px-3 py-3">Código de pago</th>
          <th className="px-3 py-3">IGV</th>
          <th className="px-3 py-3">Ventas Base</th>
          <th className="px-3 py-3">Ventas Total</th>
          <th className="px-3 py-3">Compras Base</th>
          <th className="px-3 py-3">Compras Total</th>
        </tr>
      </thead>
      <tbody>
        {busy && hasAnalysis ? <TableRowsSkeleton columns={8} rows={5} /> : null}
        {!busy && preview?.rows.map((row) => (
          <tr className="border-t border-[#e2edf8]" key={`${row.ruc}-${row.shortName}`}>
            <td className="px-3 py-3 font-mono">{row.ruc}</td>
            <td className="px-3 py-3">{row.businessName}</td>
            <td className="px-3 py-3">{row.shortName}</td>
            <td className="px-3 py-3">{row.contasisEntityCode}</td>
            <td className="px-3 py-3">{row.contasisEntityDescription}</td>
            <td className="px-3 py-3">{row.defaultCondition}</td>
            <td className="px-3 py-3">{row.defaultPaymentMethod}</td>
            <td className="px-3 py-3">{row.defaultIgvPercent}%</td>
            <td className="px-3 py-3 font-mono">{row.salesBaseAccount || "-"}</td>
            <td className="px-3 py-3 font-mono">{row.salesTotalAccount || "-"}</td>
            <td className="px-3 py-3 font-mono">{row.purchasesBaseAccount || "-"}</td>
            <td className="px-3 py-3 font-mono">{row.purchasesTotalAccount || "-"}</td>
          </tr>
        ))}
        {!busy && (!preview || preview.rows.length === 0) ? (
          <tr>
            <td className="px-3 py-5 text-[#53698d]" colSpan={12}>Completa el mapeo requerido para ver la vista previa.</td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}
