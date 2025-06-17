
import { deleteLoaiBT, insertLoaiBT, selectAllLoaiBT, updateLoaiBT } from "$lib/server/db/functions/Data/LoaiBT";
import type { LoaiBT } from "$lib/typesDatabase";
import type { RequestHandler } from "./$types";

export const _GETLoaiBT = async () => {
  return await selectAllLoaiBT();
}

export const GET: RequestHandler = async ({ locals }) => {
  let result = await _GETLoaiBT();
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

  let data : LoaiBT = await request.json();

  if (data.maLBT ?? null) {
    await updateLoaiBT(data);
  }
  else{
    await insertLoaiBT(data)
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
  if (data.maLBT === null) {
    throw new Error("Không có mã sao xóa? bruh");
  }
  else {
    result = data.maLBT;
    await deleteLoaiBT(data.maLBT);
  }

  return new Response(JSON.stringify({ maLBT: result!! }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};