import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import {
  addCharge,
  addPayment,
  BillingServiceError,
  generateMonthlyCharges,
  listCharges,
  getClientBillingHistory,
  updateChargeAmount
} from "./billing.service.js";

const listQuerySchema = z.object({
  period: z.string().optional()
});

const createChargeSchema = z.object({
  clientId: z.number().int().positive(),
  period: z.string().nullable().optional(),
  concept: z.string().trim().min(1),
  totalAmount: z.number().positive()
});

const createPaymentSchema = z.object({
  amount: z.number().positive(),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "El formato de fecha debe ser YYYY-MM-DD"),
  paymentMethod: z.enum(["Yape", "Transferencia BCP", "Efectivo"]),
  notes: z.string().optional().nullable()
});

const chargeParamsSchema = z.object({
  chargeId: z.coerce.number().int().positive()
});

const generateMonthlySchema = z.object({
  period: z.string().regex(/^\d{6}$/, "El periodo debe ser YYYYMM")
});

function handleBillingError(error: unknown, reply: FastifyReply) {
  if (error instanceof BillingServiceError) {
    return reply.code(error.statusCode).send({ message: error.message });
  }

  throw error;
}

export async function listChargesController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = listQuerySchema.parse(request.query);

  try {
    const charges = await listCharges({
      user: request.user,
      period: query.period
    });
    return reply.send({ charges });
  } catch (error) {
    return handleBillingError(error, reply);
  }
}

export async function createChargeController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = createChargeSchema.safeParse(request.body);

  if (!body.success) {
    return reply.code(400).send({ message: "Datos de cargo inválidos." });
  }

  try {
    const charge = await addCharge({
      user: request.user,
      data: {
        clientId: body.data.clientId,
        period: body.data.period ?? null,
        concept: body.data.concept,
        totalAmount: body.data.totalAmount
      }
    });
    return reply.code(201).send({ charge });
  } catch (error) {
    return handleBillingError(error, reply);
  }
}

export async function createPaymentController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = chargeParamsSchema.parse(request.params);
  const body = createPaymentSchema.safeParse(request.body);

  if (!body.success) {
    return reply.code(400).send({ message: "Datos de pago inválidos.", errors: body.error.errors });
  }

  try {
    const payment = await addPayment({
      user: request.user,
      chargeId: params.chargeId,
      data: {
        amount: body.data.amount,
        paymentDate: body.data.paymentDate,
        paymentMethod: body.data.paymentMethod,
        notes: body.data.notes
      }
    });
    return reply.code(201).send({ payment });
  } catch (error) {
    return handleBillingError(error, reply);
  }
}

export async function generateMonthlyChargesController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = generateMonthlySchema.safeParse(request.body);

  if (!body.success) {
    return reply.code(400).send({ message: "Periodo inválido." });
  }

  try {
    const result = await generateMonthlyCharges({
      user: request.user,
      period: body.data.period
    });
    return reply.code(201).send(result);
  } catch (error) {
    return handleBillingError(error, reply);
  }
}

export async function getClientBillingHistoryController(
  request: FastifyRequest<{ Params: { clientId: string } }>,
  reply: FastifyReply
) {
  try {
    const result = await getClientBillingHistory({
      user: request.user,
      clientId: Number(request.params.clientId)
    });
    return reply.code(200).send(result);
  } catch (error) {
    return handleBillingError(error, reply);
  }
}

export async function updateAmountController(
  request: FastifyRequest<{ Params: { chargeId: string }, Body: { amount: number } }>,
  reply: FastifyReply
) {
  const amountSchema = z.object({
    amount: z.number().positive()
  });

  const body = amountSchema.safeParse(request.body);
  if (!body.success) {
    return reply.code(400).send({ message: "El monto debe ser un nmero positivo." });
  }

  try {
    await updateChargeAmount({
      user: request.user,
      chargeId: Number(request.params.chargeId),
      newAmount: body.data.amount
    });
    return reply.code(200).send({ success: true });
  } catch (error) {
    return handleBillingError(error, reply);
  }
}
