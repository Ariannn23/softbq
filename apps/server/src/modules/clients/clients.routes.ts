import type { FastifyInstance } from "fastify";

import { requireAuth } from "../auth/auth.middleware.js";
import {
  analyzeClientImportController,
  confirmClientImportController,
  previewClientImportController
} from "./client-import.controller.js";
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

  app.post("/import/analyze", analyzeClientImportController);
  app.post("/import/:importId/preview", previewClientImportController);
  app.post("/import/:importId/confirm", confirmClientImportController);
  app.get("/", listClientsController);
  app.get("/:id", getClientController);
  app.post("/", createClientController);
  app.put("/:id", updateClientController);
  app.post("/:id/disable", disableClientController);
  app.post("/:id/enable", enableClientController);
}
