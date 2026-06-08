import type { FastifyInstance } from "fastify";
import { requireAuth } from "../auth/auth.middleware.js";
import { validateConversionController } from "./conversions.controller.js";

export async function conversionsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.post("/validate", validateConversionController);
}
