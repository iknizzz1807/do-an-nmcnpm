
import { db } from "./client";
import { MuaGiaiTable } from "./schema/MuaGiai";
import type { CauThu, MuaGiai, ThamGiaTD } from "$lib/typesDatabase";
import { insertSanNha } from "./functions/Data/SanNha";
import { insertDoiBong, selectDoiBongMaDoi } from "./functions/DoiBong";
import { insertCauThu, selectCauThuDoiBong, selectCauThuMaCT } from "./functions/CauThu";
import dateFormat from "dateformat";

import competitions1 from "$lib/server/db/data/competitions.json"
import competitions2 from "$lib/server/db/data/competitions2.json"
import teamsSeason1 from "$lib/server/db/data/teamsSeason1.json"
import teamsSeason2 from "$lib/server/db/data/teamsSeason2.json"
import teamsSeason3 from "$lib/server/db/data/teamsCompetitions2.json"
import matchesSeason1 from "$lib/server/db/data/matchesSeason1.json"
import matchesSeason2 from "$lib/server/db/data/matchesSeason2.json"
import matchesSeason3 from "$lib/server/db/data/matchesCompetitions2.json"
import { insertLichThiDau } from "./functions/LichThiDau";
import { TrongTaiTable } from "./schema/TrongTai";
import { insertTrongTai, selectTrongTaiMaTT } from "./functions/Data/TrongTai";
import { insertThamGiaTD, selectCauThuTranDau } from "./functions/ThamGiaTD";
import { randIntBetween } from "../utils";
import { insertBanThang } from "./functions/BanThang";
import { selectMuaGiaiMaMG } from "./functions/MuaGiai";
import { seed } from "drizzle-seed";
import { faker } from "@faker-js/faker";

await db.insert(MuaGiaiTable).values(competitions1.seasons.slice(0, 2).map(value => ({ 
  maMG: value.id, 
  tenMG: competitions1.name + " " + value.startDate.substring(0, 4), 
  ngayDienRa: value.startDate,
  ngayKetThuc: value.endDate,
  imageURL: competitions1.emblem
} satisfies MuaGiai)));


await db.insert(MuaGiaiTable).values(competitions2.seasons.slice(0, 2).map(value => ({ 
  maMG: value.id, 
  tenMG: competitions2.name + " " + value.startDate.substring(0, 4), 
  ngayDienRa: value.startDate,
  ngayKetThuc: value.endDate,
  imageURL: competitions2.emblem
} satisfies MuaGiai)));


const seedSeason = async(teams: any, matches: any) => {
  const season = teams.season;
  const teamsMap: Map<number, number> = new Map();
  const playersMap: Map<number, number> = new Map();
  for (const team of teams.teams) {
    if (((await selectMuaGiaiMaMG(season.id)) ?? null) === null)
      continue;
    let sanNha = await insertSanNha({
      tenSan: team.venue,
      diaChi: team.address,
      maMG: season.id,
    });
    let doiBongId = await insertDoiBong({
      tenDoi: team.name,
      maSan: sanNha.at(0)!!.id,
      maMG: season.id,
      imageURL: team.crest
    })
    teamsMap.set(team.id, doiBongId.at(0)?.id!!);
    
    for (const player of team.squad) {
      let cauThu = await insertCauThu({
        tenCT: player.name,
        ngaySinh: player.dateOfBirth ?? dateFormat(new Date(), "isoDate"),
        ghiChu: faker.lorem.lines(1),
        soAo: 1,
        maLCT: 1,
        maDoi: teamsMap.get(team.id)!!,
      });
      playersMap.set(player.id, cauThu.at(0)?.id!!);
    }
  }

  const trongTaiMap = new Map();
  for (const match of matches.matches) {
    if (match.referees.length === 0)
      continue;
    if (!trongTaiMap.has(match.referees[0].id)) {
      let trongTai = await insertTrongTai({
        tenTT: match.referees[0].name,
        maMG: season.id,
        ngaySinh: dateFormat(new Date(), "isoDate"),
      });
      trongTaiMap.set(match.referees[0].id, trongTai.at(0)?.id!!);
    }

    await insertLichThiDau({
      maTD: match.id,
      maMG: season.id,
      maVTD: 1,
      maSan: 1,
      doiMot: teamsMap.get(match.homeTeam.id)!!,
      doiHai: teamsMap.get(match.awayTeam.id)!!,
      doiThang: (match.score.winner === null ? 
        null : 
        (match.score.winner === "HOME_TEAM" ? 
          teamsMap.get(match.homeTeam.id)!! : 
          teamsMap.get(match.awayTeam.id)!!
        )
      ),
      thoiGianDaThiDau: 90,
      maTT: trongTaiMap.get(match.referees[0].id),
    })

    const CTDoiMot = (await selectCauThuDoiBong(teamsMap.get(match.homeTeam.id)!!));
    const thamGiaDoiMot = CTDoiMot.map(value => ({ 
      maTD: match.id, 
      maCT: value.maCT, 
      maDoi: value.maDoi, 
      maVT: 1
    }));
    const CTDoiHai = (await selectCauThuDoiBong(teamsMap.get(match.awayTeam.id)!!));
    const thamGiaDoiHai = CTDoiHai.map(value => ({ 
      maTD: match.id, 
      maCT: value.maCT, 
      maDoi: value.maDoi, 
      maVT: 1
    }));
    await insertThamGiaTD(...thamGiaDoiMot, ...thamGiaDoiHai);

    let thoiDiem = 5;
    for (let i = 0; i < (match.score.fullTime.home ?? 0); i++) {
      const cauThuMot = CTDoiMot.at(randIntBetween(0, CTDoiMot.length - 1))!!;
      insertBanThang({
        maTD: match.id,
        maCT: cauThuMot.maCT,
        thoiDiem: thoiDiem,
        maLBT: 1
      });
      thoiDiem += 5;
    }
    
    for (let i = 0; i < (match.score.fullTime.away ?? 0); i++) {
      const cauThuDoiHai = CTDoiHai.at(randIntBetween(0, CTDoiHai.length - 1))!!;
      insertBanThang({
        maTD: match.id,
        maCT: cauThuDoiHai.maCT,
        thoiDiem: thoiDiem,
        maLBT: 1
      });
      thoiDiem += 5;
    }
    
    for (let i = 0; i < (match.score.halfTime.home ?? 0); i++) {
      const cauThuMot = CTDoiMot.at(randIntBetween(0, CTDoiMot.length - 1))!!;
      insertBanThang({
        maTD: match.id,
        maCT: cauThuMot.maCT,
        thoiDiem: thoiDiem,
        maLBT: 1
      });
      thoiDiem += 5;
    }
    
    for (let i = 0; i < (match.score.halfTime.away ?? 0); i++) {
      const cauThuDoiHai = CTDoiHai.at(randIntBetween(0, CTDoiHai.length - 1))!!;
      insertBanThang({
        maTD: match.id,
        maCT: cauThuDoiHai.maCT,
        thoiDiem: thoiDiem,
        maLBT: 1
      });
      thoiDiem += 5;
    }
  }
}

