export type ClientPeriodStatus = 
  | "pendiente" 
  | "ventas_cargadas" 
  | "compras_cargadas" 
  | "generado" 
  | "revisado" 
  | "declarado";

export type DashboardClientInfo = {
  id: number;
  ruc: string;
  businessName: string;
  hasPlame?: boolean;
  status: ClientPeriodStatus;
};

export interface DashboardSummary {
  active: number;
  pendiente: number;
  ventasCargadas: number;
  comprasCargadas: number;
  generado: number;
  revisado: number;
  declarado: number;
};

export type DashboardResponse = {
  summary: DashboardSummary;
  clients: DashboardClientInfo[];
};

export async function getDashboardData(period: string): Promise<DashboardResponse> {
  const res = await fetch(`/api/dashboard?period=${period}`);
  if (!res.ok) {
    throw new Error("Error al cargar el dashboard");
  }
  return res.json();
}

export async function updateClientPeriodStatus(
  clientId: number, 
  period: string, 
  status: ClientPeriodStatus
): Promise<{ success: boolean }> {
  const res = await fetch(`/api/dashboard/clients/${clientId}/period/${period}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    throw new Error("Error al actualizar el estado");
  }
  return res.json();
}
