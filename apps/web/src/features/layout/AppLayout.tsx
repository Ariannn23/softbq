import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { BarChart3, ChevronLeft, ChevronRight, CircleDollarSign, FileSpreadsheet, Files, Home, Laptop, LogOut, Settings, User, Users, FileCheck } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import type { SessionUser } from "../shared/types";
import { BrandMark } from "../shared/ui";

const getNavItems = (role: string) => {
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
      { path: "/settings", label: "Configuración", icon: Settings, enabled: true },
      { path: "/usuarios", label: "Usuarios", icon: User, enabled: false }
    );
  }

  return items;
};

export function AppLayout({
  onLogout,
  user
}: {
  onLogout: () => void;
  user: SessionUser;
}) {
  const location = useLocation();
  const [isCompact, setIsCompact] = useState(false);

  return (
    <main className="min-h-screen bg-[#f5faff] text-[#072d4a]">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 hidden bg-gradient-to-br from-[#0aa0ed] via-[#056ba6] to-[#072d4a] text-white lg:flex lg:flex-col transition-all duration-300 ease-in-out z-20 ${isCompact ? "w-[88px]" : "w-[270px]"}`}
      >
        <button 
          onClick={() => setIsCompact(!isCompact)}
          className="absolute -right-4 top-[17px] flex h-8 w-8 items-center justify-center rounded-full border border-[#d8e8f6] bg-white text-[#056ba6] shadow-sm hover:bg-slate-50 transition-colors z-30"
          type="button"
          title={isCompact ? "Expandir panel" : "Contraer panel"}
        >
          {isCompact ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        <div className={`px-7 py-8 transition-all duration-300 ${isCompact ? "flex justify-center px-0" : "flex flex-col"}`}>
          <BrandMark size="md" iconOnly={isCompact} />
          {!isCompact && (
            <p className="ml-[64px] mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#063b5f] whitespace-nowrap overflow-hidden">
              Software Contable
            </p>
          )}
        </div>

        <nav className="mt-4 flex-1 space-y-2 px-4 overflow-hidden">
          {getNavItems(user.role).map((item) => {
            const Icon = item.icon;

            if (!item.enabled) {
              return (
                <button className={`flex h-12 items-center rounded-md text-left text-sm font-medium text-white/90 opacity-60 transition-all ${isCompact ? "w-12 justify-center px-0 mx-auto" : "w-full gap-4 px-4"}`} disabled key={item.path} type="button" title={isCompact ? item.label : undefined}>
                  <Icon size={24} className="shrink-0" />
                  {!isCompact && <span className="whitespace-nowrap">{item.label}</span>}
                </button>
              );
            }

            return (
              <NavLink
                className={({ isActive }) => `flex h-12 items-center rounded-md text-left text-sm font-medium transition-all ${isCompact ? "w-12 justify-center px-0 mx-auto" : "w-full gap-4 px-4"} ${
                  isActive || (item.path === "/clients" && location.pathname === "/clients/import") || (item.path === "/conversions" && location.pathname.startsWith("/conversions"))
                    ? "bg-[#0b8ff0] shadow-lg"
                    : "text-white/90 hover:bg-white/10"
                }`}
                key={item.path}
                to={item.path}
                title={isCompact ? item.label : undefined}
              >
                <Icon size={24} className="shrink-0" />
                {!isCompact && <span className="whitespace-nowrap">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className={`border-t border-white/20 py-6 transition-all ${isCompact ? "px-0 flex justify-center" : "px-5"}`}>
          <div className="flex flex-col gap-4 w-full">
            <button onClick={onLogout} className={`flex items-center text-white/90 hover:bg-white/10 hover:text-white rounded-lg transition-colors ${isCompact ? "justify-center w-12 h-12 mx-auto" : "gap-3 w-full p-2"}`} title="Cerrar sesión">
              <LogOut size={26} className="shrink-0" />
              {!isCompact && <span className="font-medium whitespace-nowrap">Cerrar sesión</span>}
            </button>
            {!isCompact && (
              <div className="text-center text-xs text-white/50 font-medium tracking-wide">
                Última versión v0.1.8
              </div>
            )}
          </div>
        </div>
      </aside>

      <section className={`transition-all duration-300 ease-in-out ${isCompact ? "lg:pl-[88px]" : "lg:pl-[270px]"}`}>
        <header className="sticky top-0 z-10 flex h-[66px] items-center justify-end border-b border-[#d8e8f6] bg-white/95 px-6 backdrop-blur">
          <div className="flex items-center gap-5 text-sm">
            <div className="flex items-center gap-2"><Laptop size={24} /><span className="h-2 w-2 rounded-full bg-emerald-500" />EN LÍNEA</div>
            <div className="h-7 w-px bg-[#d8e8f6]" />
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dff1ff] text-[#056ba6]"><User size={20} /></div>
              <span className="font-semibold">{user.role === "admin" ? "Administrador" : user.role === "assistant" ? "Asistente" : "Contador principal"}</span>
            </div>
          </div>
        </header>

        <Outlet />
      </section>
    </main>
  );
}
