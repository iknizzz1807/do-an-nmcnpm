import type { ThamSo } from "$lib/typesDatabase";
import { db } from "./client";
import { createAdmin } from "./functions/Admin";
import { LoaiBTTable } from "./schema/Data/LoaiBT";
import { LoaiCTTable } from "./schema/Data/LoaiCT";
import { LoaiTPTable } from "./schema/Data/LoaiTP";
import { ViTriTable } from "./schema/Data/ViTri";
import { ThamSoTable } from "./schema/ThamSo";
import { UserRoleTable } from "./schema/UserRole";


await createAdmin();

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

const DefaultRoles = [
  { roleId: 1, roleName: "View" },
  { roleId: 2, roleName: "Edit" },
  { roleId: 3, roleName: "Edit Settings" },
  { roleId: 4, roleName: "" },
];

for (const role of DefaultRoles) {
  await db.insert(UserRoleTable).values({ roleId: role.roleId, roleName: role.roleName });
}

// await db.insert(ViTriTable).values([{ tenVT: "1" }, { tenVT: "2" }, { tenVT: "3" }]);
// await db.insert(LoaiBTTable).values([{ tenLBT: "1" }, { tenLBT: "2" }, { tenLBT: "3" }]);
// await db.insert(LoaiCTTable)
// .values([{ tenLCT: "1", soCauThuToiDa: 0 }, { tenLCT: "2", soCauThuToiDa: 0 }, { tenLCT: "3", soCauThuToiDa: 0 }]);

// await db.insert(LoaiTPTable)
// .values([{ tenLTP: "1", soThePhatToiDa: 0 }, { tenLTP: "2", soThePhatToiDa: 0 }, { tenLTP: "3", soThePhatToiDa: 0 }]);