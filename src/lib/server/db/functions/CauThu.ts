import { eq, and, ilike, getTableColumns } from "drizzle-orm";
import { db } from "../client";
import { CauThuTable, CauThuTableBackup, type InsertCauThuBackupParams } from "../schema/CauThu";
import { ThamGiaDBTable } from "../schema/ThamGiaDB";
import { DoiBongTable } from "../schema/DoiBong";
import { BanThangTable } from "../schema/BanThang";
import { insertThamGiaDB } from "./ThamGiaDB";
import type { CauThu, KQTraCuuCauThu } from "$lib/types";

export const insertCauThu = async (...cauThu: CauThu[]) => {
  const returning = await db.transaction(async(tx) => {
      const insertedValues = await tx.insert(CauThuTable).values(cauThu).returning();
      
      if (insertedValues.length == 0)
        throw new Error("Đã có lỗi xảy ra: Hình như là xảy ra conflict khi insert. HOW?");

      const backUps = insertedValues.map((value) => {
          return {
              modifiedDate: new Date(),
              ...value
          } satisfies InsertCauThuBackupParams;
      }); // Insert vo backup

      return await tx
          .insert(CauThuTableBackup) // Backup
          .values(backUps)
          .returning({ id: CauThuTableBackup.maCT });
  });
  if (returning === null || returning.length === 0)
    throw new Error("Đã có lỗi xảy ra: Không thể thêm mới cầu thủ");
  return returning;
};

export const updateCauThu = async(cauThu: CauThu) => {
  if ((cauThu.maCT ?? null) == null)
    return null;
  return await db.transaction(async (tx) => {
      const updated = await tx.update(CauThuTable).set({
          tenCT: cauThu.tenCT,
          loaiCT: cauThu.loaiCT,
          ghiChu: cauThu.ghiChu,
          nuocNgoai: cauThu.nuocNgoai,
          ngaySinh: cauThu.ngaySinh
      }).where(eq(CauThuTable.maCT, cauThu.maCT!!)).returning();

      if (updated.length == 0)
        return null;
      
      await tx
          .insert(CauThuTableBackup)
          .values(updated.map((value) => {
              return {
                  modifiedDate: new Date(),
                  ...value
              } satisfies InsertCauThuBackupParams;
          }));
      return updated;
  });
}

export const selectAllCauThu = async () => {
  return (await db.select().from(CauThuTable)) satisfies CauThu[];
};

export const selectCauThuTen = async (tenCT: string) => {
  return (await db
    .select()
    .from(CauThuTable)
    .where(ilike(CauThuTable.maCT, tenCT))) satisfies CauThu[];
};

export const selectCauThuDoiBong = async (maMG: number, maDoi: number) => {
  return await db
    .select({
      ...getTableColumns(CauThuTable)
    })
    .from(CauThuTable)
    .innerJoin(
      ThamGiaDBTable,
      and(
        eq(ThamGiaDBTable.maCT, CauThuTable.maCT),
        eq(ThamGiaDBTable.maMG, maMG),
        eq(ThamGiaDBTable.maDoi, maDoi)
      )
    )
};

export const traCuuCauThu = async (tenCT: string) => {
  let ketQua: KQTraCuuCauThu[] = [];
  const cauThu = await db
    .select()
    .from(CauThuTable)
    .innerJoin(ThamGiaDBTable, eq(ThamGiaDBTable.maCT, CauThuTable.maCT))
    .innerJoin(DoiBongTable, eq(DoiBongTable.maDoi, ThamGiaDBTable.maDoi))
    .where(ilike(CauThuTable.tenCT, "%" + tenCT + "%"));
  cauThu.forEach(async (value) => {
    const tongSoBanThang = await db.$count(
      BanThangTable,
      eq(BanThangTable.maCT, value.CauThu.maCT)
    );
    ketQua.push({
      tenCT: value.CauThu.tenCT,
      tenDoi: value.DoiBong.tenDoi,
      loaiCT: value.CauThu.loaiCT,
      tongSoBanThang: tongSoBanThang,
    });
  });
  return ketQua;
};
