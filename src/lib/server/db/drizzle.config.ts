import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/lib/server/db/schema",
  dbCredentials: {
    url: process.env.SQLITE_DB_PATH || "src/database/db.sqlite",
  },
  out: "./src/lib/server/db/migrations",
});
