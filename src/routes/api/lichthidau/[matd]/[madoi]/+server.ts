import type { RequestHandler } from "./$types";
import type { ThamGiaTD } from "$lib/typesDatabase";
import { insertThamGiaTD, selectCauThuTranDau } from "$lib/server/db/functions/ThamGiaTD";

export const GET: RequestHandler = async ({ params, locals }) => {
  const maTD = parseInt(params.matd);
  if (!Number.isFinite(maTD))
    throw new Error("Khong tim thay Trận đấu");
  const maDoi = parseInt(params.madoi);
  if (!Number.isFinite(maDoi))
    throw new Error("Khong tim thay Đội");

  const danhSachCauThu = await selectCauThuTranDau(maTD, maDoi);
  // console.log(danhSachCauThu);

  return new Response(JSON.stringify(danhSachCauThu), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: RequestHandler = async ({ request, params, locals }) => {
  const data: ThamGiaTD = await request.json();

  const maTD = parseInt(params.matd);
  if (!Number.isFinite(maTD))
    throw new Error("Khong tim thay Trận đấu");
  const maDoi = parseInt(params.madoi);
  if (!Number.isFinite(maDoi))
    throw new Error("Khong tim thay Đội");

  try {
    await insertThamGiaTD({
      maTD: maTD,
      maDoi: maDoi,
      maCT: data.maCT,
      viTri: data.viTri,
    });
  } catch (error) {
    throw error;
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
