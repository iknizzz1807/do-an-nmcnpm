import { db } from "$lib/server/db/client";
import { desc, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { CauThuTableBackup } from "$lib/server/db/schema/CauThu";
import { isNumber } from "$lib";
import { selectAllLoaiCT } from "$lib/server/db/functions/Data/LoaiCT";

export const load = (async ({ fetch, route, locals, params }) => {
  try {

    if (!params.ma_doi)
      throw new Error("Mã đội không được cung cấp");
    const maDoi = parseInt(params.ma_doi);
    if (!isNumber(maDoi))
      throw new Error("Mã đội phải là một số");
    return {
      lichSu: (await db.select()
      .from(CauThuTableBackup)
      .where(eq(CauThuTableBackup.maDoi, maDoi))
      .orderBy(desc(CauThuTableBackup.modifiedDate))),
      loaiCTs: await selectAllLoaiCT(),
    }
  }
  catch (error) {
    console.error("Error fetching data:", error);
    return {
      lichSu: [],
      loaiCTs: [],
    };
  }
}) satisfies PageServerLoad;
