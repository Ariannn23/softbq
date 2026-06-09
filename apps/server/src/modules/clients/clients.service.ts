import type { Client } from "@softbq/core";

import type { AuthenticatedUser } from "../auth/auth.service.js";
import {
  createClient,
  findAnotherClientByRuc,
  findClientById,
  findClientByRuc,
  listClients,
  updateClient
} from "./clients.repository.js";

export class ClientServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
  }
}

export type ClientInput = {
  ruc: string;
  businessName: string;
  shortName: string;
  contasisEntityCode: string;
  contasisEntityDescription: string;
  defaultCondition: string;
  defaultPaymentMethod: string;
  defaultIgvPercent: number;
  monthlyFee?: number | null;
  hasPlame?: boolean;
  salesAccount?: string;
  purchasesAccount?: string;
};

function ensureClientPermission(user: AuthenticatedUser | undefined) {
  if (!user) {
    throw new ClientServiceError("Sesion requerida.", 401);
  }

  if (user.role !== "admin" && user.role !== "principal_accountant") {
    throw new ClientServiceError("No tienes permisos para administrar clientes.", 403);
  }
}

function ensureAdminPermission(user: AuthenticatedUser | undefined) {
  if (!user) {
    throw new ClientServiceError("Sesion requerida.", 401);
  }

  if (user.role !== "admin") {
    throw new ClientServiceError("Solo admin puede habilitar clientes.", 403);
  }
}

function toClient(record: Awaited<ReturnType<typeof findClientById>>): Client {
  if (!record) {
    throw new ClientServiceError("Cliente no encontrado.", 404);
  }

  return {
    id: record.id,
    ruc: record.ruc,
    businessName: record.businessName,
    shortName: record.shortName,
    active: record.active,
    contasisEntityCode: record.contasisEntityCode,
    contasisEntityDescription: record.contasisEntityDescription,
    defaultCondition: record.defaultCondition,
    defaultPaymentMethod: record.defaultPaymentMethod,
    defaultIgvPercent: record.defaultIgvPercent,
    monthlyFee: record.monthlyFee,
    hasPlame: record.hasPlame,
    salesAccount: record.salesAccount,
    purchasesAccount: record.purchasesAccount,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

function normalizeClientInput(input: ClientInput): ClientInput {
  return {
    ruc: input.ruc.trim(),
    businessName: input.businessName.trim(),
    shortName: input.shortName.trim(),
    contasisEntityCode: input.contasisEntityCode.trim(),
    contasisEntityDescription: input.contasisEntityDescription.trim(),
    defaultCondition: input.defaultCondition.trim(),
    defaultPaymentMethod: input.defaultPaymentMethod.trim(),
    defaultIgvPercent: input.defaultIgvPercent,
    monthlyFee: input.monthlyFee ?? null,
    hasPlame: input.hasPlame ?? false,
    salesAccount: input.salesAccount?.trim() ?? "",
    purchasesAccount: input.purchasesAccount?.trim() ?? ""
  };
}

export async function getClients(input: {
  user: AuthenticatedUser | undefined;
  search?: string;
}): Promise<Client[]> {
  ensureClientPermission(input.user);

  const records = await listClients(input.search);

  return records.map(toClient);
}

export async function getClient(input: {
  user: AuthenticatedUser | undefined;
  id: number;
}): Promise<Client> {
  ensureClientPermission(input.user);

  return toClient(await findClientById(input.id));
}

export async function addClient(input: {
  user: AuthenticatedUser | undefined;
  data: ClientInput;
}): Promise<Client> {
  ensureClientPermission(input.user);

  const data = normalizeClientInput(input.data);
  const existingClient = await findClientByRuc(data.ruc);

  if (existingClient) {
    throw new ClientServiceError("Ya existe un cliente con ese RUC.", 409);
  }

  const timestamp = new Date().toISOString();

  const client = await createClient({
    ...data,
    active: true,
    createdAt: timestamp,
    updatedAt: timestamp
  });

  return toClient(client);
}

export async function editClient(input: {
  user: AuthenticatedUser | undefined;
  id: number;
  data: ClientInput;
}): Promise<Client> {
  ensureClientPermission(input.user);

  const currentClient = await findClientById(input.id);

  if (!currentClient) {
    throw new ClientServiceError("Cliente no encontrado.", 404);
  }

  if (!currentClient.active) {
    throw new ClientServiceError("No se puede editar un cliente inhabilitado.", 409);
  }

  const data = normalizeClientInput(input.data);
  const duplicatedClient = await findAnotherClientByRuc({
    id: input.id,
    ruc: data.ruc
  });

  if (duplicatedClient) {
    throw new ClientServiceError("Ya existe otro cliente con ese RUC.", 409);
  }

  return toClient(
    await updateClient({
      id: input.id,
      values: {
        ...data,
        updatedAt: new Date().toISOString()
      }
    })
  );
}

export async function disableClient(input: {
  user: AuthenticatedUser | undefined;
  id: number;
}): Promise<Client> {
  ensureClientPermission(input.user);

  const currentClient = await findClientById(input.id);

  if (!currentClient) {
    throw new ClientServiceError("Cliente no encontrado.", 404);
  }

  return toClient(
    await updateClient({
      id: input.id,
      values: {
        active: false,
        updatedAt: new Date().toISOString()
      }
    })
  );
}

export async function enableClient(input: {
  user: AuthenticatedUser | undefined;
  id: number;
}): Promise<Client> {
  ensureAdminPermission(input.user);

  const currentClient = await findClientById(input.id);

  if (!currentClient) {
    throw new ClientServiceError("Cliente no encontrado.", 404);
  }

  return toClient(
    await updateClient({
      id: input.id,
      values: {
        active: true,
        updatedAt: new Date().toISOString()
      }
    })
  );
}
