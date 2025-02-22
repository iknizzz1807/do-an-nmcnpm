import type { Handle } from "@sveltejs/kit";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

export const handle: Handle = async ({ event, resolve }) => {
  const resp = await resolve(event);
  return resp;
};
