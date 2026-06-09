import { AuthenticatedUser } from "../auth/auth.service.js";
import {
  createBillingCharge,
  createBillingPayment,
  getBillingChargeById,
  getBillingCharges,
  getClientChargeForPeriod,
  getClientsWithMonthlyFee,
  updateBillingChargeStatus,
  updateBillingChargeTotalAmount,
  getBillingHistoryByClientId
} from "./billing.repository.js";

export class BillingServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
  }
}

function ensureAuthorizedPermission(user: AuthenticatedUser | undefined) {
  if (!user) {
    throw new BillingServiceError("Sesión requerida.", 401);
  }

  if (user.role !== "admin" && user.role !== "principal_accountant") {
    throw new BillingServiceError("No tienes permisos para administrar cobranzas.", 403);
  }
}

export async function listCharges(input: {
  user: AuthenticatedUser | undefined;
  period?: string;
}) {
  ensureAuthorizedPermission(input.user);

  const charges = await getBillingCharges(input.period);
  return charges;
}

export async function addCharge(input: {
  user: AuthenticatedUser | undefined;
  data: {
    clientId: number;
    period: string | null;
    concept: string;
    totalAmount: number;
  };
}) {
  ensureAuthorizedPermission(input.user);

  if (input.data.totalAmount <= 0) {
    throw new BillingServiceError("El monto debe ser mayor a 0.", 400);
  }

  const charge = await createBillingCharge({
    ...input.data,
    status: "pendiente"
  });

  return charge;
}

export async function addPayment(input: {
  user: AuthenticatedUser | undefined;
  chargeId: number;
  data: {
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    notes?: string | null;
  };
}) {
  ensureAuthorizedPermission(input.user);

  if (input.data.amount <= 0) {
    throw new BillingServiceError("El monto del pago debe ser mayor a 0.", 400);
  }

  const charge = await getBillingChargeById(input.chargeId);
  if (!charge) {
    throw new BillingServiceError("Cargo no encontrado.", 404);
  }

  const remainingDebt = charge.totalAmount - charge.paidAmount;
  if (remainingDebt <= 0) {
    throw new BillingServiceError("El cargo ya se encuentra pagado.", 400);
  }

  if (input.data.amount > remainingDebt) {
    throw new BillingServiceError(`El monto del pago (S/ ${input.data.amount}) no puede superar la deuda pendiente (S/ ${remainingDebt}).`, 400);
  }

  const payment = await createBillingPayment({
    chargeId: input.chargeId,
    ...input.data
  });

  const newPaidAmount = charge.paidAmount + input.data.amount;
  let newStatus: "pendiente" | "parcial" | "pagado" = "parcial";
  
  if (newPaidAmount >= charge.totalAmount) {
    newStatus = "pagado";
  } else if (newPaidAmount === 0) {
    newStatus = "pendiente";
  }

  if (newStatus !== charge.status) {
    await updateBillingChargeStatus(input.chargeId, newStatus);
  }

  return payment;
}

export async function generateMonthlyCharges(input: { user: AuthenticatedUser | undefined; period: string }) {
  ensureAuthorizedPermission(input.user);

  const clients = await getClientsWithMonthlyFee();
  let createdCount = 0;

  for (const client of clients) {
    if (!client.monthlyFee) continue;

    const existingCharge = await getClientChargeForPeriod(client.id, input.period);
    if (!existingCharge) {
      await createBillingCharge({
        clientId: client.id,
        period: input.period,
        concept: "Honorarios Contables",
        totalAmount: client.monthlyFee,
        status: "pendiente"
      });
      createdCount++;
    }
  }

  return { generated: createdCount };
}

export async function getClientBillingHistory(input: { user: AuthenticatedUser | undefined; clientId: number }) {
  ensureAuthorizedPermission(input.user);
  
  const charges = await getBillingHistoryByClientId(input.clientId);
  
  let totalBilled = 0;
  let totalPaid = 0;
  
  charges.forEach(c => {
    totalBilled += Number(c.totalAmount);
    totalPaid += Number(c.paidAmount);
  });
  
  return {
    clientId: input.clientId,
    kpis: {
      totalBilled,
      totalPaid,
      totalDebt: totalBilled - totalPaid,
    },
    charges
  };
}

export async function updateChargeAmount(input: {
  user: AuthenticatedUser | undefined;
  chargeId: number;
  newAmount: number;
}) {
  ensureAuthorizedPermission(input.user);

  if (input.newAmount <= 0) {
    throw new BillingServiceError("El monto debe ser mayor a 0.", 400);
  }

  const charge = await getBillingChargeById(input.chargeId);
  if (!charge) {
    throw new BillingServiceError("Cargo no encontrado.", 404);
  }

  const paidAmount = Number(charge.paidAmount);
  if (input.newAmount < paidAmount) {
    throw new BillingServiceError(
      `El nuevo monto no puede ser menor a lo que ya se pagó (S/ ${paidAmount.toFixed(2)}).`,
      400
    );
  }

  let newStatus: "pendiente" | "parcial" | "pagado" = "pendiente";
  if (paidAmount > 0) {
    newStatus = "parcial";
  }
  if (input.newAmount === paidAmount) {
    newStatus = "pagado";
  }

  await updateBillingChargeTotalAmount(input.chargeId, input.newAmount, newStatus);
}
