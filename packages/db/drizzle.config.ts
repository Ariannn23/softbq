import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://postgres.eljvqudjvruckvftfijb:AAbq200423**@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
  }
});
