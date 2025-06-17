
import { deleteVongTD, insertVongTD, selectAllVongTD, updateVongTD } from "$lib/server/db/functions/Data/VongTD";
import type { VongTD } from "$lib/typesDatabase";
import type { RequestHandler } from "./$types";

export const _GETVongTD = async () => {
  return await selectAllVongTD();
}

export const GET: RequestHandler = async ({ locals }) => {
  let result = await _GETVongTD();
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

  let data : VongTD = await request.json();

  if (data.maVTD ?? null) {
    await updateVongTD(data);
  }
  else{
    await insertVongTD(data)
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
  if (data.maVTD === null) {
    throw new Error("Không có mã sao xóa? bruh");
  }
  else {
    result = data.maVTD;
    await deleteVongTD(data.maVTD);
  }

  return new Response(JSON.stringify({ maVTD: result!! }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};