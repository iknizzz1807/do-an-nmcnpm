import { randBetweenDate } from "@ngneat/falso"
import { getRandomUUID, randIntBetween, choose } from '../../utils'
import { db } from '../client'
import { DoiBong } from "../schema/DoiBong"
import { LichThiDau, type InsertLichThiDauParams } from "../schema/LichThiDau"

export const generateLichThuDauData = async (maMG: number) : Promise<string[]> => {
    let ids : string[] = [];
    const doiBongs = await db.select().from(DoiBong);
    
    while(doiBongs.length >= 2) {
        
        const maTD = getRandomUUID();
        const doiMotIndex = randIntBetween(0, doiBongs.length - 1);
        const doiHaiIndex = randIntBetween(0, doiBongs.length - 1);
        const lichThiDau : InsertLichThiDauParams = {
            maTD: maTD,
            doiMot: doiBongs[doiMotIndex].maDoi,
            doiHai: doiBongs[doiHaiIndex].maDoi,
            vongThiDau: randIntBetween(1, 2),
            maMG: maMG,
            doiThang: doiBongs[choose([doiMotIndex, doiHaiIndex])].maDoi,
            ngayGio: randBetweenDate({ from: new Date(2010, 0, 1), to: new Date()})
        }
        doiBongs.splice(doiMotIndex, 1);
        doiBongs.splice(doiHaiIndex, 1);

        await db.insert(LichThiDau).values(lichThiDau);
        ids.push(maTD);
    }
    return ids;
}