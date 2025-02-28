import Database from 'better-sqlite3';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/better-sqlite3';

dotenv.config();

const client = new Database(process.env.SQLITE_DB_PATH, { verbose: console.log });
const db = drizzle(client);

export { client, db };

// async function createBackupTriggers() {
//   // Ensuring the database successfully migrated or pushed. ChatGPTed thank you drizzle for very unclear documentation
//   // await db.run(`PRAGMA foreign_keys = ON;`); // Example of ensuring DB is ready
//   // await db.select({id: CauThuTable.maCT}).from(CauThuTable).limit(1);
//   createCTBackupTrigger();
//   createDBBackupTrigger();
//   createDSMGBackupTrigger();
//   createTGDBBackupTrigger();
//   createLTDBackupTrigger();
//   createBTBackupTrigger();
// }

// createBackupTriggers().catch(console.error);