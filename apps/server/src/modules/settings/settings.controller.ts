import type { FastifyReply, FastifyRequest } from "fastify";
import * as settingsService from "./settings.service.js";

export async function getSettingsController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const settings = await settingsService.getSettings();
    return reply.send(settings);
  } catch (error: any) {
    return reply.code(500).send({ message: error.message || "Error interno del servidor" });
  }
}

export async function getSettingsListController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const settings = await settingsService.getSettingsList();
    return reply.send(settings);
  } catch (error: any) {
    return reply.code(500).send({ message: error.message || "Error interno del servidor" });
  }
}

export async function updateSettingsController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const newSettings = request.body as Record<string, string>;
    const updated = await settingsService.updateSettings(newSettings);
    return reply.send({ message: "Configuraciones actualizadas exitosamente", settings: updated });
  } catch (error: any) {
    return reply.code(400).send({ message: error.message || "Error al actualizar las configuraciones" });
  }
}
