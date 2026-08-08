import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { getSettings, updateSettings } from "../services/settingsApi";

export function useSettingsPage({ isAdmin }: { isAdmin: boolean }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      if (!isAdmin) {
        setIsLoading(false);
        return;
      }

      try {
        setSettings(await getSettings());
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error al cargar la configuracion");
      } finally {
        setIsLoading(false);
      }
    }

    void fetchSettings();
  }, [isAdmin]);

  const changeSetting = (key: string, value: string) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Guardando configuracion...");
    try {
      await updateSettings(settings);
      toast.success("Configuraciones guardadas exitosamente.", { id: toastId });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar la configuracion", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return { settings, isLoading, isSaving, changeSetting, saveSettings };
}
