import { FormEvent, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, X, AlertCircle } from "lucide-react";

import { fetchClients } from "../../clients/services/clientsApi";
import type { Client } from "../../shared/types";
import { validateConversions, ValidationResponse } from "../services/conversionsApi";

export function NewConversionPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const now = useMemo(() => new Date(), []);
  const years = useMemo(() => Array.from({ length: 10 }, (_, i) => String(now.getFullYear() - i)), [now]);
  const months = useMemo(() => [
    { value: "01", label: "Enero" }, { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" }, { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" }, { value: "06", label: "Junio" },
    { value: "07", label: "Julio" }, { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" }, { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" }, { value: "12", label: "Diciembre" }
  ], []);

  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  const [salesFile, setSalesFile] = useState<File | null>(null);
  const [purchasesFile, setPurchasesFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients().then((data) => {
      const activeClients = data.filter((c) => c.active);
      setClients(activeClients);
      const firstClient = activeClients[0];
      if (firstClient) {
        setClientId(firstClient.id.toString());
      }
    });
  }, []);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>, type: "sales" | "purchases") => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith(".txt") || file.name.endsWith(".csv"))) {
      if (type === "sales") setSalesFile(file);
      else setPurchasesFile(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clientId) {
      setError("Debe seleccionar un cliente.");
      return;
    }

    const period = `${selectedYear}${selectedMonth}`;

    if (!period || !/^\d{6}$/.test(period)) {
      setError("El periodo debe tener el formato YYYYMM.");
      return;
    }

    if (!salesFile && !purchasesFile) {
      setError("Debe cargar al menos un archivo (Ventas o Compras) para continuar.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await validateConversions({
        clientId,
        period,
        salesFile: salesFile || undefined,
        purchasesFile: purchasesFile || undefined,
      });

      // Navigate to preview page with the validation data
      navigate("/conversiones/preview", { state: { validation: response } });
    } catch (err: any) {
      setError(err.message || "Error validando los archivos.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Nueva conversión</h1>
        <p className="text-slate-500 mt-1">Carga los archivos SIRE y prepara la conversión a Contasis.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">1. Cliente</label>
              <select
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.ruc} - {c.businessName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">2. Periodo</label>
              <div className="flex gap-2">
                <select
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileDropzone
              label="3. Archivo SIRE - Ventas (opcional)"
              description="Puede cargar solo ventas, solo compras o ambos archivos."
              file={salesFile}
              onDrop={(e) => handleFileDrop(e, "sales")}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setSalesFile(file);
              }}
              onRemove={() => setSalesFile(null)}
              iconColor="text-green-600"
            />
            <FileDropzone
              label="4. Archivo SIRE - Compras (opcional)"
              description="Puede cargar solo ventas, solo compras o ambos archivos."
              file={purchasesFile}
              onDrop={(e) => handleFileDrop(e, "purchases")}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPurchasesFile(file);
              }}
              onRemove={() => setPurchasesFile(null)}
              iconColor="text-purple-600"
            />
          </div>

          <div className="bg-blue-50 text-blue-800 p-4 rounded-md flex gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">Regla de carga</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Al menos un archivo debe estar cargado para continuar.</li>
                <li>Los archivos deben corresponder al mismo cliente y periodo seleccionado.</li>
              </ul>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || (!salesFile && !purchasesFile)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? "Validando..." : "Validar archivos"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FileDropzone({
  label,
  description,
  file,
  onDrop,
  onChange,
  onRemove,
  iconColor,
}: {
  label: string;
  description: string;
  file: File | null;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  iconColor: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <p className="text-xs text-slate-500 mb-3">{description}</p>
      
      <div
        className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <UploadCloud className={`w-10 h-10 mb-3 \${iconColor}`} />
        {file ? (
          <div className="flex items-center gap-2 text-sm bg-white border border-slate-200 py-2 px-3 rounded shadow-sm">
            <span className="font-medium truncate max-w-[200px]">{file.name}</span>
            <span className="text-slate-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            <button
              type="button"
              onClick={onRemove}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-700 mb-2 font-medium">Arrastra y suelta el archivo aquí</p>
            <p className="text-xs text-slate-500 mb-3">o</p>
            <label className="cursor-pointer text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded border border-blue-100 hover:bg-blue-100 transition-colors">
              Seleccionar archivo
              <input type="file" className="hidden" accept=".txt,.csv" onChange={onChange} />
            </label>
          </>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">i</div>
        <span>Formatos permitidos: .txt, .csv. Tamaño máximo: 50 MB</span>
      </div>
    </div>
  );
}
