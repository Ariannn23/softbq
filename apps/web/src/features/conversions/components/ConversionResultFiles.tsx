import type { GenerateConversionResponse } from "../services/conversionsApi";
import { ConversionResultCard } from "./ConversionResultCard";

export function ConversionResultFiles({
  result,
  onDownload,
}: {
  result: GenerateConversionResponse;
  onDownload: (fileId: number) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-4">Archivos generados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.sales && (
          <ConversionResultCard
            title="Ventas (SIRE)"
            iconColor="text-green-600"
            iconBg="bg-green-100"
            buttonColor="bg-green-600 hover:bg-green-700 text-white"
            file={result.sales}
            onDownload={() => onDownload(result.sales!.fileId)}
          />
        )}

        {result.purchases && (
          <ConversionResultCard
            title="Compras (SIRE)"
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
            buttonColor="bg-purple-600 hover:bg-purple-700 text-white"
            file={result.purchases}
            onDownload={() => onDownload(result.purchases!.fileId)}
          />
        )}
      </div>
    </div>
  );
}
