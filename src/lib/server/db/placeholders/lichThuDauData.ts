import { randBetweenDate } from "@ngneat/falso"
import { randIntBetween, choose } from '../../utils'
import { db } from '../client'
import { DoiBongTable } from "../schema/DoiBong"
import { type InsertLichThiDauParams } from "../schema/LichThiDau"
import { insertLichThiDau } from "../functions/LichThiDau"

export const generateLichThuDauData = async (maMG: number) : Promise<number[]> => {
    let ids : number[] = [];
    const doiBongs = await db.select().from(DoiBongTable);
    
    while(doiBongs.length >= 2) {
    
        const doiMotIndex = randIntBetween(0, doiBongs.length - 1);
        const doiHaiIndex = randIntBetween(0, doiBongs.length - 1);
        const lichThiDau : InsertLichThiDauParams = {
            doiMot: doiBongs[doiMotIndex].maDoi,
            doiHai: doiBongs[doiHaiIndex].maDoi,
            vongThiDau: randIntBetween(1, 2),
            maMG: maMG,
            doiThang: choose([doiBongs[doiMotIndex].maDoi, doiBongs[doiHaiIndex].maDoi, null]),
            ngayGio: new Date().toJSON()
        }
        
        const lichThiDau2 : InsertLichThiDauParams = {
            doiMot: doiBongs[doiHaiIndex].maDoi,
            doiHai: doiBongs[doiMotIndex].maDoi,
            vongThiDau: randIntBetween(1, 2),
            maMG: maMG,
            doiThang: doiBongs[choose([doiMotIndex, doiHaiIndex])].maDoi,
            ngayGio: new Date().toJSON()
        }
        doiBongs.splice(doiMotIndex, 1);
        doiBongs.splice(doiHaiIndex, 1);

        await insertLichThiDau(lichThiDau).then(
            (value) => ids.push(...value.map((val) => val.id)),
            (err) => { if (err) throw err; }
        ); 
        await insertLichThiDau(lichThiDau2).then(
            (value) => ids.push(...value.map((val) => val.id)),
            (err) => { if (err) throw err; }
        );
    }
    return ids;
}