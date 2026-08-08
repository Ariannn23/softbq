import { CheckCircle2, Clock, Eye, FileText, ShoppingBag, ShoppingCart, Users } from "lucide-react";

import type { ClientPeriodStatus, DashboardSummary } from "./services/dashboardApi";

export const DASHBOARD_MONTHS = [
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

export const STATUS_OPTIONS: Array<{ value: ClientPeriodStatus; label: string }> = [
  { value: "pendiente", label: "Pendiente" },
  { value: "generado", label: "Generado" },
  { value: "revisado", label: "Revisado" },
  { value: "declarado", label: "Declarado" },
];

export function hasStatusOrHigher(status: ClientPeriodStatus, required: ClientPeriodStatus[]) {
  return required.includes(status);
}

export function getDashboardCards(summary: DashboardSummary) {
  return [
    {
      title: "Clientes activos",
      subtitle: "Total de clientes",
      value: summary.active,
      icon: <Users className="w-6 h-6 text-blue-500" />,
      iconBgColor: "bg-blue-50",
    },
    {
      title: "Pendientes",
      subtitle: "Clientes pendientes",
      value: summary.pendiente,
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      iconBgColor: "bg-orange-50",
    },
    {
      title: "Ventas procesadas",
      subtitle: "Ventas cargadas",
      value: summary.ventasCargadas + summary.generado + summary.revisado + summary.declarado,
      icon: <ShoppingCart className="w-6 h-6 text-green-500" />,
      iconBgColor: "bg-green-50",
    },
    {
      title: "Compras procesadas",
      subtitle: "Compras cargadas",
      value: summary.comprasCargadas + summary.generado + summary.revisado + summary.declarado,
      icon: <ShoppingBag className="w-6 h-6 text-purple-500" />,
      iconBgColor: "bg-purple-50",
    },
    {
      title: "Archivos generados",
      subtitle: "Archivos generados",
      value: summary.generado + summary.revisado + summary.declarado,
      icon: <FileText className="w-6 h-6 text-teal-500" />,
      iconBgColor: "bg-teal-50",
    },
    {
      title: "Clientes revisados",
      subtitle: "Clientes revisados",
      value: summary.revisado + summary.declarado,
      icon: <Eye className="w-6 h-6 text-blue-500" />,
      iconBgColor: "bg-blue-50",
    },
    {
      title: "Clientes declarados",
      subtitle: "Clientes declarados",
      value: summary.declarado,
      icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
      iconBgColor: "bg-green-50",
    },
  ];
}
