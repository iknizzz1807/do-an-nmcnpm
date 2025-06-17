import { eq } from "drizzle-orm"
import { db } from "../client"
import { ThamSoTable } from "../schema/ThamSo"
import type { Settings } from "$lib/typesAuth";

export const updateThamSo = async (tenThamSo: string, giaTri : number) => {
  await db.update(ThamSoTable).set({ giaTri: giaTri }).where(eq(ThamSoTable.tenThamSo, tenThamSo));
}

export const selectThamSo = async(tenThamSo : string) => {
  return (await db.select().from(ThamSoTable).where(eq(ThamSoTable.tenThamSo, tenThamSo))).at(0)?.giaTri ?? null;
}

export const selectSettings = async() => {
  return {
    tuoiMin: (await selectThamSo("tuoiMin"))!!,
    tuoiMax: (await selectThamSo("tuoiMax"))!!,
    soCauThuMin: (await selectThamSo("soCauThuMin"))!!,
    soCauThuMax: (await selectThamSo("soCauThuMax"))!!,
    soCauThuTGTDMax: (await selectThamSo("soCauThuTGTDMax"))!!,
    doiDaTrenSanNha: (await selectThamSo("doiDaTrenSanNha"))!!,
    thoiDiemGhiBanToiThieu: (await selectThamSo("thoiDiemGhiBanToiThieu"))!!,
    thoiDiemGhiBanToiDa: (await selectThamSo("thoiDiemGhiBanToiDa"))!!,
  } satisfies Settings;
}

export const updateSettings = async(settings: Settings) => {
  await updateThamSo("tuoiMin", settings.tuoiMin);
  await updateThamSo("tuoiMax", settings.tuoiMax);
  await updateThamSo("soCauThuMin", settings.soCauThuMin);
  await updateThamSo("soCauThuMax", settings.soCauThuMax);
  await updateThamSo("soCauThuTGTDMax", settings.soCauThuMax);
  await updateThamSo("doiDaTrenSanNha", settings.doiDaTrenSanNha);
  await updateThamSo("thoiDiemGhiBanToiThieu", settings.thoiDiemGhiBanToiThieu);
  await updateThamSo("thoiDiemGhiBanToiDa", settings.thoiDiemGhiBanToiDa);
}