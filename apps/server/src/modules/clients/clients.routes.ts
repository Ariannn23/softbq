import type { FastifyInstance } from "fastify";

import { requireAuth } from "../auth/auth.middleware.js";
import {
  createClientController,
  disableClientController,
  enableClientController,
  getClientController,
  listClientsController,
  updateClientController
} from "./clients.controller.js";

export async function clientsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/", listClientsController);
  app.get("/:id", getClientController);
  app.post("/", createClientController);
  app.put("/:id", updateClientController);
  app.post("/:id/disable", disableClientController);
  app.post("/:id/enable", enableClientController);
}
