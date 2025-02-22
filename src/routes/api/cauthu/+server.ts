import type { RequestHandler } from "./$types";
import { CauThu } from "$lib/server/db/schema/CauThu";
import { ThamGiaDB } from "$lib/server/db/schema/ThamGiaDB";
import { db } from "$lib/server/db/client";
import { v4 as uuidv4 } from "uuid";

export const GET: RequestHandler = async () => {
  return new Response();
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
  const maDoi = data.Madoi;

  const danhSachCauThuTraVe = []; // Cái này có tác dụng để cập nhật UI

  for (const cauThu of danhSachCauThu) {
    const maCT = uuidv4();
    const cauThuMoi = {
      maCT: maCT,
      tenCT: cauThu.ten,
      ngaySinh: new Date(),
      loaiCT: cauThu.loai,
      ghiChu: cauThu.ghiChu,
    };
    await db.insert(CauThu).values(cauThuMoi);
    await db.insert(ThamGiaDB).values({
      maDoi: maDoi,
      maCT: maCT,
      maMG: 1,
    });
    danhSachCauThuTraVe.push(cauThuMoi);
  }

  //Trả về response với danh sách cầu thủ vừa tạo và status 200 OK
  return new Response(JSON.stringify(danhSachCauThuTraVe), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
