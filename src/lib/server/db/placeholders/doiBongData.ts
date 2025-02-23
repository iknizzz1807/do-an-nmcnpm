import { randAddress, randUserName } from "@ngneat/falso"
import { type InsertDoiBongParams } from "../schema/DoiBong"
import { insertDoiBong } from "../functions/DoiBong"

export const generateDoiBongData = async (count: number) : Promise<number[]> => {
    let ids : number[] = [];
    for (let i = 0; i < count; i++) {
        const doiBong : InsertDoiBongParams = {
            tenDoi: randUserName(),
            sanNha: randAddress().city,
        }
        
        await insertDoiBong(doiBong).then(
            (value) => ids.push(...value.map((val) => val.id)),
            (err) => { if (err) throw err; }
        ); 
    }
    return ids;
}

