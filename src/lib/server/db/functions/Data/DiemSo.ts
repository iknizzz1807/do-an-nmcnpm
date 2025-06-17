import type { DiemSo } from "$lib/typesDatabase";
import { eq } from "drizzle-orm";
import { DiemSoTable } from "../../schema/Data/DiemSo";
import { db } from "../../client";



export const selectAllDiemSo = async () => {
  return (await db.select().from(DiemSoTable)) satisfies DiemSo[];
};

// TODO: this "ten" is very bad if can change this
export const selectDiemSoTen = async(ten: "Thắng" | "Hòa" | "Thua") => {
  return (await db.select().from(DiemSoTable).where(eq(DiemSoTable.tenDS, ten)).limit(1)).at(0);
}

export const insertDiemSo = async (...DiemSo: DiemSo[]) => {
    let returning = await db.insert(DiemSoTable).values(DiemSo).returning({ id: DiemSoTable.maDS });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo DiemSo: Insert khong duoc");
    return returning;
}

export const updateDiemSo = async(DiemSo: DiemSo) => {
  if ((DiemSo.maDS ?? null) == null)
    return;
  await db.update(DiemSoTable).set({
    // tenDS: DiemSo.tenDS,
    diemSo: DiemSo.diemSo
  }).where(eq(DiemSoTable.maDS, DiemSo.maDS!!));
}

export const deleteDiemSo = async (maDS: number) => {
  await db.delete(DiemSoTable).where(eq(DiemSoTable.maDS, maDS));
}