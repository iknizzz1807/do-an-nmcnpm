import { db } from "../client"
import { and, eq, inArray, isNotNull, ne, or, sql } from "drizzle-orm"
import { LichThiDauTable } from "../schema/LichThiDau"
import { DoiBongTable } from "../schema/DoiBong";
import { CauThuTable } from "../schema/CauThu";
import { BanThangTable } from "../schema/BanThang";
import type { BangXepHangNgay, CauThuGhiBan } from "$lib/typesResponse";
import { ThamGiaTDTable } from "../schema/ThamGiaTD";

export const selectBXHDoiNgay = async (ngay: Date) => {
  // Tat ca cac doi co tran co trung
  let result : BangXepHangNgay[] = [];
  const comparationDate = sql`date(${LichThiDauTable.ngayGioThucTe}) = date(${ngay.toJSON()})`;

  const selectDoi = await db.select({
    doiMot: LichThiDauTable.doiMot,
    doiHai: LichThiDauTable.doiHai
    }).from(LichThiDauTable)
    .where(comparationDate)
    .groupBy(LichThiDauTable.doiMot, LichThiDauTable.doiHai);

  // Chuyen no thanh set
  const doiCoTranTrongNgay = new Set(selectDoi.flatMap((value) => [value.doiMot, value.doiHai]));
  for (const value of doiCoTranTrongNgay) {
    const doi = (await db.select({maDoi: DoiBongTable.maDoi, tenDoi: DoiBongTable.tenDoi})
                  .from(DoiBongTable).where(eq(DoiBongTable.maDoi, value))).at(0) ?? null;
    if ((doi) === null)
      throw new Error("Doi mot khong ton tai");

    const soTran = await db.$count(LichThiDauTable, 
      and(
        comparationDate,
        or(
          eq(LichThiDauTable.doiMot, value), 
          eq(LichThiDauTable.doiHai, value)
        )
      )
    );
    
    const soTranThang = await db.$count(LichThiDauTable, 
        and(
          comparationDate,
          eq(LichThiDauTable.doiThang, value))
        );

    const soTranThua = await db.$count(LichThiDauTable, 
      and(
        comparationDate,
        or(
          eq(LichThiDauTable.doiMot, value), 
          eq(LichThiDauTable.doiHai, value)
        ),
        ne(LichThiDauTable.doiThang, value),
        isNotNull(LichThiDauTable.doiThang)
      ));

    const soBanThang = (await db.select({soBanThang: sql<number>`count(${BanThangTable.maCT})`})
      .from(BanThangTable)
      .innerJoin(CauThuTable, eq(CauThuTable.maCT, BanThangTable.maCT))
      .innerJoin(LichThiDauTable, eq(LichThiDauTable.maTD, BanThangTable.maTD))
      .where(and(comparationDate, eq(CauThuTable.maDoi, value)))
      .groupBy(CauThuTable.maDoi)).at(0) ?? {soBanThang: 0};
    const doiBXH: BangXepHangNgay = {
      maDoi: doi.maDoi,
      tenDoi: doi.tenDoi,
      soTran: soTran,
      soTranThang: soTranThang,
      soTranThua: soTranThua,
      soTranHoa: soTran - soTranThang - soTranThua,
      hieuSo: soBanThang.soBanThang,
      diem: 0,
      hang: 0,
    }
    result.push(doiBXH);
  }
  return result;
}


export const selectBXHDoiThang = async (thang: Date) => {
  // Tat ca cac doi co tran co trung
  let result : BangXepHangNgay[] = [];
  const comparationThang = 
    sql`strftime('%Y-%m', date(${LichThiDauTable.ngayGioThucTe})) = strftime('%Y-%m', date(${thang.toJSON()}))`;

  const selectDoi = await db.select({
    doiMot: LichThiDauTable.doiMot,
    doiHai: LichThiDauTable.doiHai
    }).from(LichThiDauTable)
    .where(comparationThang)
    .groupBy(LichThiDauTable.doiMot, LichThiDauTable.doiHai);

  // Chuyen no thanh set
  const doiCoTranTrongNgay = new Set(selectDoi.flatMap((value) => [value.doiMot, value.doiHai]));
  for (const value of doiCoTranTrongNgay) {
    const doi = (await db.select({maDoi: DoiBongTable.maDoi, tenDoi: DoiBongTable.tenDoi})
                  .from(DoiBongTable).where(eq(DoiBongTable.maDoi, value))).at(0);
    if (doi === undefined)
      throw new Error("Doi mot khong ton tai");

    const soTran = await db.$count(LichThiDauTable, 
      and(
        comparationThang,
        or(
          eq(LichThiDauTable.doiMot, value), 
          eq(LichThiDauTable.doiHai, value)
        )
      )
    );
    
    const soTranThang = await db.$count(LichThiDauTable, 
        and(
          comparationThang,
          eq(LichThiDauTable.doiThang, value))
        );

    const soTranThua = await db.$count(LichThiDauTable, 
      and(
        comparationThang,
        or(
          eq(LichThiDauTable.doiMot, value), 
          eq(LichThiDauTable.doiHai, value)
        ),
        ne(LichThiDauTable.doiThang, value),
        isNotNull(LichThiDauTable.doiThang))
      );
    const soBanThang = (await db.select({soBanThang: sql<number>`count(${BanThangTable.maCT})`})
      .from(BanThangTable)
      .innerJoin(CauThuTable, eq(CauThuTable.maCT, BanThangTable.maCT))
      .innerJoin(LichThiDauTable, eq(LichThiDauTable.maTD, BanThangTable.maTD))
      .where(and(comparationThang, eq(CauThuTable.maDoi, value)))
      .groupBy(CauThuTable.maDoi)).at(0) ?? {soBanThang: 0};
    const doiBXH : BangXepHangNgay = {
      maDoi: doi.maDoi,
      tenDoi: doi.tenDoi,
      soTran: soTran,
      soTranThang: soTranThang,
      soTranThua: soTranThua,
      soTranHoa: soTran - soTranThang - soTranThua,
      hang: 0,
      hieuSo: soBanThang.soBanThang,
      diem: 0,
    }
    // console.log(doiBXH);
    result.push(doiBXH);
  }
  return result;
}

