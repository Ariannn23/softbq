import { FastifyInstance } from "fastify";
import { getDashboardController, updateClientPeriodStatusController } from "./dashboard.controller.js";

export async function dashboardRoutes(app: FastifyInstance) {
  // GET /api/dashboard?period=YYYYMM
  app.get("/", getDashboardController);

  // PUT /api/dashboard/clients/:id/period/:period/status
  app.put("/clients/:id/period/:period/status", updateClientPeriodStatusController);
}
