<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import type { LoaiCT, MuaGiai, SanNha } from "$lib/typesDatabase";
  import { onMount } from "svelte";
  import type { CauThuBackup, DoiBongBackup } from "$lib/typesBackup";
  let { data }: PageProps = $props();

  let lichSu : CauThuBackup[] = $state(data.lichSu);
  let danhSachLoaiCT: LoaiCT[] = $state(data.loaiCTs);

  const columns = [
    { header: "ID", accessor: "BackupID", hidden: true },
    { 
      header: "Ngày chỉnh sửa", 
      accessor: "modifiedDate",
      accessFunction: (data : any) => new Date(data.modifiedDate).toLocaleString("vi-VN"), 
    },
    { header: "Mã cầu thủ", accessor: "maCT" },
    { header: "Tên cầu thủ", accessor: "tenCT" },
    { header: "Ngày sinh", accessor: "ngaySinh",
      accessFunction: (data: any) => new Date(data.ngaySinh).toLocaleDateString("vi-VN")
    },
    {
      header: "Loại cầu thủ",
      accessor: "maLCT",
      accessFunction: (data: any) => danhSachLoaiCT.find((value) => value.maLCT === data.maLCT)?.tenLCT ?? "",
    },
    //{ header: "Nước ngoài", accessor: "nuocNgoai" },
    { header: "Ghi chú", accessor: "ghiChu" },
  ];
</script>

<svelte:head>
  <title>Các Mùa giải</title>
</svelte:head>

<Table
  title="Các lần chỉnh sửa cũ của mùa giải"
  {columns}
  data={lichSu}
  redirectParam={""}
  tableType=""
  showTeamLogo={false}
/>
