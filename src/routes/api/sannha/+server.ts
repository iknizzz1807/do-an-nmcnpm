
import { deleteSanNha, insertSanNha, selectAllSanNha, updateSanNha } from "$lib/server/db/functions/Data/SanNha";
import type { SanNha } from "$lib/typesDatabase";
import type { RequestHandler } from "./$types";

export const _GETSanNha = async () => {
  return await selectAllSanNha();
}

export const GET: RequestHandler = async ({ locals }) => {
  let result = await _GETSanNha();
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
  let data : SanNha = await request.json();

  if ((data.maMG ?? null) === null)
  {
    data.maMG = locals.muaGiai!!.maMG!!;
  }

  if (data.maSan ?? null) {
    await updateSanNha(data);
  }
  else{
    await insertSanNha(data)
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
  
  const data : number | null = await request.json();
  let result : number | null = null;
  if ((data) === null) {
    throw new Error("Không có mã đội sao xóa? bruh");
  }
  else {
    result = data;
    await deleteSanNha(data);
  }

  return new Response(JSON.stringify({ maSan: result!! }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};