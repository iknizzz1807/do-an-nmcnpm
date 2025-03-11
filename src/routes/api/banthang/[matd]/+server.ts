import { isNumber } from "$lib";
import type { RequestHandler } from "./$types";
import { checkBanThangExists, deleteBanThang, insertBanThang, selectAllBanThang, selectBanThang, updateBanThang } from "$lib/server/db/functions/BanThang";
import type { BanThang } from "$lib/types";

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

export const POST : RequestHandler = async({ request } : { request: Request }) => {
  const data = await request.json();
  console.log(data);
  if (!(data satisfies BanThang))
    throw new Error("Không thỏa mãn BanThang");
  let banThang : BanThang = {
    maTD: data.maTD,
    maCT: data.maCT,
    maDoi: data.maDoi,
    thoiDiem: data.thoiDiem,
    loaiBanThang: data.loaiBanThang
  };
  
  if (await !checkBanThangExists(banThang)) {
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

export const DELETE : RequestHandler = async({ request } : { request: Request }) => {
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