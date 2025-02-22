import { randAddress, randAvatar, randBetweenDate, randText, randUserName } from "@ngneat/falso"
import { getRandomUUID, randIntBetween } from '../../utils'
import { db } from '../client'
import { CauThu, type InsertCauThuParams } from "../schema/CauThu"
import { DSMuaGiai, type InsertDSMuaGiaiParams } from "../schema/DSMuaGiai"

export const generateDSMuaGiaiData = async (count: number) : Promise<number[]> => {
    let ids : number[] = [];
    for (let i = 0; i < count; i++) {
        let maMG = -1;
        const muaGiai : InsertDSMuaGiaiParams = {
            tenMG: randUserName()
        }
        
        await db.insert(DSMuaGiai).values(muaGiai).returning({maMG: DSMuaGiai.maMG});
        console.log(maMG);
        ids.push(maMG);
    }
    return ids;
}