import type { FastifyInstance } from "fastify";
import { requireAuth } from "../auth/auth.middleware.js";
import {
  createChargeController,
  createPaymentController,
  generateMonthlyChargesController,
  listChargesController,
  getClientBillingHistoryController,
  updateAmountController
} from "./billing.controller.js";

export async function billingRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", requireAuth);
  
  fastify.get("/", listChargesController);
  fastify.get("/client/:clientId", getClientBillingHistoryController);
  fastify.post("/charges", createChargeController);
  fastify.post("/charges/generate-monthly", generateMonthlyChargesController);
  fastify.post("/charges/:chargeId/payments", createPaymentController);
  fastify.put("/charges/:chargeId/amount", updateAmountController);
}
