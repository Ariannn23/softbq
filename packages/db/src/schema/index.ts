import type {
  ConversionFileStatus,
  ConversionStatus,
  ObservationSeverity,
  SireFileType,
  UserRole,
  PeriodStatus
} from "@softbq/core";
import { relations, sql } from "drizzle-orm";
import {
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex
} from "drizzle-orm/sqlite-core";

const currentTimestamp = sql`(CURRENT_TIMESTAMP)`;

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    username: text("username").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").$type<UserRole>().notNull(),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull().default(currentTimestamp),
    updatedAt: text("updated_at").notNull().default(currentTimestamp)
  },
  (table) => [uniqueIndex("users_username_unique").on(table.username)]
);

export const clients = sqliteTable(
  "clients",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    ruc: text("ruc").notNull(),
    businessName: text("business_name").notNull(),
    shortName: text("short_name").notNull(),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    contasisEntityCode: text("contasis_entity_code").notNull().default("01"),
    contasisEntityDescription: text("contasis_entity_description")
      .notNull()
      .default("MI ORGANIZACION"),
    defaultCondition: text("default_condition").notNull().default("CON"),
    defaultPaymentMethod: text("default_payment_method").notNull().default("008"),
    defaultIgvPercent: real("default_igv_percent").notNull().default(18),
    monthlyFee: real("monthly_fee"),
    createdAt: text("created_at").notNull().default(currentTimestamp),
    updatedAt: text("updated_at").notNull().default(currentTimestamp)
  },
  (table) => [uniqueIndex("clients_ruc_unique").on(table.ruc)]
);

export const clientPeriods = sqliteTable(
  "client_periods",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    clientId: integer("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "restrict" }),
    period: text("period").notNull(),
    status: text("status").$type<PeriodStatus>().notNull().default("pendiente"),
    updatedAt: text("updated_at").notNull().default(currentTimestamp)
  },
  (table) => [uniqueIndex("client_periods_unique_period").on(table.clientId, table.period)]
);

export const conversions = sqliteTable("conversions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "restrict" }),
  period: text("period").notNull(),
  createdBy: integer("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  status: text("status").$type<ConversionStatus>().notNull().default("draft"),
  salesStatus: text("sales_status").$type<ConversionFileStatus>(),
  purchasesStatus: text("purchases_status").$type<ConversionFileStatus>(),
  salesRecordsCount: integer("sales_records_count").notNull().default(0),
  purchasesRecordsCount: integer("purchases_records_count").notNull().default(0),
  salesTotal: real("sales_total").notNull().default(0),
  purchasesTotal: real("purchases_total").notNull().default(0),
  createdAt: text("created_at").notNull().default(currentTimestamp),
  updatedAt: text("updated_at").notNull().default(currentTimestamp)
});

export const conversionFiles = sqliteTable("conversion_files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  conversionId: integer("conversion_id")
    .notNull()
    .references(() => conversions.id, { onDelete: "cascade" }),
  fileType: text("file_type").$type<SireFileType>().notNull(),
  originalName: text("original_name").notNull(),
  storagePath: text("storage_path").notNull(),
  outputPath: text("output_path"),
  status: text("status").$type<ConversionFileStatus>().notNull().default("uploaded"),
  recordsCount: integer("records_count").notNull().default(0),
  totalAmount: real("total_amount").notNull().default(0),
  createdAt: text("created_at").notNull().default(currentTimestamp),
  updatedAt: text("updated_at").notNull().default(currentTimestamp)
});

export const conversionObservations = sqliteTable("conversion_observations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  conversionId: integer("conversion_id")
    .notNull()
    .references(() => conversions.id, { onDelete: "cascade" }),
  fileId: integer("file_id").references(() => conversionFiles.id, {
    onDelete: "cascade"
  }),
  severity: text("severity").$type<ObservationSeverity>().notNull(),
  code: text("code").notNull(),
  message: text("message").notNull(),
  rowNumber: integer("row_number"),
  fieldName: text("field_name"),
  createdAt: text("created_at").notNull().default(currentTimestamp)
});

export const settings = sqliteTable(
  "settings",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    key: text("key").notNull(),
    value: text("value").notNull(),
    description: text("description"),
    updatedAt: text("updated_at").notNull().default(currentTimestamp)
  },
  (table) => [uniqueIndex("settings_key_unique").on(table.key)]
);

export const billingCharges = sqliteTable("billing_charges", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "restrict" }),
  period: text("period"), // Can be null if it's a one-off charge not tied to a specific month
  concept: text("concept").notNull(),
  totalAmount: real("total_amount").notNull(),
  status: text("status").notNull().default("pendiente"), // "pendiente", "parcial", "pagado"
  createdAt: text("created_at").notNull().default(currentTimestamp),
  updatedAt: text("updated_at").notNull().default(currentTimestamp)
});

export const billingPayments = sqliteTable("billing_payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  chargeId: integer("charge_id")
    .notNull()
    .references(() => billingCharges.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  paymentDate: text("payment_date").notNull(), // ISO date string
  paymentMethod: text("payment_method").notNull(), // e.g. "Yape", "Transferencia BCP", "Efectivo"
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(currentTimestamp)
});

export const usersRelations = relations(users, ({ many }) => ({
  conversions: many(conversions)
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  conversions: many(conversions),
  clientPeriods: many(clientPeriods),
  billingCharges: many(billingCharges)
}));

export const clientPeriodsRelations = relations(clientPeriods, ({ one }) => ({
  client: one(clients, {
    fields: [clientPeriods.clientId],
    references: [clients.id]
  })
}));

export const billingChargesRelations = relations(billingCharges, ({ one, many }) => ({
  client: one(clients, {
    fields: [billingCharges.clientId],
    references: [clients.id]
  }),
  payments: many(billingPayments)
}));

export const billingPaymentsRelations = relations(billingPayments, ({ one }) => ({
  charge: one(billingCharges, {
    fields: [billingPayments.chargeId],
    references: [billingCharges.id]
  })
}));

export const conversionsRelations = relations(conversions, ({ one, many }) => ({
  client: one(clients, {
    fields: [conversions.clientId],
    references: [clients.id]
  }),
  creator: one(users, {
    fields: [conversions.createdBy],
    references: [users.id]
  }),
  files: many(conversionFiles),
  observations: many(conversionObservations)
}));

export const conversionFilesRelations = relations(
  conversionFiles,
  ({ one, many }) => ({
    conversion: one(conversions, {
      fields: [conversionFiles.conversionId],
      references: [conversions.id]
    }),
    observations: many(conversionObservations)
  })
);

export const conversionObservationsRelations = relations(
  conversionObservations,
  ({ one }) => ({
    conversion: one(conversions, {
      fields: [conversionObservations.conversionId],
      references: [conversions.id]
    }),
    file: one(conversionFiles, {
      fields: [conversionObservations.fileId],
      references: [conversionFiles.id]
    })
  })
);
