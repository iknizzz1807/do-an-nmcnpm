
import { deleteLoaiCT, insertLoaiCT, selectAllLoaiCT, updateLoaiCT } from "$lib/server/db/functions/Data/LoaiCT";
import type { LoaiCT } from "$lib/typesDatabase";
import type { RequestHandler } from "./$types";

export const _GETLoaiCT = async () => {
  return await selectAllLoaiCT();
}

export const GET: RequestHandler = async ({ locals }) => {
  let result = await _GETLoaiCT();
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

  let data : LoaiCT = await request.json();

  if (data.maLCT ?? null) {
    await updateLoaiCT(data);
  }
  else{
    await insertLoaiCT(data)
  }

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
  if (data.maLCT === null) {
    throw new Error("Không có mã sao xóa? bruh");
  }
  else {
    result = data.maLCT;
    await deleteLoaiCT(data.maLCT);
  }

  return new Response(JSON.stringify({ maLCT: result!! }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};