await seedSeason(teamsSeason1, matchesSeason1);
await seedSeason(teamsSeason2, matchesSeason2);
await seedSeason(teamsSeason3, matchesSeason3);

// await seed(db, {
//   SanNhaTable,
//   CauThuTable,
//   MuaGiaiTable,
//   DoiBongTable,
//   TrongTaiTable,
// }).refine((f) => ({
  
//   MuaGiaiTable: {
//     columns:{ 
//       tenMG: f.fullName(),
//       ngayDienRa: f.date(),
//       ngayKetThuc: f.date(),
//       deleted: f.default({ defaultValue: false }),
//     },
//     count: 3,
//     with: {
//       SanNhaTable: 10,
//       DoiBongTable: 10,
//       TrongTaiTable: 5,
//     }
//   },

//   SanNhaTable: {
//     columns: {
//       // maSan: f.int({minValue: 10 * i}),
//       tenSan: f.companyName(),
//       diaChi: f.streetAddress(),
//       deleted: f.default({ defaultValue: false }),
//       // maMG: f.default({ defaultValue: muaGiai.maMG }),
//     },
//     with: {
//       DoiBongTable: 1,
//     }
//   },

//   DoiBongTable: {
//     columns: {
//       tenDoi: f.companyName(),
//     },
//     with: {
//       CauThuTable: 20,
//     }
//   },

//   CauThuTable: {
//     columns: {
//       tenCT: f.fullName(),
//       ngaySinh: f.date({ minDate: "1990-01-01", maxDate: "2005-12-31" }),
//       ghiChu: f.loremIpsum(),
//       soAo: f.int({ minValue: 1, maxValue: 99 }),
//       maLCT: f.int({ minValue: 1, maxValue: 2 }),
//       deleted: f.default({ defaultValue: false }),
//     },
//   },

//   TrongTaiTable: {
//     columns: {
//       tenTT: f.fullName(),
//       ngaySinh: f.date({ minDate: "1990-01-01", maxDate: "2005-12-31" }),
//       deleted: f.default({ defaultValue: false }),
//     }
//   }
// })).catch((reason) => {
//   console.log("\n");
//   // console.log(reason);
//   console.log("\n\nPlease delete the db.sqlite before running seed:db. \
//     You gonna fucking panic because of the amount of shit printed");
// });
// // Generate ban Thang

// const muaGiais = await db.select().from(MuaGiaiTable);
// for (const muaGiai of muaGiais) {
//   await generateLichThiDau(muaGiai.maMG);
//   // await generateTGDB(muaGiai.maMG);
// }
// const lichThiDau = await db.select().from(LichThiDauTable);
// for (const lich of lichThiDau) {
//   await generateTGTD(lich, lich.doiMot);
//   await generateTGTD(lich, lich.doiHai);
//   await generateBanThang(lich.maTD!!, lich.doiMot, 0, randIntBetween(0, 5));
//   await generateBanThang(lich.maTD!!, lich.doiHai, 0.5, randIntBetween(0, 5));
//   // await generateThePhat(lich.maTD, randIntBetween(0, 1), randIntBetween(0, 1));
// }