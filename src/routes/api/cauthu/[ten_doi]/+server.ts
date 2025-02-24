import type { RequestHandler } from "./$types";
import { selectCauThuDoiBong } from "$lib/server/db/functions/CauThu";
import { insertCauThu } from "$lib/server/db/functions/CauThu";
import { insertThamGiaDB } from "$lib/server/db/functions/ThamGiaDB";
import type { CauThu } from "$lib/types";

// Cái này chưa code xong mai code tiếp

export const GET: RequestHandler = async ({ params }) => {
  const danhSachCauThu = await selectCauThuDoiBong(0, params.ten_doi);

  return new Response(JSON.stringify(danhSachCauThu), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: RequestHandler = async ({ request, params }) => {
  const data: CauThu = await request.json();

  try {
    await insertCauThu(data);
    // await insertThamGiaDB(params.);
  } catch (error) {
    throw new Error(String(error));
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
