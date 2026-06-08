import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(multipart);

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

await app.listen({ port, host });