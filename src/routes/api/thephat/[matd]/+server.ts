import { isNumber } from "$lib";
import type { RequestHandler } from "./$types";
import { deleteThePhat, insertThePhat, selectAllThePhat, selectThePhat, updateThePhat } from "$lib/server/db/functions/ThePhat";
import type { ThePhat } from "$lib/typesDatabase";
import type { UpdateThePhat } from "$lib/typesResponse";

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
  if (!(data satisfies UpdateThePhat))
    throw new Error("Không thỏa mãn UpdateThePhat");
  if (params === "") 
    throw new Error("Param hiện là rỗng");

  const thePhat : UpdateThePhat = {
    oldThePhat: (data.oldThePhat ?? null) === null ? null : {
      maTD: parseInt(params.matd),
      maCT: data.oldThePhat.maCT,
      maDoi: data.oldThePhat.maDoi,
      thoiDiem: data.oldThePhat.thoiDiem,
      loaiThe: data.oldThePhat.loaiThe,
    },
    newThePhat: {
      maTD: parseInt(params.matd),
      maCT: data.newThePhat.maCT,
      maDoi: data.newThePhat.maDoi,
      thoiDiem: data.newThePhat.thoiDiem,
      loaiThe: data.newThePhat.loaiThe,
    }
  };
  console.log(thePhat);
  

  if ((thePhat.oldThePhat ?? null) === null) {
    await insertThePhat(thePhat.newThePhat).catch((err) => {
      throw err;
    });
  }
  else {
    await updateThePhat(thePhat.oldThePhat!!, thePhat.newThePhat).catch((err) => {
      throw err;
    });
  }

  return new Response(JSON.stringify(thePhat.newThePhat), {
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