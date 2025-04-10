import { db } from "./client";
import { ThamSoTable } from "./schema/ThamSo";

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

for (const setting of DefaultSettings)
{
  await db.insert(ThamSoTable).values({key: setting.key, value: setting.value});
}