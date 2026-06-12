export interface ObligationClient {
  id: number;
  ruc: string;
  businessName: string;
  hasPlame: boolean;
  hasAfpnet: boolean;
  hasItan: boolean;
  hasDaot: boolean;
  hasPdt710: boolean;
  plameDeclared: boolean;
  afpnetDeclared: boolean;
  itanDeclared: boolean;
  daotDeclared: boolean;
  pdt710Declared: boolean;
}

export interface ObligationsResponse {
  clients: ObligationClient[];
}

export async function getObligationsData(period: string): Promise<ObligationsResponse> {
  const res = await fetch(`/api/obligations?period=${period}`);
  if (!res.ok) throw new Error("Error fetching obligations");
  return res.json();
}

export async function updateObligationStatus(
  clientId: number,
  period: string,
  field: keyof ObligationClient,
  value: boolean
): Promise<void> {
  const res = await fetch(`/api/obligations/${clientId}/${period}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [field]: value })
  });
  if (!res.ok) throw new Error("Error updating obligation");
}
