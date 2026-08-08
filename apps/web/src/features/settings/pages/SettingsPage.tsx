import { AlertCircle, Loader2 } from "lucide-react";

import type { SessionUser } from "../../shared/types";
import { SettingsForm } from "../components/SettingsForm";
import { useSettingsPage } from "../hooks/useSettingsPage";

export function SettingsPage({ user }: { user: SessionUser }) {
  const settingsPage = useSettingsPage({ isAdmin: user.role === "admin" });

  if (user.role !== "admin") {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">Acceso denegado. Se requiere rol de administrador.</p>
        </div>
      </div>
    );
  }

  if (settingsPage.isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#072d4a]">Configuracion General</h1>
        <p className="text-[#53698d] mt-2">Administra los parametros de conversion y datos por defecto del sistema.</p>
      </div>

      <SettingsForm settings={settingsPage.settings} isSaving={settingsPage.isSaving} onChange={settingsPage.changeSetting} onSave={() => void settingsPage.saveSettings()} />
    </div>
  );
}