export const selectBXHDoiMuaGiai = async (maMG: number) => {
  // Tat ca cac doi co tran co trung
  let result : BangXepHangNgay[] = [];

  const selectDoi = await db.select({
    doiMot: LichThiDauTable.doiMot,
    doiHai: LichThiDauTable.doiHai
    }).from(LichThiDauTable)
    .where(eq(LichThiDauTable.maMG, maMG))
    .groupBy(LichThiDauTable.doiMot, LichThiDauTable.doiHai);

  // Chuyen no thanh set
  const doiCoTranTrongNgay = new Set(selectDoi.flatMap((value) => [value.doiMot, value.doiHai]));
  for (const value of doiCoTranTrongNgay) {
    const doi = (await db.select({maDoi: DoiBongTable.maDoi, tenDoi: DoiBongTable.tenDoi})
                  .from(DoiBongTable).where(eq(DoiBongTable.maDoi, value))).at(0);
    if (doi === undefined)
      throw new Error("Doi mot khong ton tai");

    const soTran = await db.$count(LichThiDauTable, 
      and(
        eq(LichThiDauTable.maMG, maMG),
        or(
          eq(LichThiDauTable.doiMot, value), 
          eq(LichThiDauTable.doiHai, value)
        )
      )
    );
    
    const soTranThang = await db.$count(LichThiDauTable, 
        and(
          eq(LichThiDauTable.maMG, maMG),
          eq(LichThiDauTable.doiThang, value))
        );

    const soTranThua = await db.$count(LichThiDauTable, 
      and(
        eq(LichThiDauTable.maMG, maMG),
        or(
          eq(LichThiDauTable.doiMot, value), 
          eq(LichThiDauTable.doiHai, value)
        ),
        ne(LichThiDauTable.doiThang, value),
        isNotNull(LichThiDauTable.doiThang))
      );
    const soBanThang = (await db.select({soBanThang: sql<number>`count(${BanThangTable.maCT})`})
      .from(BanThangTable)
      .innerJoin(CauThuTable, eq(CauThuTable.maCT, BanThangTable.maCT))
      .innerJoin(LichThiDauTable, eq(LichThiDauTable.maTD, BanThangTable.maTD))
      .where(and(eq(LichThiDauTable.maMG, maMG), eq(CauThuTable.maDoi, value)))
      .groupBy(CauThuTable.maDoi)).at(0) ?? {soBanThang: 0};
    const doiBXH = {
      maDoi: doi.maDoi,
      tenDoi: doi.tenDoi,
      soTran: soTran,
      soTranThang: soTranThang,
      soTranThua: soTranThua,
      soTranHoa: soTran - soTranThang - soTranThua,
      hang: 0,
      hieuSo: soBanThang.soBanThang,
      diem: 0,
    }
    // console.log(doiBXH);
    result.push(doiBXH);
  }
  return result;
}

export const selectCauThuGhiBanNgay = async (ngay: Date, maDoi : number) => {
  const lichThiDaus = (await db.select({ maTD: LichThiDauTable.maTD}).from(LichThiDauTable).where(and(
      sql`date(${LichThiDauTable.ngayGioThucTe}) = date(${ngay.toJSON()})`,
      or(
        eq(LichThiDauTable.doiMot, maDoi), 
        eq(LichThiDauTable.doiHai, maDoi)
      )
    ))).map((val => val.maTD));
  console.log(lichThiDaus);
  const cauThus = await db.select({ maCT: BanThangTable.maCT }).from(BanThangTable)
    .innerJoin(ThamGiaTDTable,
      and(
        eq(ThamGiaTDTable.maTD, BanThangTable.maTD), 
        eq(ThamGiaTDTable.maCT, BanThangTable.maCT)
    ))
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


export const selectCauThuGhiBanThang = async (thang: Date, maDoi : number) => {
  const comparationThang = 
    sql`strftime('%Y-%m', date(${LichThiDauTable.ngayGioThucTe})) = strftime('%Y-%m', date(${thang.toJSON()}))`;
  const lichThiDaus = (await db.select({ maTD: LichThiDauTable.maTD}).from(LichThiDauTable).where(and(
      comparationThang,
      or(
        eq(LichThiDauTable.doiMot, maDoi), 
        eq(LichThiDauTable.doiHai, maDoi)
      )
    ))).map((val => val.maTD));
  console.log(lichThiDaus);
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


export const selectCauThuGhiBanMuaGiai = async (maMG: number, maDoi : number) => {
  const lichThiDaus = (await db.select({ maTD: LichThiDauTable.maTD}).from(LichThiDauTable).where(and(
      eq(LichThiDauTable.maMG, maMG),
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
  let result : CauThuGhiBan[] = [];
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
      .where(eq(CauThuTable.maCT, cauThu.maCT)).limit(1)).at(0) ?? null;
    if (ct === null) continue;
    result.push(ct);
  }
  return result;
}