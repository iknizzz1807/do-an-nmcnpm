import type { RequestHandler } from "./$types";
import { deleteDoiBong, insertDoiBong, selectDoiBongMuaGiai, updateDoiBong } from "$lib/server/db/functions/DoiBong";
import { errorResponseJSON } from "$lib";

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
    let data = await request.json();
    data.maMG = locals.muaGiai!!.maMG!!;
    
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
  const data = await request.json();
  let result : number | null = null;

  try {

    if ((data.maDoi) === null) {
      throw new Error("Không có mã đội sao xóa? bruh");
    }
    else {
      result = data.maDoi!!;
      await deleteDoiBong(data.maDoi!!);
    }
  }
  catch (error) {
    if (error instanceof Error)
      return errorResponseJSON(400, error.message);
    else
      throw error;
  }

  return new Response(JSON.stringify({ maDoi: result!! }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};