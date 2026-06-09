import * as settingsRepository from "./settings.repository.js";

export async function getSettings() {
  return settingsRepository.getAllSettings();
}

export async function getSettingsList() {
  return settingsRepository.getSettingsAsList();
}

export async function updateSettings(newSettings: Record<string, string>) {
  if (!newSettings || typeof newSettings !== 'object') {
    throw new Error("Formato de configuraciones inválido.");
  }
  
  await settingsRepository.updateSettings(newSettings);
  return settingsRepository.getAllSettings();
}
