import type { AuthenticatedUser } from "../modules/auth/auth.service";

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}
