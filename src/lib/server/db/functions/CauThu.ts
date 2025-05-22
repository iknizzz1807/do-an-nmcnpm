import { eq, and, ilike, getTableColumns, sql, sum, gt } from "drizzle-orm";
import { db } from "../client";
import { CauThuTable } from "../schema/CauThu";
import { DoiBongTable } from "../schema/DoiBong";
import { BanThangTable } from "../schema/BanThang";
import type { CauThu } from "$lib/typesDatabase";
import type { KQTraCuuCauThu } from "$lib/typesResponse";
import { ThamGiaTDTable } from "../schema/ThamGiaTD";
import { LoaiBTTable } from "../schema/Data/LoaiBT";
import { ViTriTable } from "../schema/Data/ViTri";

export const insertCauThu = async (...cauThu: CauThu[]) => {
  let returning = await db.insert(CauThuTable).values(cauThu).returning({ id: CauThuTable.maCT });
  if (returning === null || returning.length === 0)
      throw new Error("Co gi do sai sot trong luc add vo CauThu: Insert khong duoc");
  return returning;
};

export const updateCauThu = async(cauThu: CauThu) => {
  if ((cauThu.maCT ?? null) == null) 
    throw new Error("maCT không tồn tại");
  await db.update(CauThuTable).set({
      tenCT: cauThu.tenCT,
      maLCT: cauThu.maLCT,
      ghiChu: cauThu.ghiChu,
      ngaySinh: cauThu.ngaySinh,
      maDoi: cauThu.maDoi
  }).where(eq(CauThuTable.maCT, cauThu.maCT!!));
}

export const deleteCauThu = async(maCT: number) => {
  // await db.delete(BanThangTable).where(eq(BanThangTable.maCT, maCT));
  // await db.delete(ThePhatTable).where(eq(ThePhatTable.maCT, maCT));
  // await db.delete(ThamGiaDBTable).where(eq(ThamGiaDBTable.maCT, maCT));
  await db.delete(CauThuTable).where(eq(CauThuTable.maCT, maCT));
}

export const selectAllCauThu = async () => {
  return (await db.select().from(CauThuTable)) satisfies CauThu[];
};

export const selectAllCauThuWithBanThang = async () => {
  let ctWithBT = (await db.select({ 
    ...getTableColumns(CauThuTable),
    banThang: sql<number>`sum(CASE WHEN ${LoaiBTTable.diemBT} > 0 THEN ${LoaiBTTable.diemBT} END )`
  }).from(CauThuTable)
  .leftJoin(BanThangTable, eq(BanThangTable.maCT, CauThuTable.maCT))
  .leftJoin(LoaiBTTable, eq(LoaiBTTable.maLBT, BanThangTable.maLBT))
  .groupBy(CauThuTable.maCT)
  ) satisfies CauThu[];
  for (let ct of ctWithBT) ct.banThang = ct.banThang ?? 0;
  return ctWithBT;
};

export const selectCauThuTen = async (tenCT: string) => {
  return (await db
    .select()
    .from(CauThuTable)
    .where(ilike(CauThuTable.maCT, tenCT))) satisfies CauThu[];
};

export const selectCauThuTGTD = async (maTD: number, maDoi: number) => {
  return await db
    .select({cauThu: getTableColumns(CauThuTable), viTri: getTableColumns(ViTriTable)})
    .from(CauThuTable)
    .innerJoin(ThamGiaTDTable, 
      and(
      eq(ThamGiaTDTable.maTD, maTD), 
      eq(ThamGiaTDTable.maDoi, maDoi), 
      eq(ThamGiaTDTable.maCT, CauThuTable.maCT)))
    .innerJoin(ViTriTable, eq(ViTriTable.maVT, ThamGiaTDTable.maVT))
    .groupBy(CauThuTable.maCT);
}

export const selectCauThuDoiBong = async (maDoi: number) => {
  return await db
    .select(getTableColumns(CauThuTable))
    .from(CauThuTable)
    .where(eq(CauThuTable.maDoi, maDoi))
};

export const isCauThuInTranDau = async (maTD: number, maCT : number) => {
  return (await db
    .select()
    .from(ThamGiaTDTable)
    .where(and(eq(ThamGiaTDTable.maTD, maTD), eq(ThamGiaTDTable.maCT, maCT)))).length > 0;
}

export const traCuuCauThu = async (tenCT: string) => {
  let ketQua: KQTraCuuCauThu[] = [];
  const cauThu = await db
    .select()
    .from(CauThuTable)
    .innerJoin(DoiBongTable, eq(DoiBongTable.maDoi, CauThuTable.maDoi))
    .where(ilike(CauThuTable.tenCT, "%" + tenCT + "%"));
  cauThu.forEach(async (value) => {
    const tongSoBanThang = await db.$count(
      BanThangTable,
      eq(BanThangTable.maCT, value.CauThu.maCT)
    );
    ketQua.push({
      tenCT: value.CauThu.tenCT,
      tenDoi: value.DoiBong.tenDoi,
      maLCT: value.CauThu.maLCT,
      tongSoBanThang: tongSoBanThang,
    });
  });
  return ketQua;
};
