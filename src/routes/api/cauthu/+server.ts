import type { RequestHandler } from "./$types";
import { deleteCauThu, insertCauThu, selectAllCauThu, updateCauThu } from "$lib/server/db/functions/CauThu";
import { insertThamGiaDB } from "$lib/server/db/functions/ThamGiaDB";
import type { CauThu } from "$lib/types";
import { error } from "@sveltejs/kit";

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
  let result: CauThu | null;
  // Hiện tại chỉ là sửa không có Thêm. U HEAR ME?
  if ((data.maCT ?? null) === null) {
    result = null;
    throw new Error("Hiện tại /cauthu chỉ phục vụ update");
  }
  else {
    const cauThu : CauThu = {
      maCT: data.maCT,
      tenCT: data.tenCT,
      loaiCT: data.loaiCT,
      ghiChu: data.ghiChu,
      nuocNgoai: data.nuocNgoai,
      ngaySinh: data.ngaySinh
    };
    await updateCauThu(cauThu).catch((err) => {
      throw err;
    });
    result = cauThu;
  }

  //Trả về response với danh sách cầu thủ vừa tạo và status 200 OK
  return new Response(JSON.stringify(result), {
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
  const data = await request.json();
  let result : number | null = null;

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
};