import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { db } from "./db/client";
import fs from "fs/promises";
import type { Settings } from "$lib/types";
import path from "path";

// THIS IS A TEST
const DefaultSetting = {
  "tuoiMin": 16,
  "tuoiMax": 40,
  "soCauThuMin": 15,
  "soCauThuMax": 25,
  "soCauThuNuocNgoaiToiDa": 5,
  "doiDaTrenSanNha": 2,
  
  "loaiBanThang": 1,
  "thoiDiemGhiBanToiDa": 90,
  
  "soThePhatToiDa" : 5,

  "diemThang" : 3,
  "diemHoa": 1,
  "diemThua": 0
};

const settingPath = path.resolve("src/lib/server/userSettings.json");
const writeQueue: any[] = [];
let isWriting = false;

// Prompted because Race Condition, Atomic stuff
export const UpdateSetting = async (setting: Settings) => {
  return new Promise(async (resolve, reject) => {
    writeQueue.push({ setting, resolve, reject });
    if (isWriting) return;
    
    // Tránh race condition
    isWriting = true;
    try {
      while (writeQueue.length > 0) {
        const { setting, resolve, reject } = writeQueue.shift();
        try {
          await fs.writeFile("src/lib/server/userSettings.json", JSON.stringify(setting));
          resolve(true);
        } catch (error) {
          reject(error);
        }
      }
    } finally {
      isWriting = false;
    }
  });
};

export const GetSetting = async() => {
  try {
    const data = await fs.readFile("src/lib/server/userSettings.json", 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Handle error (file not found, etc.)
    console.error("Error reading settings:", error);
    return null; // Or default settings
  }
};