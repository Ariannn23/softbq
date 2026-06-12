import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema/index.js";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.eljvqudjvruckvftfijb:AAbq200423**@aws-1-us-east-2.pooler.supabase.com:5432/postgres";

export const queryClient = postgres(connectionString, { prepare: false });

export const db = drizzle(queryClient, { schema });

export type SoftbqDatabase = typeof db;
