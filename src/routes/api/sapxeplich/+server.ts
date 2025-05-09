import { db } from "$lib/server/db/client";
import { insertLichThiDau } from "$lib/server/db/functions/LichThiDau";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import { LichThiDauTable } from "$lib/server/db/schema/LichThiDau";
import { TrongTaiTable } from "$lib/server/db/schema/TrongTai";
import { randIntBetween } from "$lib/server/utils";
import type { DoiBong, LichThiDau } from "$lib/typesDatabase";
import type { RequestHandler } from "./$types";


const sapXepLichThiDau = async (maMG: number, doiBongs: DoiBong[]) => {
  let ids : number[] = [];
  const trongTais = await db.select().from(TrongTaiTable);
  if (trongTais.length == 0)
    throw new Error("Không có trọng tài nào hết");
  
  while(doiBongs.length >= 2) {
      const doiMotIndex = randIntBetween(0, doiBongs.length - 1);
      const doiHaiIndex = randIntBetween(0, doiBongs.length - 1);
      if (doiMotIndex == doiHaiIndex)
        continue;
      const doiDaTrenSanNha = await selectThamSo("doiDaTrenSanNha");
      const lichThiDau : LichThiDau = {
        maMG: maMG,
        maVTD: randIntBetween(1, 2),
        maSan: doiDaTrenSanNha === 1 ? doiBongs[doiMotIndex].maSan : doiBongs[doiHaiIndex].maSan,

        doiHai: doiBongs[doiHaiIndex].maDoi!!,
        doiMot: doiBongs[doiMotIndex].maDoi!!,
        doiThang: null,
        
        ngayGioDuKien: new Date().toJSON(),
        ngayGioThucTe: new Date().toJSON(),
        
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

  if (!(data satisfies DoiBong[]))
    throw new Error("Không thỏa mãn");
  sapXepLichThiDau(locals.muaGiai!!.maMG!!, data);

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}