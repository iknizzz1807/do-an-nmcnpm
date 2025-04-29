import { checkPageEditable } from "$lib/server/db/functions/User/UserRole";
import type { MuaGiai } from "$lib/typesDatabase";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, route, locals }) => {
  let daChonMuaGiai: boolean = false;
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

    const danhSachMuaGiai: MuaGiai[] = await response.json();
    const isEditable = await checkPageEditable(locals.user!!.groupId, route.id);

    if (!locals.muaGiai) daChonMuaGiai = false;
    else daChonMuaGiai = true;
    return {
      danhSachMuaGiai,
      isEditable,
      daChonMuaGiai,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      danhSachMuaGiai: [],
      isEditable: false,
      daChonMuaGiai: false,
    };
  }
}) satisfies PageServerLoad;
