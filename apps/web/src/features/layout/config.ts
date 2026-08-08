import { CircleDollarSign, FileCheck, FileSpreadsheet, Home, Settings, User, Users } from "lucide-react";

import type { SessionUser } from "../shared/types";

export function getNavItems(role: SessionUser["role"]) {
  if (role === "assistant") {
    return [
      { path: "/clients", label: "Clientes", icon: Users, enabled: true },
      { path: "/billing", label: "Cobranzas", icon: CircleDollarSign, enabled: true },
    ];
  }

  const items = [
    { path: "/dashboard", label: "Panel Principal", icon: Home, enabled: true },
    { path: "/obligations", label: "Obligaciones", icon: FileCheck, enabled: true },
    { path: "/conversions", label: "Conversiones", icon: FileSpreadsheet, enabled: true },
    { path: "/clients", label: "Clientes", icon: Users, enabled: true },
    { path: "/billing", label: "Cobranzas", icon: CircleDollarSign, enabled: true },
  ];

  if (role === "admin") {
    items.push(
      { path: "/settings", label: "Configuracion", icon: Settings, enabled: true },
      { path: "/usuarios", label: "Usuarios", icon: User, enabled: false },
    );
  }

  return items;
}

export function getRoleLabel(role: SessionUser["role"]) {
  if (role === "admin") return "Administrador";
  if (role === "assistant") return "Asistente";
  return "Contador principal";
}
