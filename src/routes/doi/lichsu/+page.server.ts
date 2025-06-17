import { db } from "$lib/server/db/client";
import { desc, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { DoiBongTableBackup } from "$lib/server/db/schema/DoiBong";
import { _GETSanNha } from "../../api/sannha/+server";

export const load = (async ({ fetch, route, locals }) => {
  return {
    lichSu: (await db.select()
      .from(DoiBongTableBackup)
      .where(eq(DoiBongTableBackup.maMG, locals.muaGiai?.maMG!!))
      .orderBy(desc(DoiBongTableBackup.modifiedDate))),
    danhSachSanNha: await _GETSanNha(),
  }
}) satisfies PageServerLoad;
