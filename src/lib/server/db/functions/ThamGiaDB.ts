import { db } from "../client";
import { ThamGiaDB, type InsertThamGiaDBParams } from "../schema/ThamGiaDB";

// Return maCT
export const insertThamGiaDB = async (...thamGiaDB: InsertThamGiaDBParams[]) => {
    let returning = await db.insert(ThamGiaDB).values(thamGiaDB).returning({ id: ThamGiaDB.maCT });
    if (returning == null || returning.length == 0)
        throw new Error("Co gi do sai sot trong luc add vo ThamGiaDB: Insert khong duoc");
    return returning;
}

export const selectAllThamGiaDB = async() => {
    return db.select().from(ThamGiaDB);
}