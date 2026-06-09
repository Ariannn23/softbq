import { useEffect, useState } from "react";
import { Save, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { getSettings, updateSettings } from "../services/settingsApi";
import type { SessionUser } from "../../shared/types";

export function SettingsPage({ user }: { user: SessionUser }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      if (user.role !== "admin") {
        setIsLoading(false);
        return;
      }
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err: any) {
        toast.error(err.message || "Error al cargar la configuración");
      } finally {
        setIsLoading(false);
      }
    }
    void fetchSettings();
  }, [user.role]);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Guardando configuración...");
    try {
      await updateSettings(settings);
      toast.success("Configuraciones guardadas exitosamente.", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Error al guardar la configuración", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#072d4a]">Configuración General</h1>
        <p className="text-[#53698d] mt-2">Administra los parámetros de conversión y datos por defecto del sistema.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="font-semibold text-slate-800">Parámetros Base</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Moneda PEN (Soles)
              </label>
              <input
                type="text"
                value={settings["moneda_pen"] || "S"}
                onChange={(e) => handleChange("moneda_pen", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="S"
              />
              <p className="text-xs text-slate-500 mt-1">Mapeo Contasis para Soles</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Moneda USD (Dólares)
              </label>
              <input
                type="text"
                value={settings["moneda_usd"] || "D"}
                onChange={(e) => handleChange("moneda_usd", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="D"
              />
              <p className="text-xs text-slate-500 mt-1">Mapeo Contasis para Dólares</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Condición por defecto
              </label>
              <input
                type="text"
                value={settings["condicion_defecto"] || "CON"}
                onChange={(e) => handleChange("condicion_defecto", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="CON"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Medio de pago por defecto
              </label>
              <input
                type="text"
                value={settings["medio_pago_defecto"] || "008"}
                onChange={(e) => handleChange("medio_pago_defecto", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="008"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                IGV (%)
              </label>
              <input
                type="number"
                value={settings["igv_porcentaje"] || "18"}
                onChange={(e) => handleChange("igv_porcentaje", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="18"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
