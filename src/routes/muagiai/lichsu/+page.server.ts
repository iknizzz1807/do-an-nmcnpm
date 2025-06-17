import { db } from "$lib/server/db/client";
import { checkPageEditable } from "$lib/server/db/functions/User/UserRole";
import { MuaGiaiTableBackup } from "$lib/server/db/schema/MuaGiai";
import type { MuaGiai } from "$lib/typesDatabase";
import { desc } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, route, locals }) => {
  return {
    lichSu: (await db.select().from(MuaGiaiTableBackup).orderBy(desc(MuaGiaiTableBackup.modifiedDate)))
  }
}) satisfies PageServerLoad;
