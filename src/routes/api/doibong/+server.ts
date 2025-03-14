import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db/client";
import { DoiBongTable, type InsertDoiBongParams } from "$lib/server/db/schema/DoiBong";
import { DSMuaGiaiTable } from "$lib/server/db/schema/DSMuaGiai";
import { deleteDoiBong, insertDoiBong, selectAllDoiBong } from "$lib/server/db/functions/DoiBong";
import type { DoiBong } from "$lib/types";

export const GET: RequestHandler = async ({ locals }) => {
  let danhSachDoiBong = await selectAllDoiBong();
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

  // Cái post request này để tạo đội bóng, response ok sẽ tiến hành trả về đội bóng mới vừa tạo
  const data = await request.json();
  // console.log(data);

  await db
    .insert(DSMuaGiaiTable)
    .values({ maMG: locals.muaGiai!!.maMG!!, tenMG: locals.muaGiai!!.tenMG })
    .onConflictDoNothing(); // Hard coded type shit =))

  // Thêm đội bóng mới vào danh sách các đội bóng
  const doiMoi : DoiBong = {
    tenDoi: data.tenDoi,
    sanNha: data.sanNha,
  };

  await insertDoiBong(doiMoi)

  // Trả về response với đội bóng vừa tạo và status 200 OK
  return new Response(JSON.stringify(doiMoi), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Delete DoiBong
export const DELETE: RequestHandler = async ({
  request,
}: {
  request: Request;
}) => {
  const data = await request.json();
  let result : number | null = null;

  console.log(data.maDoi);
  if ((data.maDoi) === null) {
    throw new Error("Không có mã đội sao xóa? bruh");
  }
  else {
    result = data.maDoi!!;
    await deleteDoiBong(data.maDoi!!);
  }

  return new Response(JSON.stringify({ maDoi: result!! }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};