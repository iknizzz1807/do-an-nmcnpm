import type { RequestHandler } from "./$types";
import { insertCauThu, selectAllCauThu } from "$lib/server/db/functions/CauThu";
import { insertThamGiaDB } from "$lib/server/db/functions/ThamGiaDB";
import type { CauThu } from "$lib/types";
import { selectDoiBongTenTrung } from "$lib/server/db/functions/DoiBong";

export const GET: RequestHandler = async () => {
  const danhSachCauThu = await selectAllCauThu();
  return new Response(JSON.stringify(danhSachCauThu), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: RequestHandler = async ({
  request,
}: {
  request: Request;
}) => {
  // Phần body của post request được gửi tới có bao gồm:
  // - danhSachCauThu là danh sách của các cầu thủ
  // - maDoi là mã đội bóng mà các cầu thủ đó thuộc về
  // Data này là bao gồm danh sách các cầu thủ và mã đội mà những cầu thủ đó thuộc về
  const data = await request.json();

  const danhSachCauThu = data.danhSachCauThu;
  const maDoi = await selectDoiBongTenTrung(data.ten_doi);

  const danhSachCauThuTraVe = []; // Cái này có tác dụng để cập nhật UI

  for (const cauThu of danhSachCauThu) {
    // let maCT = -1;

    const cauThuMoi: CauThu = {
      tenCT: cauThu.ten,
      ngaySinh: new Date().toJSON(),
      loaiCT: cauThu.loai,
      ghiChu: cauThu.ghiChu,
      nuocNgoai: 0,
    };
    const returning = await insertCauThu(cauThuMoi);
    const maCT = returning[0].id;
    console.log(maCT);
    await insertThamGiaDB({
      maDoi: maDoi,
      maCT: maCT,
      maMG: 1,
    });
    danhSachCauThuTraVe.push({
      maCT: maCT,
      tenCT: cauThu.ten,
      ngaySinh: new Date(),
      loaiCT: cauThu.loai,
      ghiChu: cauThu.ghiChu,
      nuocNgoai: 0,
    });
  }

  //Trả về response với danh sách cầu thủ vừa tạo và status 200 OK
  return new Response(JSON.stringify(danhSachCauThuTraVe), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
