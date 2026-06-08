import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";

import { sqlite } from "@softbq/db";

import { authRoutes } from "./modules/auth/auth.routes.js";
import { clientsRoutes } from "./modules/clients/clients.routes.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  credentials: true,
  origin: true
});
await app.register(cookie);
await app.register(multipart);
await app.register(authRoutes, { prefix: "/api/auth" });
await app.register(clientsRoutes, { prefix: "/api/clients" });

app.get("/api/health", async () => ({
  ok: true,
  app: "SOFTBQ",
  mode: "local"
}));

app.get("/api/bootstrap", async () => ({
  users: ["admin", "armando"],
  next: ["auth", "clients", "conversions"]
}));

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "0.0.0.0";

const closeDatabase = async () => {
  sqlite.close();
};

app.addHook("onClose", closeDatabase);

await app.listen({ port, host });
