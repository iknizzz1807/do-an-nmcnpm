import { db } from "../client"
import { and, eq, getTableColumns, ne, or, sql } from "drizzle-orm"
import { LichThiDauTable } from "../schema/LichThiDau"
import { DoiBongTable } from "../schema/DoiBong";
import type { BangXepHangNgay } from "$lib/types";
import { CauThuTable } from "../schema/CauThu";
import { BanThangTable } from "../schema/BanThang";

export const selectBXHDoiNgay = async (ngay: Date) => {
  // Tat ca cac doi co tran co trung
  let result : BangXepHangNgay[] = [];

  const selectDoi = await db.select({
    doiMot: LichThiDauTable.doiMot,
    doiHai: LichThiDauTable.doiHai
    }).from(LichThiDauTable)
    .where(sql`date(${LichThiDauTable.ngayGio}) = date(${ngay.toJSON()})`)
    .groupBy(LichThiDauTable.doiMot, LichThiDauTable.doiHai);

  // Chuyen no thanh set
  const doiCoTranTrongNgay = new Set(selectDoi.flatMap((value) => [value.doiMot, value.doiHai]));
  for (const value of doiCoTranTrongNgay) {
    const doi = (await db.select({tenDoi: DoiBongTable.tenDoi}).from(DoiBongTable).where(eq(DoiBongTable.maDoi, value))).at(0);
    if (doi === undefined)
      throw new Error("Doi mot khong ton tai");

    const soTran = await db.$count(LichThiDauTable, or(eq(LichThiDauTable.doiMot, value), eq(LichThiDauTable.doiHai, value)));
    
    const soTranThang = await db.$count(LichThiDauTable, 
        and(
          or(eq(LichThiDauTable.doiMot, value), eq(LichThiDauTable.doiHai, value)), 
          eq(LichThiDauTable.doiThang, value))
        );

    const soTranThua = await db.$count(LichThiDauTable, 
      and(
        or(eq(LichThiDauTable.doiMot, value), eq(LichThiDauTable.doiHai, value)), 
        ne(LichThiDauTable.doiThang, value))
      );
    const doiBXH = {
      tenDoi: doi.tenDoi,
      soTran: soTran,
      soTranThang: soTranThang,
      soTranThua: soTranThua,
      soTranHoa: soTran - soTranThang - soTranThua,
      hieuSo: 0,
      hang: 0
    }
    // console.log(doiBXH);
    result.push(doiBXH);
  }
  return result;
}

export const selectCauThuGhiBan = async (maTD : number) => {
  return await db.select({
    maCT: CauThuTable.maCT, 
    tenCT: CauThuTable.tenCT, 
    tenDoi: DoiBongTable.tenDoi, 
    loaiCT: CauThuTable.loaiCT,
    soBanThang: sql<number>`count(*)`
  }).from(CauThuTable)
  .innerJoin(BanThangTable, and(eq(BanThangTable.maTD, maTD), eq(BanThangTable.maCT, CauThuTable.maCT)))
  .innerJoin(DoiBongTable, eq(DoiBongTable.maDoi, BanThangTable.maDoi))
  .groupBy(CauThuTable.maCT, CauThuTable.tenCT, DoiBongTable.tenDoi, CauThuTable.loaiCT);
}