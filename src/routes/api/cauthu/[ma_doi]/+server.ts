import type { RequestHandler } from "./$types";
import { deleteCauThu, selectCauThuDoiBong, selectCauThuMaCT, updateCauThu } from "$lib/server/db/functions/CauThu";
import { insertCauThu } from "$lib/server/db/functions/CauThu";
import { countThamGiaDB, isThamGiaDBExceedMax } from "$lib/server/db/functions/ThamGiaDB";
import type { CauThu } from "$lib/typesDatabase";
import { calculateAge, errorResponseJSON, isNumber } from "$lib";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import { selectAllLoaiCT, selectLoaiCTMaLCT } from "$lib/server/db/functions/Data/LoaiCT";
import dateFormat from "dateformat";
import { existsCauThuTGTD } from "$lib/server/db/functions/ThamGiaTD";

export const _GETCauThuMaDoi = async(ma_doi: string) => {
  const maDoi = parseInt(ma_doi);
  if (!isNumber(maDoi))
    throw new Error("Khong tim thay doi");
  return await selectCauThuDoiBong(maDoi);
}

export const GET: RequestHandler = async ({ params, locals }) => {
  if ((locals.muaGiai ?? null) === null)
    throw new Error("Không tìm thấy mùa giải");
  
  const danhSachCauThu = await _GETCauThuMaDoi(params.ma_doi);

  return new Response(JSON.stringify(danhSachCauThu), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: RequestHandler = async ({ request, params, locals }) => {
  let data: CauThu = await request.json();
  try {

    data.ngaySinh = dateFormat(data.ngaySinh, "isoDate");  

    const ctAge = calculateAge(new Date(data.ngaySinh));
    const tuoiMin = (await selectThamSo("tuoiMin"))!!;
    const tuoiMax = (await selectThamSo("tuoiMax"))!!;
    if (!(ctAge >= tuoiMin && ctAge <= tuoiMax)) 
      throw new Error("Cầu thủ có tuổi không hợp lệ")

    if ((locals.muaGiai ?? null) === null)
      throw new Error("Không tìm thấy mùa giải");

    const maDoi = parseInt(params.ma_doi);

    if (!Number.isFinite(maDoi))
      throw new Error("Không tìm thấy đội bóng");

    if (data.maLCT === null)
      throw new Error("Không có mã loại cầu thủ");
    
    data.maDoi = maDoi;
    if ((data.maCT ?? null) === null)  {
      if (data.maLCT && (await isThamGiaDBExceedMax(maDoi, data.maLCT))) {
        const lct = await selectLoaiCTMaLCT(data.maLCT);
        throw new Error("Đội bóng đã đạt đủ số cầu thủ tối đa của " + (lct?.tenLCT ?? ""));
      }

      const soCauThuMax = (await selectThamSo("soCauThuMax"))!!;
      if ((await countThamGiaDB(maDoi)) >= soCauThuMax)
        throw new Error("Đội bóng đã đạt đủ số cầu thủ tối đa");
      await insertCauThu(data);
    }
    else {

      const cauThu = await selectCauThuMaCT(data.maCT!!);
      if (cauThu === null)
        throw new Error("Không tìm thấy cầu thủ với mã " + data.maCT + " tên " + data.tenCT);
      if (cauThu.maLCT !== data.maLCT && (await isThamGiaDBExceedMax(data.maDoi, data.maLCT!!))) {
        const lct = await selectLoaiCTMaLCT(data.maLCT!!);
        throw new Error("Đội bóng đã đạt đủ số cầu thủ tối đa của " + (lct?.tenLCT ?? ""));
      }
      
      await updateCauThu(data);
    }
    
  } catch (error) {
    if (error instanceof Error)
      return errorResponseJSON(400, error.message);
    else 
      throw error
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Delete cầu thủ
export const DELETE: RequestHandler = async ({
  request,
}: {
  request: Request;
}) => {
  
  try {
    const data = await request.json();
    let result : number | null = null;
    if ((await existsCauThuTGTD(data.maCT!!)))
      throw new Error("Không thể xóa cầu thủ này vì có lịch thi đấu đang diễn ra");
    if ((data.maCT ?? null) === null) {
      throw new Error("Không có mã cầu thủ sao xóa? bruh");
    }
    else {
      result = data.maCT!!;
      await deleteCauThu(data.maCT!!);
    }
    return new Response(JSON.stringify({ maCT: result!! }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof Error)
      return errorResponseJSON(400, error.message);
    else 
      throw error;
  }
};