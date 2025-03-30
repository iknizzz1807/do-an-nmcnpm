import { isNumber } from "$lib";
import type { RequestHandler } from "./$types";
import { deleteThePhat, insertThePhat, selectAllThePhat, selectThePhat, updateThePhat } from "$lib/server/db/functions/ThePhat";
import type { ThePhat } from "$lib/typesDatabase";

export const GET: RequestHandler = async ({ params, locals }) => {
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

export const POST : RequestHandler = async({ request, locals, params } : { request: Request, locals: App.Locals, params: any }) => {
  const data = await request.json();
  if (!(data satisfies ThePhat))
    throw new Error("Không thỏa mãn ThePhat");
  if (params === "") 
    throw new Error("Param hiện là rỗng");

  let thePhat : ThePhat = {
    maTP: data.maTP,
    maTD: parseInt(params.matd),
    maCT: data.maCT,
    maDoi: data.maDoi,
    thoiDiem: parseInt(data.thoiDiem),
    loaiThe: data.loaiThe
  };
  
  if ((thePhat.maTP ?? null) === null) {
    await insertThePhat(thePhat).catch((err) => {
      throw err;
    });
  }
  else {
    await updateThePhat(thePhat).catch((err) => {
      throw err;
    });
  }

  return new Response(JSON.stringify(thePhat), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const DELETE : RequestHandler = async({ request, locals } : { request: Request, locals: App.Locals }) => {
  const data = await request.json();
  if (!(data satisfies ThePhat)) {
    let thePhat : ThePhat = {
      maTD: data.maTD,
      maCT: data.maCT,
      maDoi: data.maDoi,
      thoiDiem: data.thoiDiem,
      loaiThe: data.loaiThe
    };
    await deleteThePhat(thePhat);
    return new Response(JSON.stringify(thePhat), {
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