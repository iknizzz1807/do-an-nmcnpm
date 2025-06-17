import { errorResponseJSON } from "$lib";
import { selectSettings } from "$lib/server/db/functions/ThamSo";
import { selectAllUser } from "$lib/server/db/functions/User/User";
import {
  checkPageViewable,
  selectAllRole,
} from "$lib/server/db/functions/User/UserRole";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import {
  selectAllUserGroup,
  selectAllUserGroupWithRole,
} from "$lib/server/db/functions/User/UserGroup";
import {
  selectAllSanNha,
  selectSanNhaMuaGiai,
} from "$lib/server/db/functions/Data/SanNha";
import { selectAllLoaiCT } from "$lib/server/db/functions/Data/LoaiCT";
import { selectAllLoaiBT } from "$lib/server/db/functions/Data/LoaiBT";
import { selectAllViTri } from "$lib/server/db/functions/Data/ViTri";
import { selectAllVongTD } from "$lib/server/db/functions/Data/VongTD";
import { selectAllDiemSo } from "$lib/server/db/functions/Data/DiemSo";
import { selectAllTieuChiXepHang } from "$lib/server/db/functions/Data/TieuChiXepHang";

export const load = (async ({ locals, route }) => {
  const roleId = 9999;
  if (!locals.user) error(401);
  if ((await checkPageViewable(locals.user?.groupId!!, route.id)) === false)
    error(401);

  return {
    setting: await selectSettings(),
    users: await selectAllUser(),
    userGroup: await selectAllUserGroupWithRole(),
    userRoles: await selectAllRole(),
    sanNha: await selectSanNhaMuaGiai(locals.muaGiai!!.maMG!!),
    loaiCT: await selectAllLoaiCT(),
    loaiBT: await selectAllLoaiBT(),
    viTri: await selectAllViTri(),
    vongTD: await selectAllVongTD(),
    diemSo: await selectAllDiemSo(),
    tieuChiXepHang: await selectAllTieuChiXepHang(),
  };
}) satisfies PageServerLoad;
