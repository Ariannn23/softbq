import { db } from "@softbq/db";
import { billingCharges, billingPayments, clients } from "@softbq/db";
import { eq, and, sql, desc, asc } from "drizzle-orm";

export async function getBillingCharges(period?: string) {
  const query = db
    .select({
      id: billingCharges.id,
      period: billingCharges.period,
      concept: billingCharges.concept,
      totalAmount: billingCharges.totalAmount,
      status: billingCharges.status,
      createdAt: billingCharges.createdAt,
      updatedAt: billingCharges.updatedAt,
      client: {
        id: clients.id,
        businessName: clients.businessName,
        ruc: clients.ruc
      },
      paidAmount: sql<number>`COALESCE(SUM(${billingPayments.amount}), 0)`
    })
    .from(billingCharges)
    .innerJoin(clients, eq(billingCharges.clientId, clients.id))
    .leftJoin(billingPayments, eq(billingCharges.id, billingPayments.chargeId))
    .groupBy(
      billingCharges.id,
      billingCharges.period,
      billingCharges.concept,
      billingCharges.totalAmount,
      billingCharges.status,
      billingCharges.createdAt,
      billingCharges.updatedAt,
      clients.id,
      clients.businessName,
      clients.ruc
    )
    .orderBy(desc(billingCharges.createdAt));

  if (period) {
    query.where(eq(billingCharges.period, period));
  }

  return await query;
}

export async function getBillingChargeById(chargeId: number) {
  const records = await db
    .select({
      id: billingCharges.id,
      totalAmount: billingCharges.totalAmount,
      status: billingCharges.status,
      paidAmount: sql<number>`COALESCE(SUM(${billingPayments.amount}), 0)`
    })
    .from(billingCharges)
    .leftJoin(billingPayments, eq(billingCharges.id, billingPayments.chargeId))
    .where(eq(billingCharges.id, chargeId))
    .groupBy(billingCharges.id, billingCharges.totalAmount, billingCharges.status);

  return records[0];
}

export async function createBillingCharge(data: {
  clientId: number;
  period: string | null;
  concept: string;
  totalAmount: number;
  status: "pendiente" | "parcial" | "pagado";
}) {
  const result = await db.insert(billingCharges).values(data).returning();
  return result[0];
}

export async function createBillingPayment(data: {
  chargeId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  notes?: string | null;
}) {
  const result = await db
    .insert(billingPayments)
    .values({
      chargeId: data.chargeId,
      amount: data.amount,
      paymentDate: data.paymentDate,
      paymentMethod: data.paymentMethod,
      notes: data.notes ?? null
    })
    .returning();
  return result[0];
}

export async function updateBillingChargeStatus(
  chargeId: number,
  status: "pendiente" | "parcial" | "pagado"
) {
  await db
    .update(billingCharges)
    .set({
      status,
      updatedAt: new Date().toISOString()
    })
    .where(eq(billingCharges.id, chargeId));
}

export async function updateBillingChargeTotalAmount(
  chargeId: number,
  totalAmount: number,
  status: "pendiente" | "parcial" | "pagado"
) {
  await db
    .update(billingCharges)
    .set({
      totalAmount,
      status,
      updatedAt: new Date().toISOString()
    })
    .where(eq(billingCharges.id, chargeId));
}

export async function getClientsWithMonthlyFee() {
  return await db
    .select({
      id: clients.id,
      monthlyFee: clients.monthlyFee
    })
    .from(clients)
    .where(and(eq(clients.active, true), sql`${clients.monthlyFee} IS NOT NULL AND ${clients.monthlyFee} > 0`));
}

export async function getClientChargeForPeriod(clientId: number, period: string) {
  const records = await db
    .select()
    .from(billingCharges)
    .where(and(eq(billingCharges.clientId, clientId), eq(billingCharges.period, period)));
  return records[0];
}

export async function getBillingHistoryByClientId(clientId: number) {
  const query = db
    .select({
      id: billingCharges.id,
      period: billingCharges.period,
      concept: billingCharges.concept,
      totalAmount: billingCharges.totalAmount,
      status: billingCharges.status,
      createdAt: billingCharges.createdAt,
      updatedAt: billingCharges.updatedAt,
      paidAmount: sql<number>`COALESCE(SUM(${billingPayments.amount}), 0)`,
      payments: sql<string>`
        COALESCE(
          json_group_array(
            json_object(
              'id', ${billingPayments.id},
              'amount', ${billingPayments.amount},
              'date', ${billingPayments.paymentDate},
              'method', ${billingPayments.paymentMethod}
            )
          ) FILTER (WHERE ${billingPayments.id} IS NOT NULL),
          '[]'
        )
      `
    })
    .from(billingCharges)
    .leftJoin(billingPayments, eq(billingCharges.id, billingPayments.chargeId))
    .where(eq(billingCharges.clientId, clientId))
    .groupBy(
      billingCharges.id,
      billingCharges.period,
      billingCharges.concept,
      billingCharges.totalAmount,
      billingCharges.status,
      billingCharges.createdAt,
      billingCharges.updatedAt
    )
    .orderBy(desc(billingCharges.createdAt));

  const records = await query;
  
  return records.map(record => ({
    ...record,
    payments: JSON.parse(record.payments) as Array<{id: number, amount: number, date: string, method: string}>
  }));
}
