import { db } from "../client"
import { and, eq, inArray, ne, or, sql } from "drizzle-orm"
import { LichThiDauTable } from "../schema/LichThiDau"
import { DoiBongTable } from "../schema/DoiBong";
import { CauThuTable } from "../schema/CauThu";
import { BanThangTable } from "../schema/BanThang";
import type { BangXepHangNgay } from "$lib/typesResponse";
import { ThamGiaTDTable } from "../schema/ThamGiaTD";

export const selectBXHDoiNgay = async (ngay: Date) => {
  // Tat ca cac doi co tran co trung
  let result : BangXepHangNgay[] = [];

  const selectDoi = await db.select({
    doiMot: LichThiDauTable.doiMot,
    doiHai: LichThiDauTable.doiHai
    }).from(LichThiDauTable)
    .where(sql`date(${LichThiDauTable.ngayGioThucTe}) = date(${ngay.toJSON()})`)
    .groupBy(LichThiDauTable.doiMot, LichThiDauTable.doiHai);

  // Chuyen no thanh set
  const doiCoTranTrongNgay = new Set(selectDoi.flatMap((value) => [value.doiMot, value.doiHai]));
  for (const value of doiCoTranTrongNgay) {
    const doi = (await db.select({maDoi: DoiBongTable.maDoi, tenDoi: DoiBongTable.tenDoi})
                  .from(DoiBongTable).where(eq(DoiBongTable.maDoi, value))).at(0);
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
      maDoi: doi.maDoi,
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

export const selectCauThuGhiBan = async (ngay: Date, maDoi : number) => {
  const lichThiDaus = (await db.select({ maTD: LichThiDauTable.maTD}).from(LichThiDauTable).where(and(
      sql`date(${LichThiDauTable.ngayGioThucTe}) = date(${ngay.toJSON()})`,
      or(
        eq(LichThiDauTable.doiMot, maDoi), 
        eq(LichThiDauTable.doiHai, maDoi)
      )
    ))).map((val => val.maTD));
  const cauThus = await db.select({ maCT: BanThangTable.maCT }).from(BanThangTable)
    .innerJoin(ThamGiaTDTable, and(eq(ThamGiaTDTable.maTD, BanThangTable.maTD), eq(ThamGiaTDTable.maCT, BanThangTable.maCT)))
    .where(
      and(
        inArray(BanThangTable.maTD, lichThiDaus), 
        eq(ThamGiaTDTable.maDoi, maDoi)
      )
    )
    .groupBy(BanThangTable.maCT);
  let result = [];
  for (const cauThu of cauThus) {
    let ct = (await db.select({
      maCT: CauThuTable.maCT,
      tenCT: CauThuTable.tenCT,
      maDoi: DoiBongTable.maDoi,
      tenDoi: DoiBongTable.tenDoi,
      maLCT: CauThuTable.maLCT,
      soBanThang: db.$count(BanThangTable, 
        and(eq(BanThangTable.maCT, cauThu.maCT), 
            inArray(BanThangTable.maTD, lichThiDaus)
          )
        )
    })
      .from(CauThuTable)
      .innerJoin(DoiBongTable, eq(DoiBongTable.maDoi, maDoi))
      .where(eq(CauThuTable.maCT, cauThu.maCT)).limit(1)).at(0);
    result.push(ct);
  }
  return result;
}