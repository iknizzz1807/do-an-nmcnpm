import { eq, and, getTableColumns, inArray } from 'drizzle-orm';
import { db } from '../client';
import { LichThiDauTable } from '../schema/LichThiDau';
import type { LichThiDau } from '$lib/typesDatabase';
import { DoiBongTable } from '../schema/DoiBong';
import { MuaGiaiTable } from '../schema/MuaGiai';
import { alias } from 'drizzle-orm/sqlite-core';
import { BanThangTable } from '../schema/BanThang';
import { ThePhatTable } from '../schema/ThePhat';
import { choose, randIntBetween } from '$lib/server/utils';
import { TrongTaiTable } from '../schema/TrongTai';

export const insertLichThiDau = async (...lichThiDau: LichThiDau[]) => {
    let returning = await db.insert(LichThiDauTable).values(lichThiDau).returning({ id: LichThiDauTable.maTD });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo LichThiDau: Insert khong duoc");
    return returning;
}

export const updateLichThiDau = async(lichThiDau: LichThiDau) => {
  if ((lichThiDau.maTD ?? null) == null)
    return;
  await db.update(LichThiDauTable).set({
    maMG: lichThiDau.maMG,
    maVTD: lichThiDau.maVTD,
    
    doiMot: lichThiDau.doiMot,
    doiHai: lichThiDau.doiHai,
    
    doiThang: lichThiDau.doiThang,
    
    ngayGioDuKien: lichThiDau.ngayGioDuKien,
    ngayGioThucTe: lichThiDau.ngayGioThucTe,

    thoiGianDaThiDau: lichThiDau.thoiGianDaThiDau,
    maTT: lichThiDau.maTT
  }).where(eq(LichThiDauTable.maTD, lichThiDau.maTD!!))
}

export const deleteLichThiDau = async (maTD: number) => {
  // await db.delete(BanThangTable).where(eq(BanThangTable.maTD, maTD));
  // await db.delete(ThePhatTable).where(eq(ThePhatTable.maTD, maTD));
  await db.delete(LichThiDauTable).where(eq(LichThiDauTable.maTD, maTD));
}

export const selectAllLichThiDau = async() => {
    return await db.select().from(LichThiDauTable) satisfies LichThiDau[];
}

export const selectLichThiDauMaTD = async(maTD: number) => {
  return (await db.select()
    .from(LichThiDauTable)
    .where(eq(LichThiDauTable.maTD, maTD)).limit(1))
    .at(0) satisfies LichThiDau | undefined;
}

export const tuDongSapXep = async (maMG: number, maDBs : number[]) => {
  let ids : number[] = [];
  const doiBongs = await db.select().from(DoiBongTable).where(inArray(DoiBongTable.maDoi, maDBs));
  const trongTais = await db.select().from(TrongTaiTable);
  if (trongTais.length == 0)
    throw new Error("Không có trọng tài nào hết");
  
  while(doiBongs.length >= 2) {
      const doiMotIndex = randIntBetween(0, doiBongs.length - 1);
      const doiHaiIndex = randIntBetween(0, doiBongs.length - 1);
      if (doiMotIndex == doiHaiIndex)
        continue;
      const lichThiDau : LichThiDau = {
        maMG: maMG,
        maVTD: randIntBetween(1, 2),
        maSan: doiBongs[doiMotIndex].maSan,

        doiHai: doiBongs[doiHaiIndex].maDoi,
        doiMot: doiBongs[doiMotIndex].maDoi,
        doiThang: null,
        
        ngayGioDuKien: new Date().toJSON(),
        ngayGioThucTe: new Date().toJSON(),
        
        thoiGianDaThiDau: 0,
        maTT: trongTais[randIntBetween(0, trongTais.length - 1)].maTT
      }
      
      // const lichThiDau2 : LichThiDau = {
      //   maVTD: randIntBetween(1, 2),
      //   maMG: maMG,
      //   maSan: doiBongs[doiHaiIndex].maSan,

      //   doiMot: doiBongs[doiHaiIndex].maDoi,
      //   doiHai: doiBongs[doiMotIndex].maDoi,
      //   doiThang: null,
        
      //   ngayGioDuKien: new Date().toJSON(),
      //   ngayGioThucTe: new Date().toJSON(),
        
      //   thoiGianDaThiDau: 0,
      //   maTT: trongTais[randIntBetween(0, trongTais.length - 1)].maTT
      // }
      doiBongs.splice(doiMotIndex, 1);
      // doiBongs.splice(doiHaiIndex, 1);

      await insertLichThiDau(lichThiDau).then(
          (value) => ids.push(...value.map((val) => val.id)),
          (err) => { if (err) throw err; }
      ); 
      // await insertLichThiDau(lichThiDau2).then(
      //     (value) => ids.push(...value.map((val) => val.id)),
      //     (err) => { if (err) throw err; }
      // );
  }
  return ids;
}

export const selectAllLichThiDauWithName = async(maMG: number) => {
  const doiMot = alias(DoiBongTable, "doiMot");
  const doiHai = alias(DoiBongTable, "doiHai");
  const doiThang = alias(DoiBongTable, "doiThang");
  return await 
    db.select({
      ...getTableColumns(LichThiDauTable),
      tenDoiMot: doiMot.tenDoi,
      tenDoiHai: doiHai.tenDoi,
      tenMG: MuaGiaiTable.tenMG,
      tenDoiThang: doiThang.tenDoi,
    }).from(LichThiDauTable)
      .innerJoin(doiMot, eq(LichThiDauTable.doiMot, doiMot.maDoi)) 
      .innerJoin(doiHai, eq(LichThiDauTable.doiHai, doiHai.maDoi)) 
      .innerJoin(doiThang, eq(LichThiDauTable.doiHai, doiHai.maDoi)) 
      .innerJoin(MuaGiaiTable, eq(LichThiDauTable.maMG, MuaGiaiTable.maMG))
      .where(eq(LichThiDauTable.maMG, maMG))
      .groupBy(LichThiDauTable.maTD) satisfies LichThiDau[];
}

export const selectLichThiDauVong = async (maVTD: number, maMG: number) => {
    return await db
        .select()
        .from(LichThiDauTable)
        .where(and(eq(LichThiDauTable.maMG, maMG), eq(LichThiDauTable.maVTD, maVTD))) satisfies LichThiDau[];
}