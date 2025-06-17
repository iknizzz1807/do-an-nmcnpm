import { v4 as uuidv4 } from "uuid";

const getRandomUUID = () => uuidv4();
// min, max Inclusive
const randIntBetween = (min : number, max : number) => Math.floor(Math.random() * (max - min + 1) + min);
const choose = (args : any[]) => {
    if (args === null || args.length === 0) return null;
    return args[randIntBetween(0, args.length - 1)];
}

// I chatgpted this for typesafe between backend and the frontend
type TypesAreEqual<T, U> = 
  [T] extends [U] ? 
    [U] extends [T] ? 
      true : 
      false : 
    false;


const randDateBetween = (from: Date, to: Date) => {
    const fromTime = from.getTime();
    const toTime = to.getTime();
    return new Date(fromTime + Math.random() * (toTime - fromTime));
}



export { getRandomUUID, randIntBetween, randDateBetween, choose, type TypesAreEqual };