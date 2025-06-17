import { db } from "$lib/server/db/client";
import { desc, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { _GETSanNha } from "../../api/sannha/+server";
import { selectAllLoaiCT } from "$lib/server/db/functions/Data/LoaiCT";
import { CauThuTableBackup } from "$lib/server/db/schema/CauThu";

export const load = (async ({ fetch, route, locals }) => {
  return {
    lichSu: (await db.select().from(CauThuTableBackup).orderBy(desc(CauThuTableBackup.modifiedDate))),
    loaiCTs: await selectAllLoaiCT(),
  }
}) satisfies PageServerLoad;
