import type { RequestHandler } from "./$types";
import { selectCauThuDoiBong } from "$lib/server/db/functions/CauThu";
import { insertCauThu } from "$lib/server/db/functions/CauThu";
import { countThamGiaDB, countThamGiaDBNuocNgoai, insertThamGiaDB } from "$lib/server/db/functions/ThamGiaDB";
import type { CauThu } from "$lib/typesDatabase";
import { calculateAge, errorResponseJSON } from "$lib";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";

export const GET: RequestHandler = async ({ params, locals }) => {
  const maDoi = parseInt(params.ma_doi);
  if (!Number.isFinite(maDoi))
    throw new Error("Khong tim thay doi");
  if ((locals.muaGiai ?? null) === null)
    throw new Error("Không tìm thấy mùa giải");
  
  const danhSachCauThu = await selectCauThuDoiBong(maDoi);
  // console.log(danhSachCauThu);

  return new Response(JSON.stringify(danhSachCauThu), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: RequestHandler = async ({ request, params, locals }) => {
  const data: CauThu = await request.json();
  try {
    if ((data.maCT ?? null) !== null) 
      throw new Error("Cầu thủ đã tồn tại");

    const ctAge = calculateAge(new Date(data.ngaySinh));
    const tuoiMin = (await selectThamSo("tuoiMin"))!!;
    const tuoiMax = (await selectThamSo("tuoiMax"))!!;
    if (!(ctAge >= tuoiMin && ctAge <= tuoiMax)) 
      throw new Error("Cầu thủ có tuổi không hợp lệ")
    const maCT = (await insertCauThu(data)).at(0);

    if (maCT === undefined || !Number.isFinite(maCT.id))
      throw new Error("Khong tim thay cau thu");

    if ((locals.muaGiai ?? null) === null)
      throw new Error("Không tìm thấy mùa giải");
  
    const maDoi = parseInt(params.ma_doi);

    if (!Number.isFinite(maDoi))
      throw new Error("Khong tim thay doi");

    const soCauThuMax = (await selectThamSo("soCauThuMax"))!!;
    if ((await countThamGiaDB(locals.muaGiai?.maMG!!, maDoi)) >= soCauThuMax)
      throw new Error("Đội bóng đã đạt đủ số cầu thủ tối đa");
    // TODO
    // if ((await countThamGiaDBNuocNgoai(locals.muaGiai?.maMG!!, maDoi)) >= soCauThuNuocNgoaiToiDa)
    //   throw new Error("Đội bóng đã đạt đủ số cầu thủ nước ngoài tối đa");


    await insertThamGiaDB({
      maDoi: maDoi,
      maCT: maCT.id,
      maMG: locals.muaGiai!!.maMG!!,
    });
  } catch (error) {
    if (error instanceof Error)
      return errorResponseJSON(400, error.message);
    else 
      throw error;
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
