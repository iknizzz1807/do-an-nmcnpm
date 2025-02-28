import type { ThamGiaDB } from "$lib/types";
import { db } from "../client";
import { eq } from "drizzle-orm";
import {
  ThamGiaDBTable,
  ThamGiaDBTableBackup,
  type InsertThamGiaDBBackupParams,
  type InsertThamGiaDBParams,
} from "../schema/ThamGiaDB";

// Return maCT
export const insertThamGiaDB = async (...thamGiaDB: ThamGiaDB[]) => {
  const returning = await db.transaction(async(tx) => {
      const insertedValues = await tx.insert(ThamGiaDBTable).values(thamGiaDB).returning();

      const backUps = insertedValues.map((value) => {
          return {
              modifiedDate: new Date(),
              ...value
          } satisfies InsertThamGiaDBBackupParams;
      }); // Insert vo backup

      return await tx
          .insert(ThamGiaDBTableBackup) // Backup
          .values(backUps)
          .returning({ id: ThamGiaDBTableBackup.maCT });
  });
  if (returning === null || returning.length === 0)
    throw new Error(
      "Co gi do sai sot trong luc add vo ThamGiaDB: Insert khong duoc"
    );
  return returning;
};

// Todo: this is not the final version, there is something wrong with this
export const updateThamGiaDB = async(thamGiaDB: ThamGiaDB) => {
  return await db.transaction(async (tx) => {
      const updated = await tx.update(ThamGiaDBTable).set({
        maMG: thamGiaDB.maMG,
        maDoi: thamGiaDB.maDoi,
      }).where(eq(ThamGiaDBTable.maCT, thamGiaDB.maCT!!)).returning();
      
      if (updated.length == 0)
        return;

      await tx
          .insert(ThamGiaDBTableBackup)
          .values(updated.map((value) => {
              return {
                  modifiedDate: new Date(),
                  ...value
              } satisfies InsertThamGiaDBBackupParams;
          }));
      return updated;
  });
}

export const selectAllThamGiaDB = async () => {
  return (await db.select().from(ThamGiaDBTable)) satisfies ThamGiaDB[];
};
