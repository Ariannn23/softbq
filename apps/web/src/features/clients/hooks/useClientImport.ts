import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { importFields, type ClientImportField, type ImportAnalysis, type ImportPreview, type ImportSummary } from "../../shared/types";
import { analyzeClientImport, confirmClientImport, previewClientImport } from "../services/clientsApi";

export function useClientImport(onClientsChanged: () => void) {
  const [analysis, setAnalysis] = useState<ImportAnalysis | null>(null);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [mapping, setMapping] = useState<Partial<Record<ClientImportField, string>>>({});
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const selectedSheetInfo = analysis?.sheets.find((sheet) => sheet.name === selectedSheet);
  const headers = selectedSheetInfo?.headers ?? [];
  const currentStep = summary ? 7 : preview ? 5 : selectedSheetInfo ? 4 : analysis ? 2 : 1;

  useEffect(() => {
    if (!analysis || !selectedSheet) {
      return;
    }

    const sheet = analysis.sheets.find((item) => item.name === selectedSheet);
    setPreview(null);
    setSummary(null);
    setMapping(sheet?.inferredMapping ?? {});
  }, [analysis, selectedSheet]);

  useEffect(() => {
    if (!analysis || !selectedSheet || headers.length === 0) {
      return;
    }

    const hasRequiredMapping = importFields
      .filter((field) => field.required)
      .every((field) => mapping[field.key]);

    if (!hasRequiredMapping) {
      setPreview(null);
      return;
    }

    const timeout = window.setTimeout(() => {
      void loadPreview();
    }, 250);

    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis?.importId, selectedSheet, JSON.stringify(mapping)]);

  async function handleFileChange(file: File | undefined) {
    if (!file) {
      return;
    }

    setBusy(true);
    setMessage(null);
    setSummary(null);
    setPreview(null);
    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const toastId = toast.loading("Analizando archivo...");

    try {
      const nextAnalysis = await analyzeClientImport(file);
      setAnalysis(nextAnalysis);
      setSelectedSheet(nextAnalysis.sheets[0]?.name ?? "");
      toast.success("Archivo analizado correctamente.", { id: toastId });
    } catch (error) {
      const err = error instanceof Error ? error.message : "No se pudo leer el archivo.";
      setMessage(err);
      toast.error(err, { id: toastId });
    } finally {
      setBusy(false);
    }
  }

  async function loadPreview() {
    if (!analysis || !selectedSheet) {
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      setPreview(await previewClientImport({
        importId: analysis.importId,
        mapping,
        sheetName: selectedSheet
      }));
    } catch (error) {
      const err = error instanceof Error ? error.message : "No se pudo generar la vista previa.";
      setMessage(err);
      toast.error(err);
    } finally {
      setBusy(false);
    }
  }

  async function confirmImport() {
    if (!analysis || !selectedSheet) {
      return;
    }

    setBusy(true);
    setMessage(null);
    const toastId = toast.loading("Confirmando importación...");

    try {
      setSummary(await confirmClientImport({
        importId: analysis.importId,
        mapping,
        sheetName: selectedSheet
      }));
      onClientsChanged();
      toast.success("Importación completada exitosamente.", { id: toastId });
    } catch (error) {
      const err = error instanceof Error ? error.message : "No se pudo confirmar la importacion.";
      setMessage(err);
      toast.error(err, { id: toastId });
    } finally {
      setBusy(false);
    }
  }

  return {
    analysis,
    busy,
    confirmImport,
    currentStep,
    fileName,
    fileSize,
    handleFileChange,
    headers,
    mapping,
    message,
    preview,
    selectedSheet,
    selectedSheetInfo,
    setMapping,
    setSelectedSheet,
    summary
  };
}
