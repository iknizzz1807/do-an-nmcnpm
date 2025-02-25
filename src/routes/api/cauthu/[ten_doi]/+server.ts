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
  // Request bao gồm
  // const dataInput = {
  //   tenCT: tenCTInput,
  //   loaiCT: loaiCTInput,
  //   ghiChu: ghiChuInput,
  //   nuocNgoai: nuocNgoaiInput,
  //   ngaySinh: ngaySinhInput,
  // };
  const data: CauThu = await request.json();
  const newCT : CauThu = {
    tenCT: data.tenCT,
    loaiCT: data.loaiCT,
    ghiChu: data.ghiChu,
    nuocNgoai: data.nuocNgoai,
    ngaySinh: new Date(data.ngaySinh)
  }
  try {
    const maCT = await insertCauThu(data);

    const maDoi = await selectDoiBongTenTrung(params.ten_doi);

    await insertThamGiaDB({
      maDoi,
      maCT,
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
