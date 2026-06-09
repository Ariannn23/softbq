export interface BillingCharge {
  id: number;
  period: string | null;
  concept: string;
  totalAmount: number;
  paidAmount: number;
  status: "pendiente" | "parcial" | "pagado";
  createdAt: string;
  updatedAt: string;
  client: {
    id: number;
    businessName: string;
    ruc: string;
  };
}

export interface BillingPayment {
  id: number;
  chargeId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  notes: string | null;
  createdAt: string;
}

export interface BillingResponse {
  charges: BillingCharge[];
}

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

export async function getBillingCharges(period?: string): Promise<BillingResponse> {
  const params = new URLSearchParams();
  if (period) {
    params.append("period", period);
  }
  return fetchApi(`/api/billing?${params.toString()}`);
}

export async function createBillingCharge(data: {
  clientId: number;
  period: string | null;
  concept: string;
  totalAmount: number;
}) {
  return fetchApi("/api/billing/charges", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function createBillingPayment(
  chargeId: number,
  data: {
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    notes?: string;
  }
) {
  return fetchApi(`/api/billing/charges/${chargeId}/payments`, {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function generateMonthlyCharges(period: string): Promise<{ generatedCount: number }> {
  return fetchApi("/api/billing/charges/generate-monthly", {
    method: "POST",
    body: JSON.stringify({ period })
  });
}

export interface ClientBillingHistory {
  clientId: number;
  kpis: {
    totalBilled: number;
    totalPaid: number;
    totalDebt: number;
  };
  charges: Array<{
    id: number;
    period: string | null;
    concept: string;
    totalAmount: number;
    paidAmount: number;
    status: "pendiente" | "parcial" | "pagado";
    createdAt: string;
    updatedAt: string;
    payments: Array<{
      id: number;
      amount: number;
      date: string;
      method: string;
    }>;
  }>;
}

export async function getBillingHistory(clientId: number): Promise<ClientBillingHistory> {
  return fetchApi(`/api/billing/client/${clientId}`);
}
