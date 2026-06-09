import { FastifyReply, FastifyRequest } from "fastify";
import { db, clients, clientPeriods } from "@softbq/db";
import { eq, and, sql } from "drizzle-orm";

export async function getDashboardController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = request.query as { period?: string };
  
  if (!query.period) {
    return reply.code(400).send({ message: "Se requiere un periodo (YYYYMM)" });
  }

  try {
    // 1. Get all active clients
    const activeClients = await db
      .select({
        id: clients.id,
        ruc: clients.ruc,
        businessName: clients.businessName,
      })
      .from(clients)
      .where(eq(clients.active, true));

    // 2. Get client periods for the given period
    const periods = await db
      .select({
        clientId: clientPeriods.clientId,
        status: clientPeriods.status,
      })
      .from(clientPeriods)
      .where(eq(clientPeriods.period, query.period));

    // Create a map for quick lookup
    const statusMap = new Map();
    for (const p of periods) {
      statusMap.set(p.clientId, p.status);
    }

    // 3. Map clients to their status in this period (default "pendiente" if not found)
    let totalActive = activeClients.length;
    let totalPendiente = 0;
    let totalVentasCargadas = 0;
    let totalComprasCargadas = 0;
    let totalGenerado = 0;
    let totalRevisado = 0;
    let totalDeclarado = 0;

    const list = activeClients.map(c => {
      const status = statusMap.get(c.id) || "pendiente";
      
      if (status === "pendiente") totalPendiente++;
      else if (status === "ventas_cargadas") totalVentasCargadas++;
      else if (status === "compras_cargadas") totalComprasCargadas++;
      else if (status === "generado") totalGenerado++;
      else if (status === "revisado") totalRevisado++;
      else if (status === "declarado") totalDeclarado++;
      
      return {
        ...c,
        status
      };
    });

    return reply.send({
      summary: {
        active: totalActive,
        pendiente: totalPendiente,
        ventasCargadas: totalVentasCargadas,
        comprasCargadas: totalComprasCargadas,
        generado: totalGenerado,
        revisado: totalRevisado,
        declarado: totalDeclarado
      },
      clients: list
    });
  } catch (error: any) {
    return reply.code(500).send({ message: "Error al cargar el dashboard" });
  }
}

export async function updateClientPeriodStatusController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id, period } = request.params as { id: string, period: string };
  const { status } = request.body as { status: string };

  const clientIdNum = Number(id);

  if (!status) {
    return reply.code(400).send({ message: "El estado es requerido" });
  }

  try {
    const [existing] = await db
      .select()
      .from(clientPeriods)
      .where(and(eq(clientPeriods.clientId, clientIdNum), eq(clientPeriods.period, period)));

    if (existing) {
      await db
        .update(clientPeriods)
        .set({ status: status as any, updatedAt: sql`(CURRENT_TIMESTAMP)` })
        .where(eq(clientPeriods.id, existing.id));
    } else {
      await db
        .insert(clientPeriods)
        .values({
          clientId: clientIdNum,
          period,
          status: status as any
        });
    }

    return reply.send({ success: true });
  } catch (error: any) {
    return reply.code(500).send({ message: "Error al actualizar el estado" });
  }
}
