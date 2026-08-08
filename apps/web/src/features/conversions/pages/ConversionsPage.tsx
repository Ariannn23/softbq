import { Info, PlusCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { ConversionsFilters } from "../components/ConversionsFilters";
import { ConversionsHistoryTable } from "../components/ConversionsHistoryTable";
import { useConversionsPage } from "../hooks/useConversionsPage";

export function ConversionsPage() {
  const navigate = useNavigate();
  const conversions = useConversionsPage();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Historial de conversiones</h1>
          <p className="text-slate-500 mt-1">Consulta las conversiones realizadas en el sistema.</p>
        </div>
        <Link to="/conversions/new" className="flex h-[42.4px] items-center justify-center gap-3 rounded-md bg-[#056ba6] px-6 font-semibold text-white hover:bg-[#045585] transition-colors">
          <PlusCircle size={20} />
          Nueva conversion
        </Link>
      </div>

      <ConversionsFilters
        period={conversions.filters.period}
        clientId={conversions.filters.clientId}
        status={conversions.filters.status}
        clients={conversions.clientsData}
        onPeriodChange={conversions.filters.setPeriod}
        onClientChange={conversions.filters.setClientId}
        onStatusChange={conversions.filters.setStatus}
        onClear={conversions.filters.clear}
      />

      <ConversionsHistoryTable
        data={conversions.data}
        isLoading={conversions.isLoading}
        isError={conversions.isError}
        page={conversions.pagination.page}
        limit={conversions.pagination.limit}
        onRetry={() => void conversions.reload()}
        onPageChange={conversions.pagination.setPage}
        onPageSizeChange={conversions.pagination.setLimit}
        onDownload={conversions.downloadFile}
        onViewResult={(conversionId, result) => navigate(`/conversions/result/${conversionId}`, { state: { result } })}
      />

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-blue-800">
        <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
        <div>
          <h4 className="font-semibold mb-0.5">Informacion</h4>
          <p className="text-sm">Los archivos generados estaran disponibles para su descarga durante 30 dias desde la fecha de conversion.</p>
        </div>
      </div>
    </div>
  );
}
