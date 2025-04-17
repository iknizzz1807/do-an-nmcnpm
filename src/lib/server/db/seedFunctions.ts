import { db } from "./client";
import { CauThuTable } from "./schema/CauThu";
import { BanThangTable } from "./schema/BanThang";
import { DoiBongTable } from "./schema/DoiBong";
import { LichThiDauTable } from "./schema/LichThiDau";
import { ThamGiaDBTable } from "./schema/ThamGiaDB";
import type { BanThang, LichThiDau, ThamGiaDB, ThePhat } from "$lib/typesDatabase";
import { eq, and, getTableColumns } from "drizzle-orm";
import { choose, randIntBetween } from "../utils";
import { insertLichThiDau } from "./functions/LichThiDau";
import { ThePhatTable } from "./schema/ThePhat";
import { ThamGiaTDTable } from "./schema/ThamGiaTD";

export const generateBanThang = async (maTD: number, soBTDoiMot: number = 5, soBTDoiHai: number = 5) => {
  console.log("BAN THANG !!!!!!!!!!!!!!!");

  // if (soBTDoiMot == 0 || soBTDoiHai == 0)
  //   throw new Error("soBT generate khong the bang 0");
  const lichThiDau = (await db.select().from(LichThiDauTable).where(eq(LichThiDauTable.maTD, maTD))).at(0);
  if (lichThiDau === undefined)
    throw new Error("Khong tim thay lich thi dau");
  const cauThusDoi1 = await db.select({
    ...getTableColumns(CauThuTable)
  })
    .from(CauThuTable)
    .innerJoin(ThamGiaTDTable, 
      and(eq(ThamGiaTDTable.maCT, CauThuTable.maCT), 
        eq(ThamGiaTDTable.maDoi, lichThiDau.doiMot),
        eq(ThamGiaTDTable.maTD, maTD)));

  const cauThusDoi2 = await db.select({
    ...getTableColumns(CauThuTable)
  })
    .from(CauThuTable)
    .innerJoin(ThamGiaTDTable, 
      and(eq(ThamGiaTDTable.maCT, CauThuTable.maCT), 
        eq(ThamGiaTDTable.maDoi, lichThiDau.doiHai),
        eq(ThamGiaTDTable.maTD, maTD)));

  // console.log("Stage 1");
  const n1 = Math.min(soBTDoiMot, cauThusDoi1.length - 1);
  for (let i = 0; i < n1; i++) {
    const cauThu = cauThusDoi1.at(randIntBetween(0, cauThusDoi1.length - 1));
    if (cauThu === undefined)
      throw new Error("Khong the xac dinh duoc cau thu");
    const banThang : BanThang = {
      maTD: lichThiDau.maTD,
      maDoi: lichThiDau.doiMot,
      maCT: cauThu.maCT,
      thoiDiem: 90 * i / n1,
      loaiBanThang: choose(['A', 'B', 'C'])
    }
    await db.insert(BanThangTable).values(banThang);
  }
  // console.log("Stage 2");
  const n2 = Math.min(soBTDoiHai, cauThusDoi2.length - 1);
  for (let i = 0; i < n2; i++) {
    const cauThu = cauThusDoi2.at(randIntBetween(0, cauThusDoi2.length - 1));
    if (cauThu === undefined)
      throw new Error("Khong the xac dinh duoc cau thu");
    const banThang : BanThang = {
      maTD: lichThiDau.maTD,
      maDoi: lichThiDau.doiHai,
      maCT: cauThu.maCT,
      thoiDiem: 90 * i / (n2 + 1),
      loaiBanThang: choose(['A', 'B', 'C'])
    }
    await db.insert(BanThangTable).values(banThang);
  }
}

