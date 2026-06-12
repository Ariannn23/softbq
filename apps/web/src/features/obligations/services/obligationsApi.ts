import { api } from "../../shared/api";

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
  const { data } = await api.get<ObligationsResponse>(`/obligations?period=${period}`);
  return data;
}

export async function updateObligationStatus(
  clientId: number,
  period: string,
  field: keyof ObligationClient,
  value: boolean
): Promise<void> {
  await api.put(`/obligations/${clientId}/${period}`, { [field]: value });
}
