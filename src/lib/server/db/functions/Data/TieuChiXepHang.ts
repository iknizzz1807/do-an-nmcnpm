import type {  TieuChiXepHang } from "$lib/typesDatabase";
import { eq } from "drizzle-orm";
import { TieuChiXepHangTable } from "../../schema/Data/TieuChiXepHang";
import { db } from "../../client";

export const selectAllTieuChiXepHang = async () => {
  return (await db.select().from(TieuChiXepHangTable)) satisfies TieuChiXepHang[];
};

export const selectTieuChiXepHangMaTC = async (maTC: number) => {
  return ((await db.select().from(TieuChiXepHangTable)
    .where(eq(TieuChiXepHangTable.maTC, maTC)).limit(1)).at(0) ?? null) satisfies (TieuChiXepHang | null);
};


export const selectTieuChiXepHangTenTC = async (tenTC: string) => {
  return ((await db.select().from(TieuChiXepHangTable)
    .where(eq(TieuChiXepHangTable.tenTC, tenTC)).limit(1)).at(0) ?? null) satisfies (TieuChiXepHang | null);
};


export const insertTieuChiXepHang = async (...TieuChiXepHang: TieuChiXepHang[]) => {
    let returning = await db.insert(TieuChiXepHangTable).values(TieuChiXepHang).returning({ id: TieuChiXepHangTable.maTC });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo TieuChiXepHang: Insert khong duoc");
    return returning;
}

export const updateTieuChiXepHang = async(TieuChiXepHang: TieuChiXepHang) => {
  if ((TieuChiXepHang.maTC ?? null) == null)
    return;
  await db.update(TieuChiXepHangTable).set({
    tenTC: TieuChiXepHang.tenTC,
    uuTien: TieuChiXepHang.uuTien
  }).where(eq(TieuChiXepHangTable.maTC, TieuChiXepHang.maTC!!));
}

export const deleteTieuChiXepHang = async (maTC: number) => {
  await db.delete(TieuChiXepHangTable).where(eq(TieuChiXepHangTable.maTC, maTC));
}