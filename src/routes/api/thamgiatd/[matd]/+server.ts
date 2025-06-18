import { errorResponseJSON, isNumber } from "$lib";
import { deleteThamGiaTD, insertThamGiaTD, upsertThamGiaTD } from "$lib/server/db/functions/ThamGiaTD";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import type { ThamGiaTD } from "$lib/typesDatabase";
import type { RequestHandler } from "./$types";

export const POST : RequestHandler = async ({ params, locals, request }) => {
  const data = await request.json();

  const maTD = parseInt(params.matd);
  try {

    if (!isNumber(maTD))
      throw new Error("matd param không đúng");
    if (!(data satisfies ThamGiaTD[]))
      throw new Error("data không thỏa mãn");
    const soCauThuTGTDMin = (await selectThamSo("soCauThuTGTDMin"))!!;
    const soCauThuTGTDMax = (await selectThamSo("soCauThuTGTDMax"))!!;
    const map = new Map<number, number>();
    for (const item of data) {
      map.set(item.maDoi, (map.get(item.maDoi) ?? 0) + 1);
    }
    map.keys().forEach((key) => {
      if (map.get(key)!! < soCauThuTGTDMin || map.get(key)!! > soCauThuTGTDMax)
        throw new Error(`Số lượng cầu thủ ${key} tham gia trận đấu phải nằm trong khoảng từ ${soCauThuTGTDMin} đến ${soCauThuTGTDMax}.`);
    });
    
    await deleteThamGiaTD(maTD);
    await upsertThamGiaTD(...data);
  } catch (err) {
    if (err instanceof Error)
      return errorResponseJSON(400, err.message);
    throw err;
  }
  
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}