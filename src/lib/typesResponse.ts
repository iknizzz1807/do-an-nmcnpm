import type { DoiBong } from "./typesDatabase"

// Query Results
export type KetQuaThiDau = {
  doiMot: DoiBong,
  doiHai: DoiBong,
  tySo: string,
  san : string,
  ngayGio: string
}

export type KQTraCuuCauThu = {
  tenCT: string,
  tenDoi: string,
  loaiCT: number,
  tongSoBanThang: number
}

export type BangXepHangNgay = {
  maDoi: number,
  tenDoi: string,
  soTran: number,
  soTranThang: number,
  soTranThua: number,
  soTranHoa: number,
  hieuSo: number,
  hang: number
}

export type CauThuGhiBan = {
  maCT: number;
  maDoi: number;
  tenCT: string;
  tenDoi: string;
  loaiCT: number;
  soBanThang: number;
}