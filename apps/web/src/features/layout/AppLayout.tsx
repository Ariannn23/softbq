import { BarChart3, ChevronDown, FileSpreadsheet, Files, HelpCircle, Home, Laptop, LogOut, Menu, Settings, User, Users } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import type { SessionUser } from "../shared/types";
import { BrandMark } from "../shared/ui";

const navItems = [
  { path: "/dashboard", label: "Panel Principal", icon: Home, enabled: true },
  { path: "/conversiones", label: "Conversiones", icon: FileSpreadsheet, enabled: true },
  { path: "/clientes", label: "Clientes", icon: Users, enabled: true },
  { path: "/archivos-generados", label: "Archivos Generados", icon: Files, enabled: false },
  { path: "/reportes", label: "Reportes", icon: BarChart3, enabled: false },
  { path: "/configuracion", label: "Configuracion", icon: Settings, enabled: false },
  { path: "/usuarios", label: "Usuarios", icon: User, enabled: false },
  { path: "/logs", label: "Logs del Sistema", icon: FileSpreadsheet, enabled: false }
];

export function AppLayout({
  onLogout,
  user
}: {
  onLogout: () => void;
  user: SessionUser;
}) {
  const location = useLocation();

  return (
    <main className="min-h-screen bg-[#f5faff] text-[#072d4a]">
      <aside className="fixed inset-y-0 left-0 hidden w-[270px] bg-gradient-to-b from-[#0aa0ed] via-[#055687] to-[#072d4a] text-white lg:flex lg:flex-col">
        <div className="px-7 py-8">
          <BrandMark size="md" />
          <p className="ml-[58px] mt-1 text-sm leading-5 text-white/90">Conversion contable<br />TXT a Excel</p>
        </div>

        <nav className="mt-4 flex-1 space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (!item.enabled) {
              return (
                <button className="flex h-12 w-full items-center gap-4 rounded-md px-4 text-left text-sm font-medium text-white/90 opacity-60" disabled key={item.path} type="button">
                  <Icon size={24} />
                  {item.label}
                </button>
              );
            }

            return (
              <NavLink
                className={({ isActive }) => `flex h-12 w-full items-center gap-4 rounded-md px-4 text-left text-sm font-medium transition ${
                  isActive || (item.path === "/clientes" && location.pathname === "/importar-clientes") || (item.path === "/conversiones/nueva" && location.pathname.startsWith("/conversiones"))
                    ? "bg-[#0b8ff0] shadow-lg"
                    : "text-white/90 hover:bg-white/10"
                }`}
                key={item.path}
                to={item.path}
              >
                <Icon size={24} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/20 px-7 py-6">
          <div className="flex items-center gap-3 text-white/90"><HelpCircle size={26} />Ayuda</div>
          <p className="mt-8 text-sm leading-6 text-white/85">Version 1.0.0<br />Aplicacion local</p>
        </div>
      </aside>

      <section className="lg:pl-[270px]">
        <header className="sticky top-0 z-10 flex h-[66px] items-center justify-between border-b border-[#d8e8f6] bg-white/95 px-6 backdrop-blur">
          <button className="flex h-10 w-10 items-center justify-center rounded-md text-[#072d4a]" type="button"><Menu size={26} /></button>
          <div className="flex items-center gap-5 text-sm">
            <div className="flex items-center gap-2"><Laptop size={24} /><span className="h-2 w-2 rounded-full bg-emerald-500" />LOCAL</div>
            <div className="h-7 w-px bg-[#d8e8f6]" />
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dff1ff] text-[#007fcb]"><User size={20} /></div>
              <span className="font-semibold">{user.role === "admin" ? "Administrador" : "Contador principal"}</span>
              <ChevronDown size={18} />
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-md border border-[#d8e8f6] text-[#055687]" onClick={onLogout} title="Cerrar sesion" type="button"><LogOut size={18} /></button>
          </div>
        </header>

        <Outlet />
      </section>
    </main>
  );
}
