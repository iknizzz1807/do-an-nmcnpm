import { errorResponseJSON } from "$lib";
import { deleteMuaGiai, insertMuaGiai, selectAllMuaGiai, updateMuaGiai } from "$lib/server/db/functions/MuaGiai";
import type { MuaGiai } from "$lib/typesDatabase";
import type { RequestHandler } from "@sveltejs/kit";
import dateFormat from "dateformat";

export const _GETMuaGiai = async () => {
  return await selectAllMuaGiai();
}

export const GET: RequestHandler = async ({locals}) => {
  let MuaGiai = await _GETMuaGiai();
  return new Response(JSON.stringify(MuaGiai), {
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

  try {
    
    // Cái post request này để tạo đội bóng, response ok sẽ tiến hành trả về đội bóng mới vừa tạo
    let data : MuaGiai = await request.json();
    console.log(data);
    data.ngayDienRa = dateFormat(data.ngayDienRa, "isoDate");
    data.ngayKetThuc = dateFormat(data.ngayKetThuc, "isoDate");
    if (data.ngayDienRa === "Invalid Date" || data.ngayKetThuc === "Invalid Date")
      throw new Error("Ngày diễn ra hoặc ngày kết thúc không hợp lệ");
    if (data.ngayDienRa > data.ngayKetThuc)
      throw new Error("Ngày diễn ra không thể lớn hơn ngày kết thúc");

    if (data.maMG ?? null) {
      await updateMuaGiai(data);
    }
    else{
      await insertMuaGiai(data)
    }

    // Trả về response với đội bóng vừa tạo và status 200 OK
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return errorResponseJSON(400, error.message);
    }
    else throw error;
  }
};

// Delete DoiBong
export const DELETE: RequestHandler = async ({
  request,
}: {
  request: Request;
}) => {
  const data = await request.json();
  let result : number | null = null;

  console.log(data.maMG);
  if ((data.maMG) === null) {
    throw new Error("Không có mã đội sao xóa? bruh");
  }
  else {
    result = data.maMG!!;
    await deleteMuaGiai(data.maMG!!);
  }

  return new Response(JSON.stringify({ maMG: result!! }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};