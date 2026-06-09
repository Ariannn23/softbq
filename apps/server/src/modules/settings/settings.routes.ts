import type { FastifyInstance } from "fastify";
import { requireAuth, requireAdmin } from "../auth/auth.middleware.js";
import { getSettingsController, getSettingsListController, updateSettingsController } from "./settings.controller.js";

export async function settingsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);
  app.addHook("preHandler", requireAdmin);

  app.get("/", getSettingsController);
  app.get("/list", getSettingsListController);
  app.put("/", updateSettingsController);
}
