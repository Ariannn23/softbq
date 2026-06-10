import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

import { db, sqlite } from "./client.js";
import { settings, users } from "./schema/index.js";

const now = () => new Date().toISOString();

const baseSettings = [
  {
    key: "contasis.currency.pen",
    value: "S",
    description: "Codigo Contasis para moneda nacional PEN",
  },
  {
    key: "contasis.currency.usd",
    value: "D",
    description: "Codigo Contasis para moneda extranjera USD",
  },
  {
    key: "defaults.condition",
    value: "CON",
    description: "Condicion por defecto para clientes",
  },
  {
    key: "defaults.payment_method",
    value: "008",
    description: "Código de pago por defecto",
  },
  {
    key: "defaults.igv_percent",
    value: "18",
    description: "Porcentaje IGV por defecto",
  },
  {
    key: "sire.txt_separator",
    value: "|",
    description: "Separador por defecto para archivos TXT SIRE",
  },
] as const;

async function upsertUser(input: {
  username: string;
  password: string;
  role: "admin" | "principal_accountant";
}) {
  const passwordHash = await hash(input.password, 12);
  const timestamp = now();

  await db
    .insert(users)
    .values({
      username: input.username,
      passwordHash,
      role: input.role,
      active: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoUpdate({
      target: users.username,
      set: {
        passwordHash,
        role: input.role,
        active: true,
        updatedAt: timestamp,
      },
    });
}

async function seed() {
  await upsertUser({
    username: "admin",
    password: process.env.SOFTBQ_ADMIN_PASSWORD ?? "admin123",
    role: "admin",
  });

  await upsertUser({
    username: "armando",
    password: process.env.SOFTBQ_ARMANDO_PASSWORD ?? "armando123",
    role: "principal_accountant",
  });

  for (const setting of baseSettings) {
    await db
      .insert(settings)
      .values({
        ...setting,
        updatedAt: now(),
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: {
          value: setting.value,
          description: setting.description,
          updatedAt: now(),
        },
      });
  }

  const seededUsers = await db
    .select({
      username: users.username,
      role: users.role,
      active: users.active,
    })
    .from(users)
    .where(eq(users.active, true));

  const seededSettings = await db.select().from(settings);

  console.info(
    `Seed completo: ${seededUsers.length} usuarios activos, ${seededSettings.length} settings.`,
  );
}

try {
  await seed();
} finally {
  sqlite.close();
}
