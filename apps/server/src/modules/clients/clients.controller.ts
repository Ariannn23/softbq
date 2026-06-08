import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import {
  addClient,
  ClientServiceError,
  disableClient,
  editClient,
  enableClient,
  getClient,
  getClients
} from "./clients.service.js";

const clientSchema = z.object({
  ruc: z.string().regex(/^\d{11}$/, "El RUC debe tener 11 digitos."),
  businessName: z.string().trim().min(1),
  shortName: z.string().trim().min(1),
  contasisEntityCode: z.string().trim().min(1).default("01"),
  contasisEntityDescription: z.string().trim().min(1).default("MI ORGANIZACION"),
  defaultCondition: z.string().trim().min(1).default("CON"),
  defaultPaymentMethod: z.string().trim().min(1).default("008"),
  defaultIgvPercent: z.coerce.number().min(0).max(100).default(18)
});

const paramsSchema = z.object({
  id: z.coerce.number().int().positive()
});

const listQuerySchema = z.object({
  search: z.string().optional()
});

function handleClientError(error: unknown, reply: FastifyReply) {
  if (error instanceof ClientServiceError) {
    return reply.code(error.statusCode).send({ message: error.message });
  }

  throw error;
}

export async function listClientsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = listQuerySchema.parse(request.query);

  try {
    return reply.send({
      clients: await getClients({
        user: request.user,
        search: query.search
      })
    });
  } catch (error) {
    return handleClientError(error, reply);
  }
}

export async function getClientController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = paramsSchema.parse(request.params);

  try {
    return reply.send({
      client: await getClient({
        user: request.user,
        id: params.id
      })
    });
  } catch (error) {
    return handleClientError(error, reply);
  }
}

export async function createClientController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = clientSchema.safeParse(request.body);

  if (!body.success) {
    return reply.code(400).send({ message: "Datos de cliente invalidos." });
  }

  try {
    return reply.code(201).send({
      client: await addClient({
        user: request.user,
        data: body.data
      })
    });
  } catch (error) {
    return handleClientError(error, reply);
  }
}

export async function updateClientController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = paramsSchema.parse(request.params);
  const body = clientSchema.safeParse(request.body);

  if (!body.success) {
    return reply.code(400).send({ message: "Datos de cliente invalidos." });
  }

  try {
    return reply.send({
      client: await editClient({
        user: request.user,
        id: params.id,
        data: body.data
      })
    });
  } catch (error) {
    return handleClientError(error, reply);
  }
}

export async function disableClientController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = paramsSchema.parse(request.params);

  try {
    return reply.send({
      client: await disableClient({
        user: request.user,
        id: params.id
      })
    });
  } catch (error) {
    return handleClientError(error, reply);
  }
}

export async function enableClientController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = paramsSchema.parse(request.params);

  try {
    return reply.send({
      client: await enableClient({
        user: request.user,
        id: params.id
      })
    });
  } catch (error) {
    return handleClientError(error, reply);
  }
}
