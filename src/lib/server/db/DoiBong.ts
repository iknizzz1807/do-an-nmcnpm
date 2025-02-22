import { db } from './client';
import { DoiBong, type InsertDoiBongParams } from './schema/DoiBong';

const createDoiBong = async (doiBong: InsertDoiBongParams) => {
    await db.insert(DoiBong).values(doiBong);
}

export { createDoiBong };