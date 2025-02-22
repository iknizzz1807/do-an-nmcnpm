import { randAddress, randAvatar, randUserName } from "@ngneat/falso"
import { DoiBong, type InsertDoiBongParams } from "../schema/DoiBong"
import { getRandomUUID } from '../../utils'
import { db } from '../client'

export const generateDoiBongData = async (count: number) : Promise<string[]> => {
    let ids : string[] = [];
    for (let i = 0; i < count; i++) {
        const maDoi = getRandomUUID();
        const doiBong : InsertDoiBongParams = {
            maDoi: maDoi,
            tenDoi: randUserName(),
            sanNha: randAddress().city,
        }
        
        await db.insert(DoiBong).values(doiBong);
        ids.push(maDoi);
    }
    return ids;
}

