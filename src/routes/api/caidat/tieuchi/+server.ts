
import { deleteTieuChiXepHang, insertTieuChiXepHang, selectAllTieuChiXepHang, updateTieuChiXepHang } from "$lib/server/db/functions/Data/TieuChiXepHang";
import type { TieuChiXepHang } from "$lib/typesDatabase";
import type { RequestHandler } from "./$types";

export const _GETTieuChiXepHang = async () => {
  return await selectAllTieuChiXepHang();
}

export const GET: RequestHandler = async ({ locals }) => {
  let result = await _GETTieuChiXepHang();
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

  let data : TieuChiXepHang = await request.json();

  if (data.maTC ?? null) {
    await updateTieuChiXepHang(data);
  }
  else{
    await insertTieuChiXepHang(data)
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
  if (data.maTC === null) {
    throw new Error("Không có mã sao xóa? bruh");
  }
  else {
    result = data.maTC;
    await deleteTieuChiXepHang(data.maTC);
  }

  return new Response(JSON.stringify({ maTC: result!! }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};