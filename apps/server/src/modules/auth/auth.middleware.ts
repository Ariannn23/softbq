import type { FastifyReply, FastifyRequest } from "fastify";

import { sessionCookieName } from "./auth.controller.js";
import { getSession } from "./auth.service.js";

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const session = getSession(request.cookies[sessionCookieName]);

  if (!session) {
    return reply.code(401).send({ message: "Sesion requerida." });
  }

  request.user = session.user;
}
