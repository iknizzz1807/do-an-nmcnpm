import { randAddress, randAvatar, randBetweenDate, randText, randUserName } from "@ngneat/falso"
import { getRandomUUID, randIntBetween } from '../../utils'
import { db } from '../client'
import { CauThu, type InsertCauThuParams } from "../schema/CauThu"

export const generateCauThuData = async (count: number) : Promise<string[]> => {
    let ids : string[] = [];
    for (let i = 0; i < count; i++) {
        const maCauThu = getRandomUUID();
        const cauThu : InsertCauThuParams = {
            maCT: maCauThu,
            tenCT: randUserName(),
            loaiCT: randIntBetween(0, 2),
            ghiChu: randText(),
            ngaySinh: randBetweenDate({ from: new Date(1980, 0, 1), to: new Date(2005, 12, 32)}),
            nuocNgoai: randIntBetween(0, 1),
        }
        
        await db.insert(CauThu).values(cauThu);
        ids.push(maCauThu);
    }
    return ids;
}