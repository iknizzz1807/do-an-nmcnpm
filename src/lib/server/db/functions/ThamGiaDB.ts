import type { ThamGiaDB } from "$lib/types";
import { db } from "../client";
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

export const selectAllThamGiaDB = async () => {
  return (await db.select().from(ThamGiaDBTable)) satisfies ThamGiaDB[];
};
