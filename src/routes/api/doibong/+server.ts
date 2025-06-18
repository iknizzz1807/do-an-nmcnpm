import type { RequestHandler } from "./$types";
import { deleteDoiBong, insertDoiBong, selectDoiBongMuaGiai, updateDoiBong } from "$lib/server/db/functions/DoiBong";
import { errorResponseJSON } from "$lib";
import { insertSanNha, updateSanNha } from "$lib/server/db/functions/Data/SanNha";
import { updateMuaGiai } from "$lib/server/db/functions/MuaGiai";
import type { DoiBong } from "$lib/typesDatabase";
import { existsLichThiDauMaDoi } from "$lib/server/db/functions/LichThiDau";

export const _GETDoiBong = async(maMG: number) => {
  console.log(await selectDoiBongMuaGiai(maMG));
  return await selectDoiBongMuaGiai(maMG);
}

export const GET: RequestHandler = async ({ locals }) => {
  let danhSachDoiBong = await _GETDoiBong(locals.muaGiai!!.maMG!!);
  return new Response(JSON.stringify(danhSachDoiBong), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: RequestHandler = async ({
  request,
  locals
}: {
  request: Request;
  locals: App.Locals
}) => {
  if ((locals.muaGiai ?? null) === null)
    throw new Error("Không tìm thấy mùa giải");

  try {
    let data : DoiBong = await request.json();
    data.maMG = locals.muaGiai!!.maMG!!;

    let sanNha = null;
    if ((data.maSan ?? null) === null) {
      sanNha = await insertSanNha({
        tenSan: data.tenSan!!,
        diaChi: data.diaChi!!,
        maMG: data.maMG
      });
    }
    else {
      await updateSanNha({
        maSan: data.maSan!!,
        tenSan: data.tenSan!!,
        diaChi: data.diaChi!!,
        maMG: data.maMG
      });
    }
    if (sanNha !== null) {
      data.maSan = sanNha.at(0)!!.id;
    }

    if (data.maDoi ?? null) {
      await updateDoiBong(data);
    }
    else{
      await insertDoiBong(data);
    }
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  catch (err) {
    if (err instanceof Error)
      return errorResponseJSON(400, err.message);
    throw err;
  }

};

// Delete DoiBong
export const DELETE: RequestHandler = async ({
  request,
}: {
  request: Request;
}) => {
  
  try {
    
    const data = await request.json();
    let result : number | null = null;
    if ((await existsLichThiDauMaDoi(data.maDoi!!))) {
      throw new Error("Không thể xóa đội bóng này vì có lịch thi đấu đang diễn ra");
    }
    if ((data.maDoi) === null) {
      throw new Error("Không có mã đội sao xóa? bruh");
    }
    else {
      result = data.maDoi!!;
      await deleteDoiBong(data.maDoi!!);
    }
    return new Response(JSON.stringify({ maDoi: result!! }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  catch (error) {
    if (error instanceof Error)
      return errorResponseJSON(400, error.message);
    else
      throw error;
  }

};