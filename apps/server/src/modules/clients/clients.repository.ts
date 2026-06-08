import { and, eq, like, ne, or } from "drizzle-orm";

import { clients, db } from "@softbq/db";

export type ClientRecord = typeof clients.$inferSelect;
export type NewClientRecord = typeof clients.$inferInsert;

export async function listClients(search?: string): Promise<ClientRecord[]> {
  const normalizedSearch = search?.trim();

  if (!normalizedSearch) {
    return db.select().from(clients);
  }

  const pattern = `%${normalizedSearch}%`;

  return db
    .select()
    .from(clients)
    .where(
      or(
        like(clients.ruc, pattern),
        like(clients.businessName, pattern),
        like(clients.shortName, pattern)
      )
    );
}

export async function findClientById(id: number): Promise<ClientRecord | null> {
  const [client] = await db.select().from(clients).where(eq(clients.id, id)).limit(1);

  return client ?? null;
}

export async function findClientByRuc(ruc: string): Promise<ClientRecord | null> {
  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.ruc, ruc))
    .limit(1);

  return client ?? null;
}

export async function findAnotherClientByRuc(input: {
  ruc: string;
  id: number;
}): Promise<ClientRecord | null> {
  const [client] = await db
    .select()
    .from(clients)
    .where(and(eq(clients.ruc, input.ruc), ne(clients.id, input.id)))
    .limit(1);

  return client ?? null;
}

export async function createClient(input: NewClientRecord): Promise<ClientRecord> {
  const [client] = await db.insert(clients).values(input).returning();

  if (!client) {
    throw new Error("No se pudo crear el cliente.");
  }

  return client;
}

export async function updateClient(input: {
  id: number;
  values: Partial<NewClientRecord>;
}): Promise<ClientRecord | null> {
  const [client] = await db
    .update(clients)
    .set(input.values)
    .where(eq(clients.id, input.id))
    .returning();

  return client ?? null;
}
