import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Pagination } from "../../shared/Pagination";
import {
  Users,
  Clock,
  ShoppingCart,
  ShoppingBag,
  FileText,
  Eye,
  CheckCircle2,
  CalendarDays,
  Loader2,
  AlertCircle,
  MoreVertical,
  Plus,
  Search,
  Filter,
  RefreshCcw,
  ArrowRightLeft,
} from "lucide-react";
import {
  getDashboardData,
  updateClientPeriodStatus,
  DashboardResponse,
  ClientPeriodStatus,
} from "../services/dashboardApi";

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

export function DashboardPage({ clientsVersion }: { clientsVersion?: number }) {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentDate.getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    currentDate.getFullYear(),
  );

  const period = `${selectedYear}${selectedMonth.toString().padStart(2, "0")}`;

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle clicking outside to close menu
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
      const res = await getDashboardData(period);
      setData(res);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [period, clientsVersion]);

  useEffect(() => {
    loadData();
    setPage(1); // Reset page on period change
  }, [loadData]);

  const handleStatusChange = async (
    clientId: number,
    newStatus: ClientPeriodStatus,
  ) => {
    setUpdatingId(clientId);
    const toastId = toast.loading("Actualizando estado...");
    try {
      await updateClientPeriodStatus(clientId, period, newStatus);
      await loadData();
      toast.success("Estado actualizado exitosamente", { id: toastId });
    } catch (error) {
      toast.error("Error al actualizar el estado", { id: toastId });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: ClientPeriodStatus) => {
    switch (status) {
      case "pendiente":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
            Pendiente
          </span>
        );
      case "ventas_cargadas":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
            Ventas cargadas
          </span>
        );
      case "compras_cargadas":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
            Compras cargadas
          </span>
        );
      case "generado":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-700">
            Generado
          </span>
        );
      case "revisado":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
            Revisado
          </span>
        );
      case "declarado":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-200">
            Declarado
          </span>
        );
      case "plame_declarado":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
            PLAME Declarado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const hasStatusOrHigher = (
    status: ClientPeriodStatus,
    required: string[],
  ) => {
    return required.includes(status);
  };

  const checkIcon = (active: boolean, colorClass: string) => {
    if (active)
      return <CheckCircle2 className={`w-5 h-5 mx-auto ${colorClass}`} />;
    return (
      <div className="w-4 h-4 mx-auto rounded-full border-2 border-slate-200"></div>
    );
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

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Panel Principal</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Resumen del estado de la cartera de clientes del perodo
            seleccionado.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          Perodo
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
            title="Limpiar filtros"
          >
            <RefreshCcw className="w-4 h-4" />
            Limpiar filtros
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>
            Ocurri un error al cargar los datos del dashboard. Por favor,
            intenta nuevamente.
          </p>
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <SummaryCard
              title="Clientes activos"
              subtitle="Total de clientes"
              value={data.summary.active}
              icon={<Users className="w-6 h-6 text-blue-500" />}
              iconBgColor="bg-blue-50"
            />
            <SummaryCard
              title="Pendientes"
              subtitle="Clientes pendientes"
              value={data.summary.pendiente}
              icon={<Clock className="w-6 h-6 text-orange-500" />}
              iconBgColor="bg-orange-50"
            />
            <SummaryCard
              title="Ventas procesadas"
              subtitle="Ventas cargadas"
              value={
                data.summary.ventasCargadas +
                data.summary.generado +
                data.summary.revisado +
                data.summary.declarado +
                data.summary.plameDeclarado
              }
              icon={<ShoppingCart className="w-6 h-6 text-green-500" />}
              iconBgColor="bg-green-50"
            />
            <SummaryCard
              title="Compras procesadas"
              subtitle="Compras cargadas"
              value={
                data.summary.comprasCargadas +
                data.summary.generado +
                data.summary.revisado +
                data.summary.declarado +
                data.summary.plameDeclarado
              }
              icon={<ShoppingBag className="w-6 h-6 text-purple-500" />}
              iconBgColor="bg-purple-50"
            />
            <SummaryCard
              title="Archivos generados"
              subtitle="Archivos generados"
              value={
                data.summary.generado +
                data.summary.revisado +
                data.summary.declarado +
                data.summary.plameDeclarado
              }
              icon={<FileText className="w-6 h-6 text-teal-500" />}
              iconBgColor="bg-teal-50"
            />
            <SummaryCard
              title="Clientes revisados"
              subtitle="Clientes revisados"
              value={
                data.summary.revisado +
                data.summary.declarado +
                data.summary.plameDeclarado
              }
              icon={<Eye className="w-6 h-6 text-blue-500" />}
              iconBgColor="bg-blue-50"
            />
            <SummaryCard
              title="Clientes declarados"
              subtitle="Clientes declarados"
              value={data.summary.declarado + data.summary.plameDeclarado}
              icon={<CheckCircle2 className="w-6 h-6 text-green-500" />}
              iconBgColor="bg-green-50"
            />
            <SummaryCard
              title="PLAME Declarado"
              subtitle="Planilla declarada"
              value={data.summary.plameDeclarado}
              icon={<CheckCircle2 className="w-6 h-6 text-indigo-500" />}
              iconBgColor="bg-indigo-50"
            />
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="font-semibold text-slate-800 text-lg">
                Estado de clientes del perodo
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
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-white text-slate-600 text-xs font-semibold border-b border-slate-200">
                    <th className="px-4 py-3 text-left">Cliente</th>
                    <th className="px-4 py-3 text-left">RUC</th>
                    <th className="px-4 py-3 text-center">Ventas</th>
                    <th className="px-4 py-3 text-center">Compras</th>
                    <th className="px-4 py-3 text-center">Archivo generado</th>
                    <th className="px-4 py-3 text-center">Revisado</th>
                    <th className="px-4 py-3 text-center">Declarado</th>
                    <th className="px-4 py-3 text-center">PLAME</th>
                    <th className="px-4 py-3 text-center">Estado</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {paginatedClients.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        No se encontraron clientes activos.
                      </td>
                    </tr>
                  ) : (
                    paginatedClients.map((client) => {
                      const hasVentas = hasStatusOrHigher(client.status, [
                        "ventas_cargadas",
                        "generado",
                        "revisado",
                        "declarado",
                        "plame_declarado",
                      ]);
                      const hasCompras = hasStatusOrHigher(client.status, [
                        "compras_cargadas",
                        "generado",
                        "revisado",
                        "declarado",
                        "plame_declarado",
                      ]);
                      const hasGenerado = hasStatusOrHigher(client.status, [
                        "generado",
                        "revisado",
                        "declarado",
                        "plame_declarado",
                      ]);
                      const hasRevisado = hasStatusOrHigher(client.status, [
                        "revisado",
                        "declarado",
                        "plame_declarado",
                      ]);
                      const hasDeclarado = hasStatusOrHigher(client.status, [
                        "declarado",
                        "plame_declarado",
                      ]);
                      const hasPlameStatus =
                        client.status === "plame_declarado";

                      return (
                        <tr
                          key={client.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {client.businessName}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {client.ruc}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {checkIcon(hasVentas, "text-green-500")}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {checkIcon(hasCompras, "text-green-500")}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {checkIcon(hasGenerado, "text-green-500")}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {checkIcon(hasRevisado, "text-green-500")}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {checkIcon(hasDeclarado, "text-green-500")}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {client.hasPlame ? (
                              checkIcon(hasPlameStatus, "text-indigo-500")
                            ) : (
                              <div className="text-slate-300 text-xs font-semibold mx-auto">
                                N/A
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {getStatusBadge(client.status)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {updatingId === client.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                              ) : (
                                <>
                                  <div className="relative">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(
                                          openMenuId === client.id
                                            ? null
                                            : client.id,
                                        );
                                      }}
                                      className="p-1.5 text-slate-500 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
                                      title="Cambiar estado"
                                    >
                                      <ArrowRightLeft className="w-4 h-4" />
                                    </button>
                                    {openMenuId === client.id && (
                                      <div
                                        className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-md shadow-xl py-1 z-10"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-100 mb-1">
                                          Cambiar estado
                                        </div>
                                        <button
                                          onClick={() => {
                                            handleStatusChange(
                                              client.id,
                                              "pendiente",
                                            );
                                            setOpenMenuId(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 text-slate-700"
                                        >
                                          Pendiente
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleStatusChange(
                                              client.id,
                                              "generado",
                                            );
                                            setOpenMenuId(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 text-slate-700"
                                        >
                                          Generado
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleStatusChange(
                                              client.id,
                                              "revisado",
                                            );
                                            setOpenMenuId(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 text-slate-700"
                                        >
                                          Revisado
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleStatusChange(
                                              client.id,
                                              "declarado",
                                            );
                                            setOpenMenuId(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 text-slate-700"
                                        >
                                          Declarado
                                        </button>
                                        {client.hasPlame && (
                                          <button
                                            onClick={() => {
                                              handleStatusChange(
                                                client.id,
                                                "plame_declarado",
                                              );
                                              setOpenMenuId(null);
                                            }}
                                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 text-slate-700"
                                          >
                                            PLAME Declarado
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
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
        </>
      ) : null}
    </div>
  );
}

function SummaryCard({
  title,
  subtitle,
  value,
  icon,
  iconBgColor,
}: {
  title: string;
  subtitle: string;
  value: number;
  icon: React.ReactNode;
  iconBgColor: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${iconBgColor}`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-800">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