export const generateThePhat = async (maTD: number, soTPDoiMot: number = 5, soTPDoiHai: number = 5) => {
  // if (soTPDoiMot == 0 || soTPDoiHai == 0)
  //   throw new Error("soBT generate khong the bang 0");
  console.log("THE PHAT !!!!!!!!!!!!!!!");

  const lichThiDau = (await db.select().from(LichThiDauTable).where(eq(LichThiDauTable.maTD, maTD))).at(0);
  if (lichThiDau === undefined)
    throw new Error("Khong tim thay lich thi dau");

  const cauThusDoi1 = await db.select({
    ...getTableColumns(CauThuTable)
  })
    .from(CauThuTable)
    .innerJoin(ThamGiaTDTable, 
      and(eq(ThamGiaTDTable.maCT, CauThuTable.maCT), 
        eq(ThamGiaTDTable.maDoi, lichThiDau.doiMot),
        eq(ThamGiaTDTable.maTD, maTD)));

  const cauThusDoi2 = await db.select({
    ...getTableColumns(CauThuTable)
  })
    .from(CauThuTable)
    .innerJoin(ThamGiaTDTable, 
      and(eq(ThamGiaTDTable.maCT, CauThuTable.maCT), 
        eq(ThamGiaTDTable.maDoi, lichThiDau.doiHai),
        eq(ThamGiaTDTable.maTD, maTD)));

  // console.log("Stage 1");
  const n1 = Math.min(soTPDoiMot, cauThusDoi1.length - 1);
  for (let i = 0; i < n1; i++) {
    const cauThu = cauThusDoi1.at(randIntBetween(0, cauThusDoi1.length - 1));
    if (cauThu === undefined)
      throw new Error("Khong the xac dinh duoc cau thu");
    const thePhat : ThePhat = {
      maTD: lichThiDau.maTD,
      maDoi: lichThiDau.doiMot,
      maCT: cauThu.maCT,
      thoiDiem: 90 * i / n1,
      loaiThe: choose(['Do', 'Vang'])
    }
    await db.insert(ThePhatTable).values(thePhat);
  }
  // console.log("Stage 2");
  const n2 = Math.min(soTPDoiHai, cauThusDoi2.length - 1);
  for (let i = 0; i < n2; i++) {
    const cauThu = cauThusDoi2.at(randIntBetween(0, cauThusDoi2.length - 1));
    if (cauThu === undefined)
      throw new Error("Khong the xac dinh duoc cau thu");
    const thePhat : ThePhat = {
      maTD: lichThiDau.maTD,
      maDoi: lichThiDau.doiHai,
      maCT: cauThu.maCT,
      thoiDiem: 90 * i / (n2 + 1),
      loaiThe: choose(['Do', 'Vang'])
    }
    await db.insert(ThePhatTable).values(thePhat);
  }
}
export const generateTGTD = async (maTD: number, maDoi : number, soCauThu : number = 11) => {
  console.log("THAM GIA TRAN DAU !!!!!!!!!!!!!!!");
  const thiDau = (await db.select().from(LichThiDauTable).where(eq(LichThiDauTable.maTD, maTD))).at(0) ?? null;
  if (thiDau == null)
    throw new Error("Không tìm thấy thi đấu weird!!!!!!!!!!!!!!!!");
  const ctTGDB = await db.select().from(ThamGiaDBTable).where(and(eq(ThamGiaDBTable.maMG, thiDau.maMG), eq(ThamGiaDBTable.maDoi, maDoi)));
  for (let i = 0; i < Math.min(ctTGDB.length, soCauThu); i++)
  {
    await db.insert(ThamGiaTDTable).values({ maCT: ctTGDB[i].maCT, maTD: maTD, maDoi: maDoi, viTri: "Hello" });
  }
}

export const generateTGDB = async(maMG : number, soCTPerDoi : number = 20) => {
  console.log("THAM GIA DOI BONG !!!!!!!!!!!!!!!");
  const doiBongs = await db.select().from(DoiBongTable);
  let ctI = 0;
  const cauThu = await db.select().from(CauThuTable);
  for (const doi of doiBongs) {
    for (let i = 0; i < soCTPerDoi; i++) {
      const ct = cauThu.at(ctI) ?? null;
      if (ct === null)
        break;
      ctI++;
      await db.insert(ThamGiaDBTable).values({
        maCT: ct.maCT,
        maDoi: doi.maDoi,
        maMG: maMG,
      } satisfies ThamGiaDB);
    }
  }
}

export const generateLichThiDau = async (maMG: number) => {
    let ids : number[] = [];
    const doiBongs = await db.select().from(DoiBongTable);
    
    while(doiBongs.length >= 2) {
        const doiMotIndex = randIntBetween(0, doiBongs.length - 1);
        const doiHaiIndex = randIntBetween(0, doiBongs.length - 1);
        if (doiMotIndex == doiHaiIndex)
          continue;
        const lichThiDau : LichThiDau = {
            doiMot: doiBongs[doiMotIndex].maDoi,
            doiHai: doiBongs[doiHaiIndex].maDoi,
            maVTD: randIntBetween(1, 2),
            maMG: maMG,
            doiThang: choose([doiBongs[doiMotIndex].maDoi, doiBongs[doiHaiIndex].maDoi, null]),
            ngayGio: new Date().toJSON()
        }
        
        const lichThiDau2 : LichThiDau = {
            doiMot: doiBongs[doiHaiIndex].maDoi,
            doiHai: doiBongs[doiMotIndex].maDoi,
            maVTD: randIntBetween(1, 2),
            maMG: maMG,
            doiThang: doiBongs[choose([doiMotIndex, doiHaiIndex])].maDoi,
            ngayGio: new Date().toJSON(),
        }
        doiBongs.splice(doiMotIndex, 1);
        doiBongs.splice(doiHaiIndex, 1);

        await insertLichThiDau(lichThiDau).then(
            (value) => ids.push(...value.map((val) => val.id)),
            (err) => { if (err) throw err; }
        ); 
        await insertLichThiDau(lichThiDau2).then(
            (value) => ids.push(...value.map((val) => val.id)),
            (err) => { if (err) throw err; }
        );
    }
    return ids;
}