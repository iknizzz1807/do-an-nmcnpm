// Auth
export type User = {
    id: number;
    email: string;
    username: string;
    groupId: number;
    editedPassword? : string | undefined
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
    soCauThuTGTDMin: number;
    soCauThuTGTDMax: number;
    doiDaTrenSanNha: number;
    
    thoiDiemGhiBanToiThieu: number;
    thoiDiemGhiBanToiDa: number;
}

export type Session = {
    sessionId: string;
    userId: number;
    expiresAt: Date;
}