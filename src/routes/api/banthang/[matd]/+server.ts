import { isNumber } from "$lib";
import type { RequestHandler } from "./$types";
import { deleteBanThang, insertBanThang, selectAllBanThang, selectBanThang, updateBanThang } from "$lib/server/db/functions/BanThang";
import type { BanThang } from "$lib/typesDatabase";
import type { UpdateBanThang } from "$lib/typesResponse";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import { errorResponseJSON } from "$lib";
import { isCauThuInTranDau } from "$lib/server/db/functions/CauThu";

export const _GETBanThang = async (maTD: number) => {
  return await selectBanThang(maTD);
}

export const GET: RequestHandler = async ({ params, locals }) => {
  const maTD = parseInt(params.matd);
  if (!isNumber(maTD))
    throw new Error("MaTD phải là số");
  const danhSachBanThang = await _GETBanThang(maTD);

  return new Response(JSON.stringify(danhSachBanThang), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export const POST : RequestHandler = async({ request, locals, params } : { request: Request, locals: App.Locals, params: any }) => {
  const data = await request.json();
  if (!(data satisfies UpdateBanThang))
    return errorResponseJSON(400, "Không thỏa mãn UpdateBanThang");
  if (params === "") 
    return errorResponseJSON(400, "Param hiện là rỗng");
  console.log(data);
  let banThang : UpdateBanThang = {
    oldBanThang: (data.oldBanThang ?? null) === null ? null : {
      maTD: parseInt(params.matd),
      maCT: data.oldBanThang.maCT,
      maDoi: data.oldBanThang.maDoi,
      thoiDiem: data.oldBanThang.thoiDiem,
      maLBT: data.oldBanThang.maLBT
    },
    newBanThang: {
      maTD: parseInt(params.matd),
      maCT: data.newBanThang.maCT,
      maDoi: data.newBanThang.maDoi,
      thoiDiem: data.newBanThang.thoiDiem,
      maLBT: data.newBanThang.maLBT,
    }
  };
  
  const thoiDiemGhiBanToiThieu = (await selectThamSo("thoiDiemGhiBanToiThieu"))!!;
  const thoiDiemGhiBanToiDa = (await selectThamSo("thoiDiemGhiBanToiDa"))!!;
  if (banThang.newBanThang.thoiDiem > thoiDiemGhiBanToiDa ||
      banThang.newBanThang.thoiDiem < thoiDiemGhiBanToiThieu)
      return errorResponseJSON(400, "Thời điểm vượt quá thời điểm ghi bàn tối đa " + 
        thoiDiemGhiBanToiDa + " hoặc thời điểm ghi bàn tối thiểu" + thoiDiemGhiBanToiThieu);
  
  if (!isCauThuInTranDau(banThang.newBanThang.maTD, banThang.newBanThang.maCT)) {
    return errorResponseJSON(400, "Cầu thủ không ở trong trận đấu");
  }

  if ((banThang.oldBanThang ?? null) === null) {
    await insertBanThang(banThang.newBanThang).catch((err) => {
      throw err;
    });
  }
  else {
    await updateBanThang(banThang.oldBanThang!!, banThang.newBanThang).catch((err) => {
      throw err;
    });
  }

  return new Response(JSON.stringify(data.newBanThang), {
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
      maLBT: data.maLBT
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
    return errorResponseJSON(400, "Data không thỏa mã BanThang");
  }

}