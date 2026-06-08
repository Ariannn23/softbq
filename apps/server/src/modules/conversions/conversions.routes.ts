import type { FastifyInstance } from "fastify";
import { requireAuth } from "../auth/auth.middleware.js";
import {
  validateConversionController,
  generateConversionController,
  downloadConversionFileController,
} from "./conversions.controller.js";

export async function conversionsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.post("/validate", validateConversionController);
  app.post("/generate", generateConversionController);
  app.get("/:id/download/:fileId", downloadConversionFileController);
}
