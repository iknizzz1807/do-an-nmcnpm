import type { DoiBong, DSMuaGiai } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch }) => {
  try {
    const response = await fetch("api/muagiai", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const danhSachMuaGiai: DSMuaGiai[] = await response.json();

    return {
      danhSachMuaGiai,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      danhSachMuaGiai: [],
    };
  }
}) satisfies PageServerLoad;
