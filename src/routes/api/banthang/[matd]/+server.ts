import { isNumber } from "$lib";
import type { RequestHandler } from "./$types";
import { deleteBanThang, insertBanThang, selectAllBanThang, selectBanThang, updateBanThang } from "$lib/server/db/functions/BanThang";
import type { BanThang } from "$lib/typesDatabase";

export const GET: RequestHandler = async ({ params, locals }) => {
  const maTD = parseInt(params.matd);
  if (!isNumber(maTD))
    throw new Error("MaTD phải là số");
  const danhSachBanThang = await selectBanThang(maTD);

  return new Response(JSON.stringify(danhSachBanThang), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export const POST : RequestHandler = async({ request, locals, params } : { request: Request, locals: App.Locals, params: any }) => {
  const data = await request.json();
  if (!(data satisfies BanThang))
    throw new Error("Không thỏa mãn BanThang");
  if (params === "") 
    throw new Error("Param hiện là rỗng");
  console.log(params);
  let banThang : BanThang = {
    maBT: data.maBT,
    maTD: parseInt(params.matd),
    maCT: data.maCT,
    maDoi: data.maDoi,
    thoiDiem: parseInt(data.thoiDiem),
    loaiBanThang: data.loaiBanThang
  };
  console.log(banThang);
  
  if ((banThang.maBT ?? null) === null) {
    await insertBanThang(banThang).catch((err) => {
      throw err;
    });
  }
  else {
    await updateBanThang(banThang).catch((err) => {
      throw err;
    });
  }

  return new Response(JSON.stringify(banThang), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const DELETE : RequestHandler = async({ request, locals } : { request: Request, locals: App.Locals }) => {
  const data = await request.json();
  if (!(data satisfies BanThang)) {
    let banThang : BanThang = {
      maTD: data.maTD,
      maCT: data.maCT,
      maDoi: data.maDoi,
      thoiDiem: data.thoiDiem,
      loaiBanThang: data.loaiBanThang
    };
    await deleteBanThang(banThang);
    return new Response(JSON.stringify(banThang), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  else {
    throw new Error("Data không thỏa mã BanThang");
  }

}