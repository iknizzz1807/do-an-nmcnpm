import type { DSMuaGiai } from '$lib/types';
import { db } from '../client';
import { eq } from 'drizzle-orm';
import { DSMuaGiaiTable, DSMuaGiaiTableBackup, type InsertDSMuaGiaiBackupParams, type InsertDSMuaGiaiParams } from '../schema/DSMuaGiai';

export const insertDSMuaGiai = async (...muaGiai: DSMuaGiai[]) => {
    const returning = await db.transaction(async(tx) => {
        const insertedValues = await tx.insert(DSMuaGiaiTable).values(muaGiai).returning();

        const backUps = insertedValues.map((value) => {
            return {
                modifiedDate: new Date(),
                ...value
            } satisfies InsertDSMuaGiaiBackupParams;
        }); // Insert vo backup

        return await tx
            .insert(DSMuaGiaiTableBackup) // Backup
            .values(backUps)
            .returning({ id: DSMuaGiaiTableBackup.maMG });
    });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo DSMuaGiai: Insert khong duoc");
    return returning;
}

export const updateDSMuaGiai = async(muaGiai: DSMuaGiai) => {
  if ((muaGiai.maMG ?? null) == null)
    return;
  return await db.transaction(async (tx) => {
      const updated = await tx.update(DSMuaGiaiTable).set({
        tenMG: muaGiai.tenMG
      }).where(eq(DSMuaGiaiTable.maMG, muaGiai.maMG!!)).returning();
      
      if (updated.length == 0)
        return;

      await tx
          .insert(DSMuaGiaiTableBackup)
          .values(updated.map((value) => {
              return {
                  modifiedDate: new Date(),
                  ...value
              } satisfies InsertDSMuaGiaiBackupParams;
          }));
      return updated;
  });
}

export const selectAllDSMuaGiai = async() => {
    return await db.select().from(DSMuaGiaiTable) satisfies DSMuaGiai[];
}