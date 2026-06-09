async function fetchApi(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    }
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Ocurrió un error al procesar la solicitud.");
  }

  return data;
}

export async function getSettings(): Promise<Record<string, string>> {
  return fetchApi("/api/settings");
}

export async function getSettingsList(): Promise<Array<{ id: number; key: string; value: string; description: string | null }>> {
  return fetchApi("/api/settings/list");
}

export async function updateSettings(settings: Record<string, string>): Promise<{ message: string; settings: Record<string, string> }> {
  return fetchApi("/api/settings", {
    method: "PUT",
    body: JSON.stringify(settings)
  });
}
