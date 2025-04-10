import { db } from "./client";
import { createAdmin } from "./functions/Admin";
import { ThamSoTable } from "./schema/ThamSo";
import { UserRoleTable } from "./schema/UserRole";


await createAdmin();

const DefaultSettings = [
  { key: "tuoiMin", value: 16 },
  { key: "tuoiMax", value: 40 },
  { key: "soCauThuMin", value: 15 },
  { key: "soCauThuMax", value: 25 },
  { key: "soCauThuNuocNgoaiToiDa", value: 5 },
  { key: "doiDaTrenSanNha", value: 2 },
  { key: "loaiBanThang", value: 1 },
  { key: "thoiDiemGhiBanToiDa", value: 90 },
  { key: "soThePhatToiDa", value: 5 },
  { key: "diemThang", value: 3 },
  { key: "diemHoa", value: 1 },
  { key: "diemThua", value: 0 }
];

for (const setting of DefaultSettings) {
  await db.insert(ThamSoTable).values({key: setting.key, value: setting.value});
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