import { eq, and } from "drizzle-orm"
import { db } from "../client"
import { DoiBongTable } from "../schema/DoiBong"
import { LichThiDauTable } from "../schema/LichThiDau"
import { BanThangTable } from "../schema/BanThang"
import type { KetQuaThiDau } from "$lib/typesResponse"
import { SanNhaTable } from "../schema/SanNha"


export const selectKetQuaThiDau = async(maTD: number) : Promise<null | KetQuaThiDau> => {
    const lichThiDau = (await db.select().from(LichThiDauTable).where(eq(LichThiDauTable.maTD, maTD))).at(0);
    if (lichThiDau === undefined)
        return null;

    const doiMot = (await db.select().from(DoiBongTable).where(eq(DoiBongTable.maDoi, lichThiDau.doiMot))).at(0);
    const doiHai = (await db.select().from(DoiBongTable).where(eq(DoiBongTable.maDoi, lichThiDau.doiHai))).at(0);
    if (doiMot === undefined)
        throw new Error("Doi mot khong ton tai");
    if (doiHai === undefined)
        throw new Error("Doi hai khong ton tai");

    const tySoDoiMot = await db.$count(BanThangTable, and(eq(BanThangTable.maTD, maTD), eq(BanThangTable.maDoi, lichThiDau.doiMot)));
    const tySoDoiHai = await db.$count(BanThangTable, and(eq(BanThangTable.maTD, maTD), eq(BanThangTable.maDoi, lichThiDau.doiHai)));

    const sanNha = (await db.select().from(SanNhaTable).where(eq(SanNhaTable.maSan, doiMot.maSan))).at(0)?.tenSan ?? "";

    return {
        doiMot: doiMot,
        doiHai: doiHai,
        tySo: tySoDoiMot.toString() + '-' + tySoDoiHai.toString(),
        san: sanNha,
        ngayGio: lichThiDau.ngayGio
    };
}