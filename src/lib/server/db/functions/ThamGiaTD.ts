import type { ThamGiaTD } from "$lib/types";
import { db } from "../client";
import { eq, and, getTableColumns } from "drizzle-orm";
import { ThamGiaTDTable } from "../schema/ThamGiaTD";
import { CauThuTable } from "../schema/CauThu";

// Return maCT
export const insertThamGiaTD = async (...thamGiaTD: ThamGiaTD[]) => {
  let returning = await db.insert(ThamGiaTDTable).values(thamGiaTD).returning({ id: ThamGiaTDTable.maCT });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo ThamGiaTD: Insert khong duoc");
    return returning;
};

// Todo: this is not the final version, there is something wrong with this
export const updateThamGiaTD = async(thamGiaTD: ThamGiaTD) => {
  await db.update(ThamGiaTDTable).set({
    maCT: thamGiaTD.maCT,
    maDoi: thamGiaTD.maDoi,
    viTri: thamGiaTD.viTri
  }).where(eq(ThamGiaTDTable.maTD, thamGiaTD.maTD!!))
}

export const selectAllThamGiaTD = async () => {
  return (await db.select().from(ThamGiaTDTable)) satisfies ThamGiaTD[];
};

export const selectCauThuTranDau = async(maTD: number, maDoi: number) => {
  return await db.select({ ...getTableColumns(CauThuTable) }).from(ThamGiaTDTable)
    .innerJoin(CauThuTable, eq(CauThuTable.maCT, ThamGiaTDTable.maCT))
    .where(and(eq(ThamGiaTDTable.maTD, maTD), eq(ThamGiaTDTable.maDoi, maDoi)));
}
