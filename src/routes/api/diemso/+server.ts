
import { deleteDiemSo, insertDiemSo, selectAllDiemSo, updateDiemSo } from "$lib/server/db/functions/Data/DiemSo";
import type { DiemSo } from "$lib/typesDatabase";
import type { RequestHandler } from "./$types";

export const _GETDiemSo = async () => {
  return await selectAllDiemSo();
}

export const GET: RequestHandler = async ({ locals }) => {
  let result = await _GETDiemSo();
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
  let data : DiemSo = await request.json();

  if (data.maDS ?? null) {
    await updateDiemSo(data);
  }
  else{
    await insertDiemSo(data)
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
  if (data.maDS === null) {
    throw new Error("Không có mã sao xóa? bruh");
  }
  else {
    result = data.maDS;
    await deleteDiemSo(data.maDS);
  }

  return new Response(JSON.stringify({ maDS: result!! }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};