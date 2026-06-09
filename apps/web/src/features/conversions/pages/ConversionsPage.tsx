import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Filter, FileSpreadsheet, AlertCircle, RefreshCcw, Eye, Search, CheckCircle2, Info, Loader2, XCircle, PlusCircle } from "lucide-react";
import { getConversions, type ConversionHistoryItem, type ConversionHistoryResponse } from "../services/conversionsApi";
import { fetchClients } from "../../clients/services/clientsApi";
import type { Client } from "../../shared/types";
import { Pagination } from "../../shared/Pagination";

export function ConversionsPage() {
  const navigate = useNavigate();
  
  // Filters state
  const [period, setPeriod] = useState<string>("");
  const [clientId, setClientId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Data states
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [data, setData] = useState<ConversionHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Load clients
  useEffect(() => {
    fetchClients().then(setClientsData).catch(console.error);
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await getConversions({ period, clientId, status, page, limit });
      setData(response);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [period, clientId, status, page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClearFilters = () => {
    setPeriod("");
    setClientId("all");
    setStatus("all");
    setPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
      case "generated":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-green-100 text-green-700 rounded border border-green-200"><CheckCircle2 className="w-3.5 h-3.5" /> COMPLETADA</span>;
      case "processing":
      case "validated":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-yellow-100 text-yellow-700 rounded border border-yellow-200"><Loader2 className="w-3.5 h-3.5 animate-spin" /> EN PROCESO</span>;
      case "error":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-red-100 text-red-700 rounded border border-red-200"><XCircle className="w-3.5 h-3.5" /> CON ERRORES</span>;
      case "cancelled":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-slate-200 text-slate-700 rounded border border-slate-300"><Info className="w-3.5 h-3.5" /> CANCELADA</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-800 rounded border border-slate-200">{status.toUpperCase()}</span>;
    }
  };

  const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    return {
      date: d.toLocaleDateString("es-PE"),
      time: d.toLocaleTimeString("es-PE", { hour: '2-digit', minute: '2-digit' })
    };
  };

  const formatPeriod = (periodStr: string) => {
    if (!periodStr || periodStr.length !== 6) return periodStr;
    const year = periodStr.substring(0, 4);
    const month = parseInt(periodStr.substring(4, 6), 10);
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${months[month - 1] || month} ${year}`;
  };

  const handleDownload = (conversionId: number, fileId: number) => {
    window.location.href = `/api/conversions/${conversionId}/download/${fileId}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Historial de conversiones</h1>
          <p className="text-slate-500 mt-1">Consulta las conversiones realizadas en el sistema.</p>
        </div>
        <Link 
          to="/conversions/new"
          className="flex h-[42.4px] items-center justify-center gap-3 rounded-md bg-[#056ba6] px-6 font-semibold text-white hover:bg-[#045585] transition-colors"
        >
          <PlusCircle size={20} />
          Nueva conversión
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-700">
          <Filter className="w-4 h-4" />
          Filtros
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Periodo</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Ej. 202405" 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-1.5 lg:col-span-1">
            <label className="text-xs font-medium text-slate-600">Cliente</label>
            <select 
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">Seleccione un cliente...</option>
              {clientsData?.map((c) => (
                <option key={c.id} value={c.id}>{c.businessName}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Estado</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="generated">Completada</option>
              <option value="processing">En proceso</option>
              <option value="error">Con errores</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>

          <div className="pt-2 md:pt-0 flex items-center justify-end">
            <button 
              onClick={handleClearFilters}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
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
            <button onClick={() => loadData()} className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded text-sm hover:bg-blue-100">Reintentar</button>
          </div>
        )}

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="px-4 py-3 whitespace-nowrap">Fecha de conversión</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3 whitespace-nowrap">RUC</th>
                <th className="px-4 py-3 whitespace-nowrap">Periodo</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Registros<br/>Ventas</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Registros<br/>Compras</th>
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
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-base font-medium text-slate-800">{formatDateTime(item.createdAt).date}</span>
                      <br/>
                      <span className="text-sm font-normal text-slate-500">{formatDateTime(item.createdAt).time}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 max-w-[200px] truncate" title={item.clientName}>{item.clientName}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{item.clientRuc}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatPeriod(item.period)}</td>
                    <td className="px-4 py-3 text-center text-slate-700">{item.salesRecordsCount > 0 ? item.salesRecordsCount.toLocaleString() : "—"}</td>
                    <td className="px-4 py-3 text-center text-slate-700">{item.purchasesRecordsCount > 0 ? item.purchasesRecordsCount.toLocaleString() : "—"}</td>
                    <td className="px-4 py-3 text-center">{getStatusBadge(item.status)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        {item.files.sales ? (
                          <button 
                            onClick={() => handleDownload(item.id, item.files.sales!.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-black hover:text-blue-600 transition-colors"
                            title="Descargar archivo de ventas"
                          >
                            <FileSpreadsheet className="w-4 h-4 text-green-800" />
                            Ventas ({item.files.sales.sizeKb} KB)
                          </button>
                        ) : (
                          item.salesRecordsCount > 0 && <span className="text-xs text-slate-400">—</span>
                        )}
                        
                        {item.files.purchases ? (
                          <button 
                            onClick={() => handleDownload(item.id, item.files.purchases!.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-black hover:text-blue-600 transition-colors"
                            title="Descargar archivo de compras"
                          >
                            <FileSpreadsheet className="w-4 h-4 text-green-800" />
                            Compras ({item.files.purchases.sizeKb} KB)
                          </button>
                        ) : (
                          item.purchasesRecordsCount > 0 && <span className="text-xs text-slate-400">—</span>
                        )}
                        
                        {(!item.files.sales && !item.files.purchases && item.status !== "processing" && item.status !== "draft" && item.status !== "validated") && (
                           <span className="text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => {
                          const resultPayload = {
                            conversionId: item.id,
                            sales: item.files.sales ? {
                              fileId: item.files.sales.id,
                              fileName: `Ventas_${item.clientRuc}_${item.period}.xlsx`,
                              recordsCount: item.salesRecordsCount,
                              sizeBytes: item.files.sales.sizeKb * 1024
                            } : null,
                            purchases: item.files.purchases ? {
                              fileId: item.files.purchases.id,
                              fileName: `Compras_${item.clientRuc}_${item.period}.xlsx`,
                              recordsCount: item.purchasesRecordsCount,
                              sizeBytes: item.files.purchases.sizeKb * 1024
                            } : null
                          };
                          navigate(`/conversions/result/${item.id}`, { state: { result: resultPayload } });
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors tooltip-trigger"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {data && data.pagination.totalPages > 0 && (
          <div className="bg-white border-t border-slate-200">
            <Pagination
              currentPage={page}
              totalPages={data.pagination.totalPages}
              totalItems={data.pagination.total}
              pageSize={limit}
              onPageChange={setPage}
              onPageSizeChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
              itemName="conversiones"
            />
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-blue-800">
        <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
        <div>
          <h4 className="font-semibold mb-0.5">Información</h4>
          <p className="text-sm">Los archivos generados estarán disponibles para su descarga durante 30 días desde la fecha de conversión.</p>
        </div>
      </div>
    </div>
  );
}
