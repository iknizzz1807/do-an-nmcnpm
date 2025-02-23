import { randBetweenDate, randText, randUserName } from "@ngneat/falso"
import { randIntBetween } from '../../utils'
import { type InsertCauThuParams } from "../schema/CauThu"
import { insertCauThu } from "../functions/CauThu"

export const generateCauThuData = async (count: number) : Promise<number[]> => {
    let ids : number[] = [];
    for (let i = 0; i < count; i++) {
        const cauThu : InsertCauThuParams = {
            tenCT: randUserName(),
            loaiCT: randIntBetween(0, 2),
            ghiChu: randText(),
            ngaySinh: randBetweenDate({ from: new Date(1980, 0, 1), to: new Date(2005, 12, 32)}),
            nuocNgoai: randIntBetween(0, 1),
        }
    
        await insertCauThu(cauThu).then(
            (value) => ids.push(...value.map((val) => val.id)),
            (err) => { if (err) throw err; }
        ); 
    }
    return ids;
}