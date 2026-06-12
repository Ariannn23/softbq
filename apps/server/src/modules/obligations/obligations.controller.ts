import { FastifyReply, FastifyRequest } from "fastify";
import { db, clients, clientPeriods } from "@softbq/db";
import { eq, and, sql, asc } from "drizzle-orm";

export async function getObligationsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = request.query as { period?: string };
  
  if (!query.period) {
    return reply.code(400).send({ message: "Se requiere un periodo (YYYYMM)" });
  }

  try {
    const activeClients = await db
      .select({
        id: clients.id,
        ruc: clients.ruc,
        businessName: clients.businessName,
        hasPlame: clients.hasPlame,
        hasAfpnet: clients.hasAfpnet,
        hasItan: clients.hasItan,
        hasDaot: clients.hasDaot,
        hasPdt710: clients.hasPdt710,
      })
      .from(clients)
      .where(eq(clients.active, true))
      .orderBy(asc(clients.businessName));

    const periods = await db
      .select({
        clientId: clientPeriods.clientId,
        plameDeclared: clientPeriods.plameDeclared,
        afpnetDeclared: clientPeriods.afpnetDeclared,
        itanDeclared: clientPeriods.itanDeclared,
        daotDeclared: clientPeriods.daotDeclared,
        pdt710Declared: clientPeriods.pdt710Declared,
      })
      .from(clientPeriods)
      .where(eq(clientPeriods.period, query.period));

    const periodMap = new Map();
    for (const p of periods) {
      periodMap.set(p.clientId, p);
    }

    const list = activeClients.map(c => {
      const p = periodMap.get(c.id) || {
        plameDeclared: false,
        afpnetDeclared: false,
        itanDeclared: false,
        daotDeclared: false,
        pdt710Declared: false,
      };
      
      return {
        ...c,
        plameDeclared: p.plameDeclared,
        afpnetDeclared: p.afpnetDeclared,
        itanDeclared: p.itanDeclared,
        daotDeclared: p.daotDeclared,
        pdt710Declared: p.pdt710Declared,
      };
    });

    return reply.send({ clients: list });
  } catch (error: any) {
    return reply.code(500).send({ message: "Error al cargar obligaciones" });
  }
}

export async function updateObligationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id, period } = request.params as { id: string, period: string };
  const body = request.body as { 
    plameDeclared?: boolean,
    afpnetDeclared?: boolean,
    itanDeclared?: boolean,
    daotDeclared?: boolean,
    pdt710Declared?: boolean,
  };

  const clientIdNum = Number(id);

  try {
    const [existing] = await db
      .select()
      .from(clientPeriods)
      .where(and(eq(clientPeriods.clientId, clientIdNum), eq(clientPeriods.period, period)));

    if (existing) {
      await db
        .update(clientPeriods)
        .set({ 
          ...(body.plameDeclared !== undefined && { plameDeclared: body.plameDeclared }),
          ...(body.afpnetDeclared !== undefined && { afpnetDeclared: body.afpnetDeclared }),
          ...(body.itanDeclared !== undefined && { itanDeclared: body.itanDeclared }),
          ...(body.daotDeclared !== undefined && { daotDeclared: body.daotDeclared }),
          ...(body.pdt710Declared !== undefined && { pdt710Declared: body.pdt710Declared }),
          updatedAt: sql`(CURRENT_TIMESTAMP)` 
        })
        .where(eq(clientPeriods.id, existing.id));
    } else {
      await db
        .insert(clientPeriods)
        .values({
          clientId: clientIdNum,
          period,
          status: "pendiente",
          plameDeclared: body.plameDeclared ?? false,
          afpnetDeclared: body.afpnetDeclared ?? false,
          itanDeclared: body.itanDeclared ?? false,
          daotDeclared: body.daotDeclared ?? false,
          pdt710Declared: body.pdt710Declared ?? false,
        });
    }

    return reply.send({ success: true });
  } catch (error: any) {
    return reply.code(500).send({ message: "Error al actualizar obligación" });
  }
}
