CREATE TABLE `BanThang` (
	`maTD` text NOT NULL,
	`maCT` text NOT NULL,
	`thoiDiem` real NOT NULL,
	`maDoi` text NOT NULL,
	`loaiBanThang` text NOT NULL,
	PRIMARY KEY(`maTD`, `maCT`, `thoiDiem`),
	FOREIGN KEY (`maTD`) REFERENCES `LichThiDau`(`maTD`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`maCT`) REFERENCES `CauThu`(`maCT`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`maDoi`) REFERENCES `DoiBong`(`maDoi`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `CauThu` (
	`maCT` text PRIMARY KEY NOT NULL,
	`tenCT` text NOT NULL,
	`ngaySinh` integer NOT NULL,
	`loaiCT` integer NOT NULL,
	`ghiChu` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `CauThu_maCT_unique` ON `CauThu` (`maCT`);--> statement-breakpoint
CREATE TABLE `DoiBong` (
	`maDoi` text PRIMARY KEY NOT NULL,
	`tenDoi` text NOT NULL,
	`sanNha` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `DoiBong_maDoi_unique` ON `DoiBong` (`maDoi`);--> statement-breakpoint
CREATE TABLE `DSMuaGiai` (
	`maMG` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tenMG` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `DSMuaGiai_maMG_unique` ON `DSMuaGiai` (`maMG`);--> statement-breakpoint
CREATE TABLE `LichThiDau` (
	`maTD` text PRIMARY KEY NOT NULL,
	`doiMot` text NOT NULL,
	`doiHai` text NOT NULL,
	`ngayGio` integer NOT NULL,
	`vongThiDau` integer NOT NULL,
	`maMG` integer NOT NULL,
	`doiThang` text NOT NULL,
	FOREIGN KEY (`doiMot`) REFERENCES `DoiBong`(`maDoi`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`doiHai`) REFERENCES `DoiBong`(`maDoi`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`maMG`) REFERENCES `DSMuaGiai`(`maMG`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`doiThang`) REFERENCES `DoiBong`(`maDoi`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `LichThiDau_maTD_unique` ON `LichThiDau` (`maTD`);--> statement-breakpoint
CREATE TABLE `ThamGiaDB` (
	`maDoi` text NOT NULL,
	`maCT` text NOT NULL,
	`maMG` integer NOT NULL,
	PRIMARY KEY(`maDoi`, `maCT`, `maMG`),
	FOREIGN KEY (`maDoi`) REFERENCES `DoiBong`(`maDoi`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`maCT`) REFERENCES `CauThu`(`maCT`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`maMG`) REFERENCES `DSMuaGiai`(`maMG`) ON UPDATE no action ON DELETE no action
);
