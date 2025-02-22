import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db/client";
import { v4 as uuidv4 } from "uuid";
import { DoiBong } from "$lib/server/db/schema/DoiBong";
import { DSMuaGiai } from "$lib/server/db/schema/DSMuaGiai";

export const GET: RequestHandler = async () => {
  return new Response();
};

export const POST: RequestHandler = async ({
  request,
}: {
  request: Request;
}) => {
  // Cái post request này để tạo đội bóng, response ok sẽ tiến hành trả về đội bóng mới vừa tạo
  const data = await request.json();
  // console.log(data);

  await db.insert(DSMuaGiai).values({ maMG: 1, tenMG: "2025-2026" }); // Hard coded type shit =))

  // Thêm đội bóng mới vào danh sách các đội bóng
  const maDoi: string = uuidv4();
  const doiMoi = {
    maDoi: maDoi,
    tenDoi: data.tenDoi,
    sanNha: data.sanNha,
  };

  await db.insert(DoiBong).values(doiMoi);

  // Trả về response với đội bóng vừa tạo và status 200 OK
  return new Response(JSON.stringify(doiMoi), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
