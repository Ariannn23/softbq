import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { 
  CalendarDays, 
  Loader2, 
  AlertCircle,
  Search,
  RefreshCcw,
  FileCheck
} from "lucide-react";
import {
  getObligationsData,
  updateObligationStatus,
  ObligationClient,
  ObligationsResponse
} from "../services/obligationsApi";
import { Pagination } from "../../shared/Pagination";

const MONTHS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

export function ObligationsPage() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  
  const period = `${selectedYear}${selectedMonth.toString().padStart(2, "0")}`;

  const [data, setData] = useState<ObligationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }).map((_, i) => currentYear - i);
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await getObligationsData(period);
      setData(res);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadData();
    setPage(1);
  }, [loadData]);

  const handleToggle = async (clientId: number, field: keyof ObligationClient, currentValue: boolean) => {
    const updateKey = `${clientId}-${field}`;
    
    // Optimistic update
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        clients: prev.clients.map(c => 
          c.id === clientId ? { ...c, [field]: !currentValue } : c
        )
      };
    });

    setUpdatingIds(prev => new Set(prev).add(updateKey));

    try {
      await updateObligationStatus(clientId, period, field, !currentValue);
    } catch (error) {
      toast.error("Error al guardar estado");
      // Revert on error
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          clients: prev.clients.map(c => 
            c.id === clientId ? { ...c, [field]: currentValue } : c
          )
        };
      });
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(updateKey);
        return newSet;
      });
    }
  };

  const filteredClients = useMemo(() => {
    if (!data) return [];
    return data.clients.filter(
      (c) =>
        c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ruc.includes(searchTerm),
    );
  }, [data, searchTerm]);

  const paginatedClients = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredClients.slice(start, start + limit);
  }, [filteredClients, page, limit]);

  const renderCheckbox = (client: ObligationClient, requiredField: keyof ObligationClient, declaredField: keyof ObligationClient) => {
    const isRequired = client[requiredField] as boolean;
    const isDeclared = client[declaredField] as boolean;
    const isUpdating = updatingIds.has(`${client.id}-${declaredField}`);

    if (!isRequired) {
      return <div className="text-slate-300 text-xs font-semibold">N/A</div>;
    }

    if (isUpdating) {
      return <Loader2 className="w-5 h-5 text-blue-500 animate-spin mx-auto" />;
    }

    return (
      <input
        type="checkbox"
        className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
        checked={isDeclared}
        onChange={() => handleToggle(client.id, declaredField, isDeclared)}
      />
    );
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileCheck className="w-7 h-7 text-blue-600" />
            Obligaciones Adicionales
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Control mensual de declaraciones juradas, planillas y obligaciones secundarias.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          Período
        </label>
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              const d = new Date();
              setSelectedMonth(d.getMonth() + 1);
              setSelectedYear(d.getFullYear());
            }}
            className="flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
            title="Mes actual"
          >
            <RefreshCcw className="w-4 h-4" />
            Mes actual
          </button>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>Ocurrió un error al cargar las obligaciones. Por favor, intenta nuevamente.</p>
        </div>
      ) : data ? (
        <div className={`space-y-6 transition-opacity duration-200 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="font-semibold text-slate-800 text-lg">
                Estado de obligaciones del periodo
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-white text-slate-600 text-xs font-semibold border-b border-slate-200">
                    <th className="px-4 py-3 text-left">Cliente</th>
                    <th className="px-4 py-3 text-left">RUC</th>
                    <th className="px-4 py-3 text-center">PLAME</th>
                    <th className="px-4 py-3 text-center">AFPNET</th>
                    <th className="px-4 py-3 text-center">ITAN</th>
                    <th className="px-4 py-3 text-center">DAOT</th>
                    <th className="px-4 py-3 text-center">PDT 710</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {paginatedClients.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        No se encontraron clientes activos.
                      </td>
                    </tr>
                  ) : (
                    paginatedClients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {client.businessName}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {client.ruc}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {renderCheckbox(client, "hasPlame", "plameDeclared")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {renderCheckbox(client, "hasAfpnet", "afpnetDeclared")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {renderCheckbox(client, "hasItan", "itanDeclared")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {renderCheckbox(client, "hasDaot", "daotDeclared")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {renderCheckbox(client, "hasPdt710", "pdt710Declared")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-white border-t border-slate-200">
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(filteredClients.length / limit) || 1}
                totalItems={filteredClients.length}
                pageSize={limit}
                onPageChange={setPage}
                onPageSizeChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
                itemName="clientes"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
