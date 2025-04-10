import { eq } from "drizzle-orm"
import { db } from "../client"
import { ThamSoTable } from "../schema/ThamSo"
import type { Settings } from "$lib/typesAuth";

export const updateThamSo = async (key: string, value : number) => {
  await db.update(ThamSoTable).set({ value: value }).where(eq(ThamSoTable.key, key));
}

export const selectThamSo = async(key : string) => {
  return (await db.select().from(ThamSoTable).where(eq(ThamSoTable.key, key))).at(0)?.value ?? null;
}

export const selectSettings = async() => {
  return {
    tuoiMin: (await selectThamSo("tuoiMin"))!!,
    tuoiMax: (await selectThamSo("tuoiMax"))!!,
    soCauThuMin: (await selectThamSo("soCauThuMin"))!!,
    soCauThuMax: (await selectThamSo("soCauThuMax"))!!,
    soCauThuNuocNgoaiToiDa: (await selectThamSo("soCauThuNuocNgoaiToiDa"))!!,
    doiDaTrenSanNha: (await selectThamSo("doiDaTrenSanNha"))!!,
    loaiBanThang: (await selectThamSo("loaiBanThang"))!!,
    thoiDiemGhiBanToiDa: (await selectThamSo("thoiDiemGhiBanToiDa"))!!,
    soThePhatToiDa: (await selectThamSo("soThePhatToiDa"))!!,
    diemThang: (await selectThamSo("diemThang"))!!,
    diemHoa: (await selectThamSo("diemHoa"))!!,
    diemThua: (await selectThamSo("diemThua"))!!
  } satisfies Settings;
}

export const updateSettings = async(settings: Settings) => {
  await updateThamSo("tuoiMin", settings.tuoiMin);
  await updateThamSo("tuoiMax", settings.tuoiMax);
  await updateThamSo("soCauThuMin", settings.soCauThuMin);
  await updateThamSo("soCauThuMax", settings.soCauThuMax);
  await updateThamSo("soCauThuNuocNgoaiToiDa", settings.soCauThuNuocNgoaiToiDa);
  await updateThamSo("doiDaTrenSanNha", settings.doiDaTrenSanNha);
  await updateThamSo("loaiBanThang", settings.loaiBanThang);
  await updateThamSo("thoiDiemGhiBanToiDa", settings.thoiDiemGhiBanToiDa);
  await updateThamSo("soThePhatToiDa", settings.soThePhatToiDa);
  await updateThamSo("diemThang", settings.diemThang);
  await updateThamSo("diemHoa", settings.diemHoa);
  await updateThamSo("diemThua", settings.diemThua);
}