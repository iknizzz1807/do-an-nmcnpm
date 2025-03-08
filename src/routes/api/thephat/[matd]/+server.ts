import { isNumber } from "$lib";
import type { RequestHandler } from "./$types";
import { checkThePhatExists, deleteThePhat, insertThePhat, selectThePhat, updateThePhat } from "$lib/server/db/functions/ThePhat";
import type { ThePhat } from "$lib/types";

export const GET: RequestHandler = async ({ params }) => {
  const maTD = parseInt(params.matd);
  if (!isNumber(maTD))
    throw new Error("MaTD phải là số");
  const danhSachThePhat = await selectThePhat(maTD);

  return new Response(JSON.stringify(danhSachThePhat), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export const POST : RequestHandler = async({ request } : { request: Request }) => {
  const data = await request.json();
  console.log(data);
  if (!(data satisfies ThePhat))
    throw new Error("Không thỏa mãn ThePhat");
  let ThePhat : ThePhat = {
    maTD: data.maTD,
    maCT: data.maCT,
    maDoi: data.maDoi,
    thoiDiem: data.thoiDiem,
    loaiThe: data.loaiThe
  };
  
  if (await !checkThePhatExists(ThePhat)) {
    await insertThePhat(ThePhat).catch((err) => {
      throw err;
    });
  }
  else {
    await updateThePhat(ThePhat).catch((err) => {
      throw err;
    });
  }

  return new Response(JSON.stringify(ThePhat), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const DELETE : RequestHandler = async({ request } : { request: Request }) => {
  const data = await request.json();
  if (!(data satisfies ThePhat)) {
    let ThePhat : ThePhat = {
      maTD: data.maTD,
      maCT: data.maCT,
      maDoi: data.maDoi,
      thoiDiem: data.thoiDiem,
      loaiThe: data.loaiThe
    };
    await deleteThePhat(ThePhat);
    return new Response(JSON.stringify(ThePhat), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  else {
    throw new Error("Data không thỏa mã ThePhat");
  }

}