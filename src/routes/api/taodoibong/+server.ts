import type { RequestHandler } from "./$types";
import { db } from '$lib/server/db/client'
import { v4 as uuidv4 } from 'uuid'
import { DoiBong } from "$lib/server/db/schema/DoiBong";
import { CauThu } from "$lib/server/db/schema/CauThu";
import { ThamGiaDB } from "$lib/server/db/schema/ThamGiaDB";
import { DSMuaGiai } from "$lib/server/db/schema/DSMuaGiai";

export const GET: RequestHandler = async () => {
  return new Response();
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  console.log(data);
  // AYYYYYYYYY REMOVE MEEEEEEEEEEEEEEEEEEEE
  await db.insert(DSMuaGiai).values({ maMG: 1, tenMG: 'Gang Gang' });

  const maDoi : string = uuidv4();
  await db.insert(DoiBong).values({ maDoi: maDoi, tenDoi: data.tenDoiBong, sanNha: data.sanNha });

  data.danhSachCauThu.map(async (cauThu: any) => {
    const maCT = uuidv4();
    await db.insert(CauThu).values({
      maCT: maCT,
      tenCT: cauThu.ten,
      ngaySinh: new Date(),
      loaiCT: cauThu.loai,
      ghiChu: cauThu.ghiChu
    });
    await db.insert(ThamGiaDB).values({
      maDoi: maDoi,
      maCT: maCT,
      maMG: 1
    });
  })

  return new Response();
};
