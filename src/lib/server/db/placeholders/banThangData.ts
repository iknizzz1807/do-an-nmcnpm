import { db } from '../client'
import { eq, and, getTableColumns } from 'drizzle-orm'
import { LichThiDauTable } from "../schema/LichThiDau"
import { CauThuTable } from '../schema/CauThu'
import { ThamGiaDBTable } from '../schema/ThamGiaDB'
import { randIntBetween } from '$lib/server/utils'
import { BanThangTable } from '../schema/BanThang'
import type { BanThang } from '$lib/types'

export const generateBanThang = async (maTD: number, soBTDoiMot: number = 5, soBTDoiHai: number = 5) => {
  if (soBTDoiMot == 0 || soBTDoiHai == 0)
    throw new Error("soBT generate khong the bang 0");
  const lichThiDau = (await db.select().from(LichThiDauTable).where(eq(LichThiDauTable.maTD, maTD))).at(0);
  if (lichThiDau === undefined)
    throw new Error("Khong tim thay lich thi dau");
  const cauThusDoi1 = await db.select({
    ...getTableColumns(CauThuTable)
  })
    .from(CauThuTable)
    .innerJoin(ThamGiaDBTable, 
      and(eq(ThamGiaDBTable.maCT, CauThuTable.maCT), 
        eq(ThamGiaDBTable.maDoi, lichThiDau.doiMot)));
  const cauThusDoi2 = await db.select({
    ...getTableColumns(CauThuTable)
  })
    .from(CauThuTable)
    .innerJoin(ThamGiaDBTable, 
      and(eq(ThamGiaDBTable.maCT, CauThuTable.maCT), 
        eq(ThamGiaDBTable.maDoi, lichThiDau.doiHai)));
  const n1 = Math.max(soBTDoiMot, cauThusDoi1.length - 1);
  for (let i = 0; i < n1; i++) {
    const cauThu = cauThusDoi1.at(randIntBetween(0, cauThusDoi1.length - 1));
    if (cauThu === undefined)
      throw new Error("Khong the xac dinh duoc cau thu");
    const banThang : BanThang = {
      maTD: lichThiDau.maTD,
      maDoi: lichThiDau.doiMot,
      maCT: cauThu.maCT,
      thoiDiem: 90 * i / n1,
      loaiBanThang: "CC"
    }
    await db.insert(BanThangTable).values(banThang);
  }
  const n2 = Math.max(soBTDoiMot, cauThusDoi2.length - 1);
  for (let i = 0; i < n2; i++) {
    const cauThu = cauThusDoi2.at(randIntBetween(0, cauThusDoi2.length - 1));
    if (cauThu === undefined)
      throw new Error("Khong the xac dinh duoc cau thu");
    const banThang : BanThang = {
      maTD: lichThiDau.maTD,
      maDoi: lichThiDau.doiMot,
      maCT: cauThu.maCT,
      thoiDiem: 90 * i / (n2 + 1),
      loaiBanThang: "CC"
    }
    await db.insert(BanThangTable).values(banThang);
  }
}