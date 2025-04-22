import { sha1 } from "@oslojs/crypto/sha1";
import { hash, verify } from "argon2";
import { encodeHexLowerCase } from "@oslojs/encoding";

export async function hashPassword(password: string): Promise<string> {
  // return encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
  return await hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		hashLength: 32,
		parallelism: 1
	});
}

// Get the password hash compare it to the input raw password
// Please don't do this
/*
const passwordHash = await hashPassword(password);
verifyPasswordHash(passwordHash, password)

this will always return true im stupid
*/
export async function verifyPasswordHash(hash: string, password: string): Promise<boolean> {
	// return true;
  return await verify(hash, password);
}

export async function verifyPasswordStrength(password: string): Promise<boolean> {
	if (password.length < 8 || password.length > 255) {
		return false;
	}
	// const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
	// const hashPrefix = hash.slice(0, 5);
	// const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
	// const data = await response.text();
	// const items = data.split("\n");
	// for (const item of items) {
	// 	const hashSuffix = item.slice(0, 35).toLowerCase();
	// 	if (hash === hashPrefix + hashSuffix) {
	// 		return false;
	// 	}
	// }
	return true;
}