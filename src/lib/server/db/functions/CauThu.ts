import { eq, and, ilike, getTableColumns } from "drizzle-orm";
import { db } from "../client";
import { CauThuTable } from "../schema/CauThu";
import { ThamGiaDBTable } from "../schema/ThamGiaDB";
import { DoiBongTable } from "../schema/DoiBong";
import { BanThangTable } from "../schema/BanThang";
import { insertThamGiaDB } from "./ThamGiaDB";
import type { CauThu, KQTraCuuCauThu } from "$lib/types";

export const insertCauThu = async (...cauThu: CauThu[]) => {
  let returning = await db
    .insert(CauThuTable)
    .values(cauThu)
    .returning({ id: CauThuTable.maCT });
  if (returning === null || returning.length === 0)
    throw new Error("Đã có lỗi xảy ra: Không thể thêm mới cầu thủ");
  return returning;
};

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
