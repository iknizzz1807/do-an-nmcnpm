import type { RequestHandler } from "./$types";
import { deleteCauThu, selectAllCauThuWithBanThang, selectCauThuMaCT, selectCauThuTGTD, updateCauThu } from "$lib/server/db/functions/CauThu";
import type { CauThu } from "$lib/typesDatabase";
import { calculateAge, errorResponseJSON } from "$lib";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import { countThamGiaDB, isThamGiaDBExceedMax } from "$lib/server/db/functions/ThamGiaDB";
import { selectAllLoaiCT, selectLoaiCTMaLCT } from "$lib/server/db/functions/Data/LoaiCT";
import { existsCauThuTGTD } from "$lib/server/db/functions/ThamGiaTD";
import { existsCauThuBanThang } from "$lib/server/db/functions/BanThang";

export const _GETCauThu = async() => {
  return await selectAllCauThuWithBanThang();
}

export const GET: RequestHandler = async ({locals}) => {
  const danhSachCauThu = await selectAllCauThuWithBanThang();
  return new Response(JSON.stringify(danhSachCauThu), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: RequestHandler = async ({
  request,
  locals
}: {
  request: Request;
  locals: App.Locals
}) => {
  const data : CauThu = await request.json();
  try {
    
    const ctAge = calculateAge(new Date(data.ngaySinh));
    const tuoiMin = (await selectThamSo("tuoiMin"))!!;
    const tuoiMax = (await selectThamSo("tuoiMax"))!!;
    if (!(ctAge >= tuoiMin && ctAge <= tuoiMax)) 
      throw new Error("Cầu thủ có tuổi không hợp lệ")

    if ((locals.muaGiai ?? null) === null)
      throw new Error("Không tìm thấy mùa giải");
    if (!Number.isFinite(data.maDoi))
      throw new Error("Khong tim thay doi");

    if ((data.maCT ?? null) === null)
      throw new Error("Hiện tại /cauthu chỉ phục vụ update");
    const cauThu = await selectCauThuMaCT(data.maCT!!);
    if (cauThu === null)
      throw new Error("Không tìm thấy cầu thủ với mã " + data.maCT + " tên " + data.tenCT);
    if (data.maLCT === null)
      throw new Error("Không có mã loại cầu thủ");

    if (cauThu.maLCT !== data.maLCT && (await isThamGiaDBExceedMax(data.maDoi, data.maLCT!!))) {
      const lct = await selectLoaiCTMaLCT(data.maLCT!!);
      throw new Error("Đội bóng đã đạt đủ số cầu thủ tối đa của " + (lct?.tenLCT ?? ""));
    }

    await updateCauThu(data);
      // await updateCauThu(data);
    
  }
  catch (error) {
    if (error instanceof Error)
      return errorResponseJSON(400, error.message);
    else 
      throw error;
  }
  
  //Trả về response với danh sách cầu thủ vừa tạo và status 200 OK
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
    if ((await existsCauThuBanThang(data.maCT!!)))
      throw new Error("Không thể xóa cầu thủ này vì có bàn thắng");
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