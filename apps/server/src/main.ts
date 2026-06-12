import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { db, settings } from "@softbq/db";
import { eq } from "drizzle-orm";

import { authRoutes } from "./modules/auth/auth.routes.js";
import { billingRoutes } from "./modules/billing/billing.routes.js";
import { clientsRoutes } from "./modules/clients/clients.routes.js";
import { conversionsRoutes } from "./modules/conversions/conversions.routes.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import { settingsRoutes } from "./modules/settings/settings.routes.js";
import { obligationsRoutes } from "./modules/obligations/obligations.routes.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  credentials: true,
  origin: true
});
await app.register(cookie);
await app.register(multipart);
await app.register(authRoutes, { prefix: "/api/auth" });
await app.register(billingRoutes, { prefix: "/api/billing" });
await app.register(clientsRoutes, { prefix: "/api/clients" });
await app.register(conversionsRoutes, { prefix: "/api/conversions" });
await app.register(dashboardRoutes, { prefix: "/api/dashboard" });
await app.register(settingsRoutes, { prefix: "/api/settings" });
await app.register(obligationsRoutes, { prefix: "/api/obligations" });

app.get("/api/health", async () => ({
  ok: true,
  app: "SOFTBQ",
  mode: "local"
}));

app.get("/api/public-settings", async () => {
  const [minVersionRow] = await db
    .select({ value: settings.value })
    .from(settings)
    .where(eq(settings.key, "min_version_required"))
    .limit(1);
  return {
    min_version_required: minVersionRow ? minVersionRow.value : "0.0.0"
  };
});

app.get("/api/bootstrap", async () => ({
  users: ["admin", "armando"],
  next: ["auth", "clients", "conversions"]
}));

// Serve React Frontend
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webDistPath = path.resolve(__dirname, "../../web/dist");

await app.register(fastifyStatic, {
  root: webDistPath,
  prefix: "/",
  wildcard: false,
});

app.get("/*", async (request, reply) => {
  if (request.url.startsWith("/api/")) {
    return reply.callNotFound();
  }
  return reply.sendFile("index.html");
});

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "0.0.0.0";

const closeDatabase = async () => {
  sqlite.close();
};

app.addHook("onClose", closeDatabase);

await app.listen({ port, host });
