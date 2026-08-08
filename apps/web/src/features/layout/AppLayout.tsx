import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

import type { SessionUser } from "../shared/types";
import { AppSidebar } from "./components/AppSidebar";
import { AppTopbar } from "./components/AppTopbar";

export function AppLayout({
  onLogout,
  user,
}: {
  onLogout: () => void;
  user: SessionUser;
}) {
  const [isCompact, setIsCompact] = useState(false);

  return (
    <main className="min-h-screen bg-[#f5faff] text-[#072d4a]">
      <Toaster position="top-right" />
      <AppSidebar isCompact={isCompact} user={user} onCompactChange={setIsCompact} onLogout={onLogout} />
      <section className={`transition-all duration-300 ease-in-out ${isCompact ? "lg:pl-[88px]" : "lg:pl-[270px]"}`}>
        <AppTopbar user={user} />
        <Outlet />
      </section>
    </main>
  );
}
