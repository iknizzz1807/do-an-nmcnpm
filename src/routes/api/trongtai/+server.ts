
import { deleteTrongTai, insertTrongTai, selectAllTrongTai, updateTrongTai } from "$lib/server/db/functions/Data/TrongTai";
import type { TrongTai } from "$lib/typesDatabase";
import type { RequestHandler } from "./$types";

export const _GETTrongTai = async () => {
  return await selectAllTrongTai();
}

export const GET: RequestHandler = async ({ locals }) => {
  let result = await _GETTrongTai();
  return new Response(JSON.stringify(result), {
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

  // Cái post request này để tạo sân nhà, response ok sẽ tiến hành trả về sân nhà mới vừa tạo
  let data : TrongTai = await request.json();

  if ((data.maMG ?? null) === null) {
    data.maMG = locals.muaGiai!!.maMG!!;
  }

  if (data.maTT ?? null) {
    await updateTrongTai(data);
  }
  else{
    await insertTrongTai(data)
  }

  // Trả về response với sân nhà vừa tạo và status 200 OK
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const DELETE: RequestHandler = async ({
  request,
}: {
  request: Request;
}) => {
  
  const data = await request.json();
  let result : number | null = null;
  if ((data) === null) {
    throw new Error("Không có mã sao xóa? bruh");
  }
  else {
    result = data.maTT;
    await deleteTrongTai(result!!);
  }

  return new Response(JSON.stringify({ maTT: result!! }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};