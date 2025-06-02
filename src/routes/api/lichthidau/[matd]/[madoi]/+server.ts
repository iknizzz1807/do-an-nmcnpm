import type { RequestHandler } from "./$types";
import type { ThamGiaTD } from "$lib/typesDatabase";
import { insertThamGiaTD, selectCauThuTranDau } from "$lib/server/db/functions/ThamGiaTD";
import { errorResponseJSON } from "$lib";


export const _GETLichThiDauMaDoi = async (maTD : number, maDoi : number) => {
  return await selectCauThuTranDau(maTD, maDoi);
}

export const GET: RequestHandler = async ({ params, locals }) => {
  try {

    const maTD = parseInt(params.matd);
    if (!Number.isFinite(maTD))
      throw new Error("Khong tim thay Trận đấu");
    const maDoi = parseInt(params.madoi);
    if (!Number.isFinite(maDoi))
      throw new Error("Khong tim thay Đội");
    
    const danhSachCauThu = await _GETLichThiDauMaDoi(maTD, maDoi);
    // console.log(danhSachCauThu);
    
    return new Response(JSON.stringify(danhSachCauThu), {
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

export const POST: RequestHandler = async ({ request, params, locals }) => {
  const data: ThamGiaTD = await request.json();


  try {
    const maTD = parseInt(params.matd);
    if (!Number.isFinite(maTD))
      throw new Error("Khong tim thay Trận đấu");
    const maDoi = parseInt(params.madoi);
    if (!Number.isFinite(maDoi))
      throw new Error("Khong tim thay Đội");

    await insertThamGiaTD({
      maTD: maTD,
      maDoi: maDoi,
      maCT: data.maCT,
      maVT: data.maVT,
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
