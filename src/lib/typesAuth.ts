// Auth
export type User = {
    id: number;
    email: string;
    username: string;
    groupId: number;
}

export type UserRole = {
    roleId: number;
    roleName: string;
    viewablePage: string;
    canEdit: boolean;
}

export type Settings = {
    // Cầu thủ
    tuoiMin: number;
    tuoiMax: number;
    soCauThuMin: number;
    soCauThuMax: number;
    doiDaTrenSanNha: number;
    
    thoiDiemGhiBanToiThieu: number;
    thoiDiemGhiBanToiDa: number;
}

export type Session = {
    id: string;
    userId: number;
    expiresAt: Date;
}