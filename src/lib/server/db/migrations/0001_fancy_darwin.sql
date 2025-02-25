PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_BanThang` (
	`maTD` integer NOT NULL,
	`maCT` integer NOT NULL,
	`maDoi` integer NOT NULL,
	`thoiDiem` real NOT NULL,
	`loaiBanThang` text NOT NULL,
	PRIMARY KEY(`maTD`, `maCT`, `thoiDiem`),
	FOREIGN KEY (`maTD`) REFERENCES `LichThiDau`(`maTD`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`maCT`) REFERENCES `CauThu`(`maCT`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`maDoi`) REFERENCES `DoiBong`(`maDoi`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_BanThang`("maTD", "maCT", "maDoi", "thoiDiem", "loaiBanThang") SELECT "maTD", "maCT", "maDoi", "thoiDiem", "loaiBanThang" FROM `BanThang`;--> statement-breakpoint
DROP TABLE `BanThang`;--> statement-breakpoint
ALTER TABLE `__new_BanThang` RENAME TO `BanThang`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_CauThu` (
	`maCT` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tenCT` text NOT NULL,
	`ngaySinh` text NOT NULL,
	`loaiCT` integer NOT NULL,
	`ghiChu` text NOT NULL,
	`nuocNgoai` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_CauThu`("maCT", "tenCT", "ngaySinh", "loaiCT", "ghiChu", "nuocNgoai") SELECT "maCT", "tenCT", "ngaySinh", "loaiCT", "ghiChu", "nuocNgoai" FROM `CauThu`;--> statement-breakpoint
DROP TABLE `CauThu`;--> statement-breakpoint
ALTER TABLE `__new_CauThu` RENAME TO `CauThu`;--> statement-breakpoint
CREATE UNIQUE INDEX `CauThu_maCT_unique` ON `CauThu` (`maCT`);--> statement-breakpoint
CREATE TABLE `__new_DoiBong` (
	`maDoi` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tenDoi` text NOT NULL,
	`sanNha` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_DoiBong`("maDoi", "tenDoi", "sanNha") SELECT "maDoi", "tenDoi", "sanNha" FROM `DoiBong`;--> statement-breakpoint
DROP TABLE `DoiBong`;--> statement-breakpoint
ALTER TABLE `__new_DoiBong` RENAME TO `DoiBong`;--> statement-breakpoint
CREATE UNIQUE INDEX `DoiBong_maDoi_unique` ON `DoiBong` (`maDoi`);--> statement-breakpoint
CREATE TABLE `__new_LichThiDau` (
	`maTD` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`doiMot` integer NOT NULL,
	`doiHai` integer NOT NULL,
	`ngayGio` text NOT NULL,
	`vongThiDau` integer NOT NULL,
	`maMG` integer NOT NULL,
	`doiThang` integer,
	FOREIGN KEY (`doiMot`) REFERENCES `DoiBong`(`maDoi`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`doiHai`) REFERENCES `DoiBong`(`maDoi`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`maMG`) REFERENCES `DSMuaGiai`(`maMG`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`doiThang`) REFERENCES `DoiBong`(`maDoi`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_LichThiDau`("maTD", "doiMot", "doiHai", "ngayGio", "vongThiDau", "maMG", "doiThang") SELECT "maTD", "doiMot", "doiHai", "ngayGio", "vongThiDau", "maMG", "doiThang" FROM `LichThiDau`;--> statement-breakpoint
DROP TABLE `LichThiDau`;--> statement-breakpoint
ALTER TABLE `__new_LichThiDau` RENAME TO `LichThiDau`;--> statement-breakpoint
CREATE UNIQUE INDEX `LichThiDau_maTD_unique` ON `LichThiDau` (`maTD`);--> statement-breakpoint
CREATE TABLE `__new_ThamGiaDB` (
	`maDoi` integer NOT NULL,
	`maCT` integer NOT NULL,
	`maMG` integer NOT NULL,
	PRIMARY KEY(`maDoi`, `maCT`, `maMG`),
	FOREIGN KEY (`maDoi`) REFERENCES `DoiBong`(`maDoi`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`maCT`) REFERENCES `CauThu`(`maCT`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`maMG`) REFERENCES `DSMuaGiai`(`maMG`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ThamGiaDB`("maDoi", "maCT", "maMG") SELECT "maDoi", "maCT", "maMG" FROM `ThamGiaDB`;--> statement-breakpoint
DROP TABLE `ThamGiaDB`;--> statement-breakpoint
ALTER TABLE `__new_ThamGiaDB` RENAME TO `ThamGiaDB`;