import type { DoiBong, DSMuaGiai, LichThiDau } from "$lib/types";
import type { PageServerLoad } from "./$types";


export const load = (async ({ fetch }) => {
  try {
    const response = await fetch("/api/lichthidau", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const responseDB = await fetch("/api/doibong", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!responseDB.ok) {
      throw new Error("Failed to fetch data");
    }

    const responseMG = await fetch("/api/muagiai", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!responseMG.ok) {
      throw new Error("Failed to fetch data");
    }
    
    const danhSachLTD: LichThiDau[] = await response.json();
    const danhSachDoi: DoiBong[] = await responseDB.json();
    const danhSachMuaGiai: DSMuaGiai[] = await responseMG.json();

    return {
      danhSachLTD,
      danhSachDoi,
      danhSachMuaGiai
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      danhSachLTD: [],
      danhSachDoi: [],
      danhSachMuaGiai: []
    };
  }
}) satisfies PageServerLoad;