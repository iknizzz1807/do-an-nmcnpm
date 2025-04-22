import { checkPageEditable } from "$lib/server/db/functions/User/UserRole";
import type { DoiBong, SanNha } from "$lib/typesDatabase";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, locals, route }) => {
  try {
    const response = await fetch("api/doibong", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const danhSachDoiBong: DoiBong[] = await response.json();

    const responseSN = await fetch("api/sannha", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!responseSN.ok) {
      throw new Error("Failed to fetch data");
    }

    const danhSachSanNha : SanNha[] = await responseSN.json();
    const isEditable = await checkPageEditable(locals.user!!.groupId, route.id);

    return {
      danhSachDoiBong: danhSachDoiBong,
      danhSachSanNha: danhSachSanNha,
      isEditable
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      danhSachDoiBong: [],
      danhSachSanNha: [],
      isEditable: false
    };
  }
}) satisfies PageServerLoad;
