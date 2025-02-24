export type KetQuaThiDau = {
    doiMot: DoiBong,
    doiHai: DoiBong,
    tySo: string,
    san : string,
    ngayGio: Date
}

export type KQTraCuuCauThu = {
    tenCT: string,
    tenDoi: string,
    loaiCT: number,
    tongSoBanThang: number
}

export type BangXepHangNgay = {
    tenDoi: string,
    soTran: number,
    soTranThang: number,
    soTranThua: number,
    soTranHoa: number,
    hieuSo: number,
    hang: number
}

export type DSMuaGiai = {
    maMG?: number | undefined;
    tenMG: string;
}

export type DoiBong = {
    maDoi?: number | undefined;
    tenDoi: string;
    sanNha: string;
}

export type CauThu = {
    maCT?: number | undefined;
    tenCT: string;
    loaiCT: number;
    ghiChu: string;
    nuocNgoai: number;
    ngaySinh: Date;
}

export type ThamGiaDB = {
    maDoi: number;
    maCT: number;
    maMG: number;
}

export type BanThang = {
    maTD: number,
    maCT: number,
    maDoi: number,
    thoiDiem: number,
    loaiBanThang: string,
}

export type LichThiDau = {
    doiMot: number;
    doiHai: number;
    vongThiDau: number;
    maMG: number;
    doiThang?: number | null | undefined;
    maTD?: number | undefined;
    ngayGio?: string | undefined;
}