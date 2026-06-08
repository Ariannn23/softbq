import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import * as schema from "./schema/index.js";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(packageRoot, "../..");
const defaultDatabasePath = resolve(repoRoot, "storage/softbq.db");

export const databasePath = process.env.SOFTBQ_DB_PATH
  ? resolve(process.env.SOFTBQ_DB_PATH)
  : defaultDatabasePath;

mkdirSync(dirname(databasePath), { recursive: true });

export const sqlite = new Database(databasePath);
sqlite.pragma("foreign_keys = ON");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

export type SoftbqDatabase = typeof db;
