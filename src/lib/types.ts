// Auth
export type User = {
    id: number;
    email: string;
    username: string;
}

export type Settings = {
    // Cầu thủ
    tuoiMin: number;
    tuoiMax: number;
    soCauThuMin: number;
    soCauThuMax: number;
    soCauThuNuocNgoaiToiDa: number;
    doiDaTrenSanNha: number;
    
    // Bàn thắng
    loaiBanThang: string[];
    thoiDiemGhiBanToiDa: number;
    
    // Thẻ phạt
    soThePhatToiDa : number;

    // Điểm bảng xếp hạng
    diemThang : number;
    diemHoa: number;
    diemThua: number;

}

export type Session = {
    id: string;
    userId: number;
    expiresAt: Date;
}

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
    tenDoi: string,
    soTran: number,
    soTranThang: number,
    soTranThua: number,
    soTranHoa: number,
    hieuSo: number,
    hang: number
}

// Database
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
    nuocNgoai: boolean;
    ngaySinh: string;
}

export type ThamGiaDB = {
    maDoi: number;
    maCT: number;
    maMG: number;
}

export type BanThang = {
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