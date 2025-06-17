
import { deleteViTri, insertViTri, selectAllViTri, updateViTri } from "$lib/server/db/functions/Data/ViTri";
import type { ViTri } from "$lib/typesDatabase";
import type { RequestHandler } from "./$types";

export const _GETViTri = async () => {
  return await selectAllViTri();
}

export const GET: RequestHandler = async ({ locals }) => {
  let result = await _GETViTri();
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

  let data : ViTri = await request.json();

  if (data.maVT ?? null) {
    await updateViTri(data);
  }
  else{
    await insertViTri(data)
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
  if (data.maVT === null) {
    throw new Error("Không có mã sao xóa? bruh");
  }
  else {
    result = data.maVT;
    await deleteViTri(data.maVT);
  }

  return new Response(JSON.stringify({ maVT: result!! }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};