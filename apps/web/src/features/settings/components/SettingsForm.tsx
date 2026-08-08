import { Loader2, Save } from "lucide-react";

import { SETTINGS_FIELDS } from "../config";

export function SettingsForm({
  settings,
  isSaving,
  onChange,
  onSave,
}: {
  settings: Record<string, string>;
  isSaving: boolean;
  onChange: (key: string, value: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <h2 className="font-semibold text-slate-800">Parametros Base</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SETTINGS_FIELDS.map((field) => (
            <SettingInput
              key={field.key}
              label={field.label}
              type={field.type}
              value={settings[field.key] || field.fallback}
              placeholder={field.placeholder}
              helper={field.helper}
              onChange={(value) => onChange(field.key, value)}
            />
          ))}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
        <button onClick={onSave} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-70">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}

function SettingInput({
  label,
  type,
  value,
  placeholder,
  helper,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  placeholder: string;
  helper?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder={placeholder} />
      {helper ? <p className="text-xs text-slate-500 mt-1">{helper}</p> : null}
    </div>
  );
}
