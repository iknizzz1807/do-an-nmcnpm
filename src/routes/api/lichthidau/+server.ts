import { errorResponseJSON } from "$lib";
import { existsBanThangMaTD } from "$lib/server/db/functions/BanThang";
import { selectDoiBongMaDoi } from "$lib/server/db/functions/DoiBong";
import { deleteLichThiDau, insertLichThiDau, selectAllLichThiDauWithName, updateLichThiDau } from "$lib/server/db/functions/LichThiDau";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import type { LichThiDau } from "$lib/typesDatabase";
import { type RequestHandler } from "@sveltejs/kit";

export const _GETLichThiDau = async (maMG: number) => {
  return await selectAllLichThiDauWithName(maMG);
}

export const GET : RequestHandler = async({ locals }) => {
  if ((locals.muaGiai ?? null) === null)
    throw new Error("Không tìm thấy mùa giải");
  let dsLTD = await _GETLichThiDau(locals.muaGiai!!.maMG!!);
  return new Response(JSON.stringify(dsLTD), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    }
  });
}

export const POST : RequestHandler = async ({ request, locals } : { request: Request, locals: App.Locals }) => {
  const data = await request.json();
  if ((locals.muaGiai ?? null) === null) 
    throw new Error("Mùa giải là null");
  try {
    let lichThiDau : LichThiDau = {
      doiMot: data.doiMot,
      doiHai: data.doiHai,
      maVTD: data.maVTD,
      doiThang: data.doiThang,
      maMG: locals.muaGiai!!.maMG!!,
      maSan: 1, // Select ma san o duoi
      maTD: data.maTD,
      maTT: data.maTT,
      thoiGianDaThiDau: 0,
      ngayGioThucTe: new Date(data.ngayGioThucTe).toJSON(),
      ngayGioDuKien: new Date(data.ngayGioDuKien).toJSON(),
    };

    if (lichThiDau.ngayGioDuKien === "Invalid Date" || lichThiDau.ngayGioThucTe === "Invalid Date")
      throw new Error("Ngày giờ dự kiến hoặc thực tế không hợp lệ");
    if (lichThiDau.ngayGioDuKien!! > lichThiDau.ngayGioThucTe!!)
      throw new Error("Ngày giờ dự kiến không thể lớn hơn ngày giờ thực tế");
    
    const doiBongMot = await selectDoiBongMaDoi(lichThiDau.doiMot);
    const doiBongHai = await selectDoiBongMaDoi(lichThiDau.doiHai);

    if (doiBongMot === null || doiBongHai === null)
      throw new Error("Đội bóng không tồn tại");
    const doiDaTrenSanNha = await selectThamSo("doiDaTrenSanNha");
    lichThiDau.maSan = doiDaTrenSanNha === 1 ? doiBongMot.maSan : doiBongHai.maSan;
    console.log("Lich thi dau:", lichThiDau);

    if ((lichThiDau.maTD ?? null) === null) {
      lichThiDau.maTD = (await insertLichThiDau(lichThiDau)).at(0)!!.id;
    }
    else {
      await updateLichThiDau(lichThiDau);
    }
    
    return new Response(JSON.stringify(lichThiDau), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  catch (error) {
    if (error instanceof Error) 
      return errorResponseJSON(400, error.message);
    else
      throw error;
  }
}


export const DELETE : RequestHandler = async ({ request } : { request: Request }) => {
  
  try {
    
    const data = await request.json();
  
    let result : number | null = null;
    if (await existsBanThangMaTD(data.maTD!!)) {
      throw new Error("Không thể xóa lịch thi đấu này vì có bàn thắng đã được ghi nhận");
    }
    if ((data.maTD ?? null) === null) {
      throw new Error("Không có mã cầu thủ sao xóa? bruh");
    }
    else {
      result = data.maTD!!;
      await deleteLichThiDau(data.maTD!!);
    }
    
    return new Response(JSON.stringify({ maTD: result!! }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  catch (error) {
    if (error instanceof Error)
      return errorResponseJSON(400, error.message);
    else
      throw error;
  }
}

function selectBanThangMaTD(arg0: any) {
  throw new Error("Function not implemented.");
}
