import { deleteLichThiDau, insertLichThiDau, selectAllLichThiDau, selectAllLichThiDauWithName, updateLichThiDau } from "$lib/server/db/functions/LichThiDau";
import type { LichThiDau } from "$lib/types";
import type { RequestHandler } from "@sveltejs/kit";

export const GET : RequestHandler = async() => {
  let dsLTD = await selectAllLichThiDauWithName();
  return new Response(JSON.stringify(dsLTD), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    }
  });
}

export const POST : RequestHandler = async ({ request } : { request: Request }) => {
  const data = await request.json();
  console.log(data);
  let lichThiDau : LichThiDau = {
    doiMot: parseInt(data.doiMot),
    doiHai: parseInt(data.doiHai),
    vongThiDau: parseInt(data.vongThiDau),
    maMG: parseInt(data.maMG),
    ngayGio: new Date(data.ngayGio).toJSON(),
  };
  if ((data.maTD ?? null) === null) {
    await insertLichThiDau(lichThiDau).catch((err) => {
      throw err;
    });
  }
  else {
    lichThiDau.maTD = parseInt(data.maTD!!);
    await updateLichThiDau(lichThiDau).catch((err) => {
      throw err;
    });
  }

  return new Response(JSON.stringify(lichThiDau), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}


export const DELETE : RequestHandler = async ({ request } : { request: Request }) => {
  const data = await request.json();

  let result : number | null = null;

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