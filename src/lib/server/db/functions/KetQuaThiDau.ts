import { eq, and, count, countDistinct, sql } from "drizzle-orm"
import { db } from "../client"
import { DoiBongTable } from "../schema/DoiBong"
import { LichThiDauTable } from "../schema/LichThiDau"
import { BanThangTable } from "../schema/BanThang"
import type { KetQuaThiDau } from "$lib/typesResponse"
import { SanNhaTable } from "../schema/Data/SanNha"
import { ThamGiaTDTable } from "../schema/ThamGiaTD"
import { LoaiBTTable } from "../schema/Data/LoaiBT"


export const selectKetQuaThiDau = async(maTD: number) : Promise<null | KetQuaThiDau> => {
    const lichThiDau = (await db.select().from(LichThiDauTable).where(eq(LichThiDauTable.maTD, maTD))).at(0);
    if (lichThiDau === undefined)
        return null;

    const doiMot = (await db.select().from(DoiBongTable)
        .where(eq(DoiBongTable.maDoi, lichThiDau.doiMot))).at(0);
    const doiHai = (await db.select().from(DoiBongTable)
        .where(eq(DoiBongTable.maDoi, lichThiDau.doiHai))).at(0);
    if (doiMot === undefined)
        throw new Error("Doi mot khong ton tai");
    if (doiHai === undefined)
        throw new Error("Doi hai khong ton tai");
 
    const tySoDoiMot = (await db.select({ tySo: sql`sum(${LoaiBTTable.diemBT})`.mapWith(Number)  })
        .from(BanThangTable)
        .innerJoin(ThamGiaTDTable, and(eq(ThamGiaTDTable.maTD, maTD), eq(ThamGiaTDTable.maDoi, doiMot.maDoi)))
        .innerJoin(LoaiBTTable, eq(LoaiBTTable.maLBT, BanThangTable.maLBT))
        .groupBy(BanThangTable.maTD, BanThangTable.thoiDiem)).at(0)!!;

    const tySoDoiHai = (await db.select({ tySo: sql`sum(${LoaiBTTable.diemBT})`.mapWith(Number) })
        .from(BanThangTable)
        .innerJoin(ThamGiaTDTable, and(eq(ThamGiaTDTable.maTD, maTD), eq(ThamGiaTDTable.maDoi, doiHai.maDoi)))
        .innerJoin(LoaiBTTable, eq(LoaiBTTable.maLBT, BanThangTable.maLBT))
        .groupBy(BanThangTable.maTD, BanThangTable.thoiDiem)).at(0)!!;

    const sanNha = (await db.select().from(SanNhaTable).where(eq(SanNhaTable.maSan, lichThiDau.maSan))).at(0)?.tenSan ?? "";

    return {
        doiMot: doiMot,
        doiHai: doiHai,
        tySo: tySoDoiMot.tySo.toString() + '-' + tySoDoiHai.tySo.toString(),
        san: sanNha,
        ngayGio: lichThiDau.ngayGioThucTe
    };
}