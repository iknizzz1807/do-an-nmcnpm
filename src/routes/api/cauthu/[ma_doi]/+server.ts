import type { RequestHandler } from "./$types";
import { selectCauThuDoiBong } from "$lib/server/db/functions/CauThu";
import { insertCauThu } from "$lib/server/db/functions/CauThu";
import { insertThamGiaDB } from "$lib/server/db/functions/ThamGiaDB";
import type { CauThu } from "$lib/types";

export const GET: RequestHandler = async ({ params }) => {
  const danhSachCauThu = await selectCauThuDoiBong(0, params.ma_doi);

  return new Response(JSON.stringify(danhSachCauThu), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: RequestHandler = async ({ request, params }) => {

  const data: CauThu = await request.json();
  try {
    const maCT = (await insertCauThu(data)).at(0);
    if (maCT === undefined || !Number.isFinite(maCT.id))
      throw new Error("Khong tim thay cau thu");
  
    const maDoi = parseInt(params.ma_doi);
    if (!Number.isFinite(maDoi))
      throw new Error("Khong tim thay doi");
    await insertThamGiaDB({
      maDoi: maDoi,
      maCT: maCT.id,
      maMG: 1,
    }); // Hardcoded mã mùa giải là 1
  } catch (error) {
    // throw new Error(String(error));
    console.error(error);
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
