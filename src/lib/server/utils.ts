import { v4 as uuidv4 } from "uuid";

const getRandomUUID = () => uuidv4();
// min, max Inclusive
const randIntBetween = (min : number, max : number) => Math.floor(Math.random() * (max - min + 1) + min);
const choose = (args : any[]) => {
    if (args == null || args.length == 0) return null;
    return args[randIntBetween(0, args.length - 1)];
}

export { getRandomUUID, randIntBetween, choose };