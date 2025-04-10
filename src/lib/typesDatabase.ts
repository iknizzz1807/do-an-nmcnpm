// Database
export type ThamSo = {
    key: string,
    value: number,
}

export type DSMuaGiai = {
    maMG?: number | undefined;
    tenMG: string;
    ngayDienRa: string;
}

export type DoiBong = {
    maDoi?: number | undefined;
    tenDoi: string;
    maSan: number;
    tenSan?: string | undefined;
}

export type SanNha = {
    maSan?: number | undefined;
    tenSan: string;
    diaChi: string;
}

export type CauThu = {
    maCT?: number | undefined;
    tenCT: string;
    loaiCT: number;
    ghiChu: string;
    nuocNgoai: boolean;
    ngaySinh: string;
    banThang?: number | undefined;
}

export type ThamGiaDB = {
    maDoi: number;
    maCT: number;
    maMG: number;
}

export type ThamGiaTD = {
    maTD: number;
    maDoi: number;
    maCT: number;
    viTri: string;
};

export type BanThang = {
    maBT?: number | undefined,
    maTD: number;
    maCT: number;
    maDoi: number;
    thoiDiem: number;
    loaiBanThang: string;
    // Data display
    tenCT?: string | undefined;
    tenDoi?: string | undefined;
}

export type ThePhat = {
    maTP?: number | undefined,
    maTD: number;
    maDoi: number;
    maCT: number;
    thoiDiem: number;
    loaiThe: string;
    // Data display
    tenCT?: string | undefined;
    tenDoi?: string | undefined;
}

export type LichThiDau = {
    doiMot: number;
    doiHai: number;
    vongThiDau: number;
    maMG: number;
    doiThang?: number | null | undefined;
    maTD?: number | undefined;
    // Data display
    ngayGio?: string | undefined;
    tenDoiMot?: string | undefined;
    tenDoiHai?: string | undefined;
    tenMG?: string | undefined;
    tenDoiThang?: string | undefined;
}