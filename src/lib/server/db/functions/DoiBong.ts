import { ilike, eq } from "drizzle-orm";
import { db } from "../client";
import { DoiBongTable, DoiBongTableBackup, type InsertDoiBongBackupParams } from "../schema/DoiBong";
import type { DoiBong } from "$lib/types";
import { CauThuTableBackup, type InsertCauThuBackupParams } from "../schema/CauThu";

export const insertDoiBong = async (...doiBong: DoiBong[]) => {
  const returning = await db.transaction(async(tx) => {
      const insertedValues = await tx.insert(DoiBongTable).values(doiBong).returning();

      const backUps : InsertDoiBongBackupParams[] = insertedValues.map((value) => {
          return {
              modifiedDate: new Date(),
              ...value
          } satisfies InsertDoiBongBackupParams;
      }); // Insert vo backup

      return await tx
          .insert(DoiBongTableBackup) // Backup
          .values(backUps)
          .returning({ id: DoiBongTableBackup.maDoi });
  });
  if (returning === null || returning.length === 0)
    throw new Error("Lỗi thêm mới đội bóng: Không thể thêm mới");
  return returning;
};

export const updateDoiBong = async(doiBong: DoiBong) => {
  if ((doiBong.maDoi ?? null) == null)
    return;
  return await db.transaction(async (tx) => {
      const updated = await tx.update(DoiBongTable).set({
        tenDoi: doiBong.tenDoi,
        sanNha: doiBong.sanNha
      }).where(eq(DoiBongTable.maDoi, doiBong.maDoi!!)).returning();
      
      if (updated.length == 0)
        return;

      await tx
          .insert(DoiBongTableBackup)
          .values(updated.map((value) => {
              return {
                  modifiedDate: new Date(),
                  ...value
              } satisfies InsertDoiBongBackupParams;
          }));
      return updated;
  });
}

export const selectAllDoiBong = async () => {
  return (await db.select().from(DoiBongTable)) satisfies DoiBong[];
};

export const selectDoiBongTen = async (tenDoi: string) => {
  return (await db
    .select()
    .from(DoiBongTable)
    .where(ilike(DoiBongTable.tenDoi, "%" + tenDoi + "%"))) satisfies DoiBong[];
};

export const selectDoiBongTenTrung = async (tenDoi: string) => {
  const returning = await db
    .select({ maDoi: DoiBongTable.maDoi })
    .from(DoiBongTable)
    .where(eq(DoiBongTable.tenDoi, tenDoi));

  return Number(returning.at(0));
  // return (
  //   await db
  //     .select({ maDoi: DoiBongTable.maDoi })
  //     .from(DoiBongTable)
  //     .where(eq(DoiBongTable.tenDoi, tenDoi))
  // ).at(0);
};
