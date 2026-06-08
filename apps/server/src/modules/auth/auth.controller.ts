import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { getSession, login, logout } from "./auth.service.js";

const sessionCookieName = "softbq_session";

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1)
});

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const credentials = loginSchema.safeParse(request.body);

  if (!credentials.success) {
    return reply.code(400).send({ message: "Credenciales invalidas." });
  }

  const session = await login(credentials.data);

  if (!session) {
    return reply.code(401).send({ message: "Usuario o contrasena incorrectos." });
  }

  reply.setCookie(sessionCookieName, session.token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return reply.send({ user: session.user });
}

export async function logoutController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  logout(request.cookies[sessionCookieName]);

  reply.clearCookie(sessionCookieName, { path: "/" });

  return reply.send({ ok: true });
}

export async function meController(request: FastifyRequest, reply: FastifyReply) {
  const session = getSession(request.cookies[sessionCookieName]);

  if (!session) {
    return reply.code(401).send({ user: null });
  }

  return reply.send({ user: session.user });
}
