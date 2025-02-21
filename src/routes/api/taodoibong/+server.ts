import type { CauThu } from "$lib/types";
import type { RequestHandler } from "./$types";
import { v4 as uuidv4 } from 'uuid'

export const GET: RequestHandler = async () => {
  return new Response();
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const data = await request.json();
  console.log(data);
  const maDoi : string = uuidv4();
  const insertDoi = "INSERT INTO DoiBong(maDoi, tenDoi, sanNha) VALUES($maDoi, $tenDoiBong, $sanNha)"
  locals.db.run(insertDoi, {
    $maDoi: maDoi,
    $tenDoiBong: data.tenDoiBong,
    $sanNha: data.sanNha,
  }, (err : any) => {
    if (err) { 
      console.error('Loi doi bong: ');
      throw err; 
    }
  });

  data.danhSachCauThu.forEach((cauThu : any) => {

    const maCT = uuidv4();
    const insertCauThu = "INSERT INTO CauThu(maCT, tenCT, ngaySinh, loaiCT, ghiChu) VALUES($maCT, $tenCT, $ngaySinh, $loaiCT, $ghiChu)"
    locals.db.run(insertCauThu, {
      $maCT: maCT,
      $tenCT: cauThu.ten,
      $ngaySinh: cauThu.ngaySinh,
      $loaiCT: cauThu.loai,
      $ghiChu: cauThu.ghiChu
    }, (err : any) => {
      if (err) { 
        console.error('Loi Cau thu: ');
        throw err; 
      }
    });

    const insertTGDB = "INSERT INTO ThamGiaDB(maDoi, maCT, maMG) VALUES($maDoi, $maCT, $maMG)"
    locals.db.run(insertTGDB, {
      $maDoi: maDoi,
      $maCT: maCT,
      $maMG: 1
    }, (err : any) => {
      if (err) { 
        console.error("Loi tham gia doi bong: ");
        throw err; 
      }
    });
  });

  return new Response();
};
