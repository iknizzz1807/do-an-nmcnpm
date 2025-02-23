import { randUserName } from "@ngneat/falso"
import { type InsertDSMuaGiaiParams } from "../schema/DSMuaGiai"
import { insertDSMuaGiai } from "../functions/DSMuaGiai"

export const generateDSMuaGiaiData = async (count: number) : Promise<number[]> => {
    let ids : number[] = [];
    for (let i = 0; i < count; i++) {
        const muaGiai : InsertDSMuaGiaiParams = {
            tenMG: randUserName()
        }
        
        await insertDSMuaGiai(muaGiai).then(
            (value) => ids.push(...value.map((val) => val.id)),
            (err) => { if (err) throw err; }
        ); 
    }
    return ids;
}