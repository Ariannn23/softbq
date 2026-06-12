import type { FastifyInstance } from "fastify";
import { requireAuth } from "../auth/auth.middleware.js";
import { getObligationsController, updateObligationController } from "./obligations.controller.js";

export async function obligationsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/", getObligationsController);
  app.put("/:id/:period", updateObligationController);
}
