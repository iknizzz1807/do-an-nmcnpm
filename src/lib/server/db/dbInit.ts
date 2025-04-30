import type { ThamSo } from "$lib/typesDatabase";
import { db } from "./client";
import { createAdmin } from "./functions/User/Admin";
import { LoaiBTTable } from "./schema/Data/LoaiBT";
import { LoaiCTTable } from "./schema/Data/LoaiCT";
import { LoaiTPTable } from "./schema/Data/LoaiTP";
import { ViTriTable } from "./schema/Data/ViTri";
import { VongTDTable } from "./schema/Data/VongTD";
import { ThamSoTable } from "./schema/ThamSo";
import { HasRoleTable } from "./schema/User/HasRole";
import { UserGroupTable, type UserGroupInsertParams } from "./schema/User/UserGroup";
import { UserRoleTable, type UserRoleInsertParams } from "./schema/User/UserRole";

const DefaultSettings : ThamSo[] = [
  { tenThamSo: "tuoiMin", giaTri: 16 },
  { tenThamSo: "tuoiMax", giaTri: 40 },
  { tenThamSo: "soCauThuMin", giaTri: 15 },
  { tenThamSo: "soCauThuMax", giaTri: 25 },
  { tenThamSo: "doiDaTrenSanNha", giaTri: 2 },
  { tenThamSo: "loaiBanThang", giaTri: 1 },
  { tenThamSo: "thoiDiemGhiBanToiDa", giaTri: 90 },
  { tenThamSo: "soThePhatToiDa", giaTri: 5 },
  { tenThamSo: "diemThang", giaTri: 3 },
  { tenThamSo: "diemHoa", giaTri: 1 },
  { tenThamSo: "diemThua", giaTri: 0 }
];

for (const setting of DefaultSettings) {
  await db.insert(ThamSoTable).values({tenThamSo: setting.tenThamSo, giaTri: setting.giaTri});
}

const roles : UserRoleInsertParams[] = [
  { roleId: 1, roleName: "Mùa giải", viewablePage: "/muagiai", canEdit: false },
  { roleId: 2, roleName: "Cầu thủ", viewablePage: "/cauthu", canEdit: false },
  { roleId: 3, roleName: "Đội bóng", viewablePage: "/doi", canEdit: false },
  { roleId: 4, roleName: "Lịch thi đấu", viewablePage: "/trandau", canEdit: false },
  { roleId: 5, roleName: "Bảng xếp hạng", viewablePage: "/bxh", canEdit: false },
  
  // Editable
  { roleId: 51, roleName: "Sửa Cầu thủ", viewablePage: "/cauthu", canEdit: true },
  { roleId: 52, roleName: "Sửa Đội bóng", viewablePage: "/doi", canEdit: true },
  { roleId: 53, roleName: "Sửa Lịch thi đấu", viewablePage: "/trandau", canEdit: true },
  { roleId: 54, roleName: "Sửa Mùa giải", viewablePage: "/muagiai", canEdit: true },
  { roleId: 9999, roleName: "Everything", viewablePage: "/%", canEdit: true },
];

await db.insert(UserRoleTable).values(roles);

const groupsRoles: { group: UserGroupInsertParams, roles: number[] }[] = [
  { group: { groupId: 0, groupName: "Admin" }, roles: [ 51, 52, 53, 54, 9999 ] },
  { group: { groupId: 1, groupName: "Thường" }, roles: [ 1, 2, 3, 4, 5 ] },
  { group: { groupId: 2, groupName: "Quản lý đội bóng" }, roles: [ 1, 51, 52, 4, 5 ] },
  { group: { groupId: 3, groupName: "Quản lý giải đấu" }, roles: [ 51, 52, 53, 54, 5 ] },
]

for (const groupRole of groupsRoles)
{
  await db.insert(UserGroupTable).values(groupRole.group);
  for (const role of groupRole.roles)
  {
    await db.insert(HasRoleTable).values({ groupId: groupRole.group.groupId!!, roleId: role });
  }
}

await db.insert(ViTriTable).values([
  { tenVT: "Tiền đạo" }, 
  { tenVT: "Bla bla bla" }, 
  { tenVT: "gì đó" }
]);

await db.insert(LoaiBTTable).values([
  { tenLBT: "A" }, 
  { tenLBT: "B" }, 
  { tenLBT: "C" }
]);

await db.insert(LoaiCTTable).values([
  { tenLCT: "Trong nước", soCauThuToiDa: 0 }, 
  { tenLCT: "Nước ngoài", soCauThuToiDa: 0 }
]);

await db.insert(LoaiTPTable).values([
  { tenLTP: "Vàng", soThePhatToiDa: 0 }, 
  { tenLTP: "Đỏ", soThePhatToiDa: 0 }
]);


await db.insert(VongTDTable).values([
  { tenVTD: "Đi" }, 
  { tenVTD: "Về" }
]);

await createAdmin();
