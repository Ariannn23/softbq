import { eq, inArray } from "drizzle-orm";
import { db, settings } from "@softbq/db";

export async function getAllSettings() {
  const result = await db.select().from(settings);
  // Transform to a key-value map for easier consumption by frontend
  const settingsMap: Record<string, string> = {};
  for (const row of result) {
    settingsMap[row.key] = row.value;
  }
  return settingsMap;
}

export async function getSettingsAsList() {
  return db.select().from(settings);
}

export async function updateSettings(newSettings: Record<string, string>) {
  const keys = Object.keys(newSettings);
  if (keys.length === 0) return;

  return db.transaction(async (tx) => {
    for (const key of keys) {
      const value = newSettings[key] as string;
      // Insert or replace essentially
      const existing = await tx.select().from(settings).where(eq(settings.key, key)).get();
      if (existing) {
        await tx.update(settings).set({ value, updatedAt: new Date().toISOString() }).where(eq(settings.key, key));
      } else {
        await tx.insert(settings).values({ key, value });
      }
    }
  });
}
