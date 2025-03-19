import { deleteDSMuaGiai, insertDSMuaGiai, selectAllDSMuaGiai, updateDSMuaGiai } from "$lib/server/db/functions/DSMuaGiai";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({locals}) => {
  let dsMuaGiai = await selectAllDSMuaGiai();
  return new Response(JSON.stringify(dsMuaGiai), {
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

  // Cái post request này để tạo đội bóng, response ok sẽ tiến hành trả về đội bóng mới vừa tạo
  const data = await request.json();
  console.log(data);

  if (data.maMG ?? null) {
    await updateDSMuaGiai(data);
  }
  else{
    await insertDSMuaGiai(data)
  }

  // Trả về response với đội bóng vừa tạo và status 200 OK
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
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
    await deleteDSMuaGiai(data.maMG!!);
  }

  return new Response(JSON.stringify({ maMG: result!! }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};