import { Laptop, User } from "lucide-react";

import type { SessionUser } from "../../shared/types";
import { getRoleLabel } from "../config";

export function AppTopbar({ user }: { user: SessionUser }) {
  return (
    <header className="sticky top-0 z-10 flex h-[66px] items-center justify-end border-b border-[#d8e8f6] bg-white/95 px-6 backdrop-blur">
      <div className="flex items-center gap-5 text-sm">
        <div className="flex items-center gap-2">
          <Laptop size={24} />
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          EN LINEA
        </div>
        <div className="h-7 w-px bg-[#d8e8f6]" />
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dff1ff] text-[#056ba6]">
            <User size={20} />
          </div>
          <span className="font-semibold">{getRoleLabel(user.role)}</span>
        </div>
      </div>
    </header>
  );
}
