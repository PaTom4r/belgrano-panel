import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres.jtumriuyllcueywbgcgv:BelgranoPanel2026@aws-0-us-west-2.pooler.supabase.com:5432/postgres",
  },
});
