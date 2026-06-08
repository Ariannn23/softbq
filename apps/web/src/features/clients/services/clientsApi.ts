import type { Client, ClientValues, ClientImportField, ImportAnalysis, ImportPreview, ImportSummary } from "../../shared/types";

export async function fetchClients(search = ""): Promise<Client[]> {
  const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
  const response = await fetch(`/api/clients${query}`, { credentials: "include" });

  if (!response.ok) {
    throw new Error("No se pudo cargar clientes.");
  }

  const data = (await response.json()) as { clients: Client[] };
  return data.clients;
}

export async function saveClient(input: {
  clientId?: number;
  values: ClientValues;
}): Promise<Client> {
  const response = await fetch(input.clientId ? `/api/clients/${input.clientId}` : "/api/clients", {
    method: input.clientId ? "PUT" : "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input.values)
  });

  if (!response.ok) {
    const data = (await response.json()) as { message?: string };
    throw new Error(data.message ?? "No se pudo guardar el cliente.");
  }

  const data = (await response.json()) as { client: Client };
  return data.client;
}

export async function updateClientStatus(input: {
  action: "disable" | "enable";
  clientId: number;
}): Promise<Client> {
  const response = await fetch(`/api/clients/${input.clientId}/${input.action}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: "{}"
  });

  if (!response.ok) {
    const data = (await response.json()) as { message?: string };
    throw new Error(data.message ?? "No se pudo actualizar el estado del cliente.");
  }

  const data = (await response.json()) as { client: Client };
  return data.client;
}

export async function analyzeClientImport(file: File): Promise<ImportAnalysis> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/clients/import/analyze", {
    method: "POST",
    credentials: "include",
    body: formData
  });

  if (!response.ok) {
    const data = (await response.json()) as { message?: string };
    throw new Error(data.message ?? "No se pudo leer el archivo.");
  }

  const data = (await response.json()) as { import: ImportAnalysis };
  return data.import;
}

export async function previewClientImport(input: {
  importId: string;
  mapping: Partial<Record<ClientImportField, string>>;
  sheetName: string;
}): Promise<ImportPreview> {
  const response = await fetch(`/api/clients/import/${input.importId}/preview`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mapping: input.mapping,
      sheetName: input.sheetName
    })
  });

  if (!response.ok) {
    const data = (await response.json()) as { message?: string };
    throw new Error(data.message ?? "No se pudo generar la vista previa.");
  }

  const data = (await response.json()) as { preview: ImportPreview };
  return data.preview;
}

export async function confirmClientImport(input: {
  importId: string;
  mapping: Partial<Record<ClientImportField, string>>;
  sheetName: string;
}): Promise<ImportSummary> {
  const response = await fetch(`/api/clients/import/${input.importId}/confirm`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mapping: input.mapping,
      sheetName: input.sheetName
    })
  });

  if (!response.ok) {
    const data = (await response.json()) as { message?: string };
    throw new Error(data.message ?? "No se pudo confirmar la importacion.");
  }

  const data = (await response.json()) as { summary: ImportSummary };
  return data.summary;
}
