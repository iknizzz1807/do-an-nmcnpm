import type { RequestHandler } from "./$types";
import { selectCauThuDoiBong } from "$lib/server/db/functions/CauThu";
import { insertCauThu } from "$lib/server/db/functions/CauThu";
import { insertThamGiaDB } from "$lib/server/db/functions/ThamGiaDB";
import type { CauThu } from "$lib/types";
import { selectDoiBongTenTrung } from "$lib/server/db/functions/DoiBong";
import type { ThamGiaDB } from "$lib/types";

export const GET: RequestHandler = async ({ params }) => {
  const danhSachCauThu = await selectCauThuDoiBong(0, params.ten_doi);

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
    const maCT = await insertCauThu(data);
    if (maCT.length === 0)
      throw new Error("Khong tim thay cau thu");

    const maDoi = await selectDoiBongTenTrung(params.ten_doi);
    console.log(params.ten_doi);
    if (!Number.isFinite(maDoi))
      throw new Error("Khong tim thay doi");
    await insertThamGiaDB({
      maDoi: maDoi,
      maCT: maCT.at(0)?.id || -1,
      maMG: 0,
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
