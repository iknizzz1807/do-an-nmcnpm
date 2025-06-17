import { errorResponseJSON } from "$lib";
import { db } from "$lib/server/db/client";
import { insertLichThiDau } from "$lib/server/db/functions/LichThiDau";
import { selectMuaGiaiMaMG } from "$lib/server/db/functions/MuaGiai";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import { LichThiDauTable } from "$lib/server/db/schema/LichThiDau";
import { TrongTaiTable } from "$lib/server/db/schema/TrongTai";
import { randDateBetween, randIntBetween } from "$lib/server/utils";
import type { DoiBong, LichThiDau } from "$lib/typesDatabase";
import type { RequestHandler } from "./$types";


const sapXepLichThiDau = async (maMG: number, doiBongs: DoiBong[]) => {
  let ids : number[] = [];
  const trongTais = await db.select().from(TrongTaiTable);
  if (trongTais.length == 0)
    throw new Error("Không có trọng tài nào hết");
  const muaGiai = await selectMuaGiaiMaMG(maMG);
  if (muaGiai === null)
    throw new Error("Không có mùa giải nào hết");
  while(doiBongs.length >= 2) {
      const doiMotIndex = randIntBetween(0, doiBongs.length - 1);
      const doiHaiIndex = randIntBetween(0, doiBongs.length - 1);
      if (doiMotIndex == doiHaiIndex)
        continue;
      const doiDaTrenSanNha = await selectThamSo("doiDaTrenSanNha");
      const ngayGioThucTe = randDateBetween(new Date(muaGiai!!.ngayDienRa), new Date(muaGiai!!.ngayKetThuc)).toJSON();
      const lichThiDau : LichThiDau = {
        maMG: maMG,
        maVTD: randIntBetween(1, 2),
        maSan: doiDaTrenSanNha === 1 ? doiBongs[doiMotIndex].maSan : doiBongs[doiHaiIndex].maSan,

        doiHai: doiBongs[doiHaiIndex].maDoi!!,
        doiMot: doiBongs[doiMotIndex].maDoi!!,
        doiThang: null,
        
        ngayGioDuKien: ngayGioThucTe,
        ngayGioThucTe: ngayGioThucTe,
        
        thoiGianDaThiDau: 90,
        maTT: trongTais[randIntBetween(0, trongTais.length - 1)].maTT
      }
      doiBongs.splice(doiMotIndex, 1);

      await insertLichThiDau(lichThiDau).then(
          (value) => ids.push(...value.map((val) => val.id)),
          (err) => { if (err) throw err; }
      ); 
  }
  return ids;
}

export const POST: RequestHandler = async ({ request, locals }) => {
  const data : any[] = await request.json();

  try {

    if (!(data satisfies DoiBong[]))
      throw new Error("Không thỏa mãn");
    sapXepLichThiDau(locals.muaGiai!!.maMG!!, data);
    
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof Error) 
      return errorResponseJSON(500, error.message);
    else
      throw error;
  }
}