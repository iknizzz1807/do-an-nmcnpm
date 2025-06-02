import { errorResponseJSON } from "$lib";
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
      maSan: 1,
      maTD: data.maTD,
      maTT: data.maTT,
      thoiGianDaThiDau: 0,
      ngayGioThucTe: new Date(data.ngayGioThucTe).toJSON(),
      ngayGioDuKien: new Date(data.ngayGioDuKien).toJSON(),
    };
    
    const doiBongMot = await selectDoiBongMaDoi(lichThiDau.doiMot);
    const doiBongHai = await selectDoiBongMaDoi(lichThiDau.doiHai);
    if (doiBongMot === null || doiBongHai === null)
      throw new Error("Đội bóng không tồn tại");
    const doiDaTrenSanNha = await selectThamSo("doiDaTrenSanNha");
    lichThiDau.maSan = doiDaTrenSanNha === 1 ? doiBongMot.maSan : doiBongHai.maSan;
    
    if ((lichThiDau.maTD ?? null) === null) {
      await insertLichThiDau(lichThiDau);
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
  const data = await request.json();

  let result : number | null = null;

  try {

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