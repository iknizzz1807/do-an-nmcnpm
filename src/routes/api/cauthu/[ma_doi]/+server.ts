import type { RequestHandler } from "./$types";
import { selectCauThuDoiBong } from "$lib/server/db/functions/CauThu";
import { insertCauThu } from "$lib/server/db/functions/CauThu";
import { countThamGiaDB, countThamGiaDBNuocNgoai, insertThamGiaDB } from "$lib/server/db/functions/ThamGiaDB";
import type { CauThu } from "$lib/typesDatabase";
import { calculateAge, errorResponseJSON } from "$lib";

export const GET: RequestHandler = async ({ params, locals }) => {
  const maDoi = parseInt(params.ma_doi);
  if (!Number.isFinite(maDoi))
    throw new Error("Khong tim thay doi");
  if ((locals.muaGiai ?? null) === null)
    throw new Error("Không tìm thấy mùa giải");
  const danhSachCauThu = await selectCauThuDoiBong(locals.muaGiai!!.maMG!!, maDoi);
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
    if (!(ctAge >= locals.setting.tuoiMin && ctAge <= locals.setting.tuoiMax)) 
      throw new Error("Cầu thủ có tuổi không hợp lệ")
    const maCT = (await insertCauThu(data)).at(0);

    if (maCT === undefined || !Number.isFinite(maCT.id))
      throw new Error("Khong tim thay cau thu");

    if ((locals.muaGiai ?? null) === null)
      throw new Error("Không tìm thấy mùa giải");
  
    const maDoi = parseInt(params.ma_doi);

    if (!Number.isFinite(maDoi))
      throw new Error("Khong tim thay doi");

    if ((await countThamGiaDB(locals.muaGiai?.maMG!!, maDoi)) >= locals.setting.soCauThuMax)
      throw new Error("Đội bóng đã đạt đủ số cầu thủ tối đa");
    if ((await countThamGiaDBNuocNgoai(locals.muaGiai?.maMG!!, maDoi)) >= locals.setting.soCauThuNuocNgoaiToiDa)
      throw new Error("Đội bóng đã đạt đủ số cầu thủ nước ngoài tối đa");


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
