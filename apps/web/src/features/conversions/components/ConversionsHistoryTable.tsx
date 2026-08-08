import { AlertCircle, Eye, FileSpreadsheet, Loader2 } from "lucide-react";

import { Pagination } from "../../shared/Pagination";
import type { ConversionHistoryItem, ConversionHistoryResponse } from "../services/conversionsApi";
import { buildConversionResultPayload, formatConversionDateTime, formatConversionPeriod } from "../utils/conversionFormatters";
import { ConversionStatusBadge } from "./ConversionStatusBadge";

type ConversionsHistoryTableProps = {
  data: ConversionHistoryResponse | null;
  isLoading: boolean;
  isError: boolean;
  page: number;
  limit: number;
  onRetry: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
  onDownload: (conversionId: number, fileId: number) => void;
  onViewResult: (conversionId: number, result: ReturnType<typeof buildConversionResultPayload>) => void;
};

export function ConversionsHistoryTable({
  data,
  isLoading,
  isError,
  page,
  limit,
  onRetry,
  onPageChange,
  onPageSizeChange,
  onDownload,
  onViewResult,
}: ConversionsHistoryTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col relative min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center text-slate-500">
          <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
          <p className="font-medium text-slate-700">Error al cargar conversiones</p>
          <button onClick={onRetry} className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded text-sm hover:bg-blue-100">
            Reintentar
          </button>
        </div>
      )}

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
              <th className="px-4 py-3 whitespace-nowrap">Fecha de conversion</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3 whitespace-nowrap">RUC</th>
              <th className="px-4 py-3 whitespace-nowrap">Periodo</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">Registros<br />Ventas</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">Registros<br />Compras</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 text-center">Archivos generados</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {data?.data.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-16 text-center text-slate-500">
                  <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-medium">No se encontraron conversiones</p>
                  <p className="text-xs mt-1">Intenta ajustando los filtros o creando una nueva.</p>
                </td>
              </tr>
            ) : (
              data?.data.map((item) => (
                <ConversionHistoryRow key={item.id} item={item} onDownload={onDownload} onViewResult={onViewResult} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.pagination.totalPages > 0 && (
        <div className="bg-white border-t border-slate-200">
          <Pagination
            currentPage={page}
            totalPages={data.pagination.totalPages}
            totalItems={data.pagination.total}
            pageSize={limit}
            onPageChange={onPageChange}
            onPageSizeChange={(newLimit) => {
              onPageSizeChange(newLimit);
              onPageChange(1);
            }}
            itemName="conversiones"
          />
        </div>
      )}
    </div>
  );
}

function ConversionHistoryRow({
  item,
  onDownload,
  onViewResult,
}: {
  item: ConversionHistoryItem;
  onDownload: (conversionId: number, fileId: number) => void;
  onViewResult: (conversionId: number, result: ReturnType<typeof buildConversionResultPayload>) => void;
}) {
  const createdAt = formatConversionDateTime(item.createdAt);

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-base font-medium text-slate-800">{createdAt.date}</span>
        <br />
        <span className="text-sm font-normal text-slate-500">{createdAt.time}</span>
      </td>
      <td className="px-4 py-3 font-medium text-slate-800 max-w-[200px] truncate" title={item.clientName}>
        {item.clientName}
      </td>
      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{item.clientRuc}</td>
      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatConversionPeriod(item.period)}</td>
      <td className="px-4 py-3 text-center text-slate-700">{item.salesRecordsCount > 0 ? item.salesRecordsCount.toLocaleString() : "-"}</td>
      <td className="px-4 py-3 text-center text-slate-700">{item.purchasesRecordsCount > 0 ? item.purchasesRecordsCount.toLocaleString() : "-"}</td>
      <td className="px-4 py-3 text-center">
        <ConversionStatusBadge status={item.status} />
      </td>
      <td className="px-4 py-3 text-center">
        <GeneratedFiles item={item} onDownload={onDownload} />
      </td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={() => onViewResult(item.id, buildConversionResultPayload(item))}
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors tooltip-trigger"
          title="Ver detalles"
        >
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

function GeneratedFiles({ item, onDownload }: { item: ConversionHistoryItem; onDownload: (conversionId: number, fileId: number) => void }) {
  const showEmpty = !item.files.sales && !item.files.purchases && item.status !== "processing" && item.status !== "draft" && item.status !== "validated";

  return (
    <div className="flex flex-col items-center gap-1.5">
      {item.files.sales ? (
        <button onClick={() => onDownload(item.id, item.files.sales!.id)} className="inline-flex items-center gap-1.5 text-xs font-medium text-black hover:text-blue-600 transition-colors" title="Descargar archivo de ventas">
          <FileSpreadsheet className="w-4 h-4 text-green-800" />
          Ventas ({item.files.sales.sizeKb} KB)
        </button>
      ) : (
        item.salesRecordsCount > 0 && <span className="text-xs text-slate-400">-</span>
      )}

      {item.files.purchases ? (
        <button onClick={() => onDownload(item.id, item.files.purchases!.id)} className="inline-flex items-center gap-1.5 text-xs font-medium text-black hover:text-blue-600 transition-colors" title="Descargar archivo de compras">
          <FileSpreadsheet className="w-4 h-4 text-green-800" />
          Compras ({item.files.purchases.sizeKb} KB)
        </button>
      ) : (
        item.purchasesRecordsCount > 0 && <span className="text-xs text-slate-400">-</span>
      )}

      {showEmpty && <span className="text-slate-400">-</span>}
    </div>
  );
}
