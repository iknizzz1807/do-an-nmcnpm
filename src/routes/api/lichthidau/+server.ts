import { deleteLichThiDau, insertLichThiDau, selectAllLichThiDau, selectAllLichThiDauWithName, updateLichThiDau } from "$lib/server/db/functions/LichThiDau";
import type { LichThiDau } from "$lib/types";
import { fail, type RequestHandler } from "@sveltejs/kit";

export const GET : RequestHandler = async({ locals }) => {
  if ((locals.muaGiai ?? null) === null)
    throw new Error("Không tìm thấy mùa giải");
  let dsLTD = await selectAllLichThiDauWithName(locals.muaGiai!!.maMG!!);
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
  let lichThiDau : LichThiDau = {
    doiMot: parseInt(data.doiMot),
    doiHai: parseInt(data.doiHai),
    vongThiDau: parseInt(data.vongThiDau),
    doiThang: parseInt(data.doiThang),
    maMG: locals.muaGiai!!.maMG!!,
    maTD: data.maTD,
    ngayGio: new Date(data.ngayGio).toJSON(),
  };

  console.log(lichThiDau);

  if ((lichThiDau.maTD ?? null) === null) {
    await insertLichThiDau(lichThiDau).catch((err) => {
      throw err;
    });
  }
  else {
    console.log(lichThiDau.maTD);
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