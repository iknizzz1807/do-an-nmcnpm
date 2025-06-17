<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import type { DoiBong, MuaGiai, SanNha, VongTD } from "$lib/typesDatabase";
  import { onMount } from "svelte";
  import type { LichThiDauBackup } from "$lib/typesBackup";
  let { data }: PageProps = $props();

  let lichSu : LichThiDauBackup[] = $state(data.lichSu);
  const danhSachDoi: DoiBong[] = $state(data.danhSachDoi);
  const danhSachVTD: VongTD[] = $state(data.danhSachVTD);
  const danhSachSan: SanNha[] = $state(data.danhSachSan);

  const columns = [
    { header: "ID", accessor: "BackupID", hidden: true },
    { 
      header: "Ngày chỉnh sửa", 
      accessor: "modifiedDate",
      accessFunction: (data : any) => new Date(data.modifiedDate).toLocaleString("vi-VN"), 
    },
    { header: "Đội Một", accessor: "tenDoiMot" },
    { header: "Đội Hai", accessor: "tenDoiHai" },
    { header: "Vòng thi đấu", accessor: "tenVTD" },
    // { header: "Mã mùa giải", accessor: "tenMG" },
    { header: "Đội thắng", accessor: "tenDoiThang" },
    { header: "Sân", accessor: "tenSan" },
    {
      header: "Ngày giờ dự kiến",
      accessor: "ngayGioDuKien",
      accessFunction: (data: any) => {
        return new Date(data.ngayGioDuKien!!).toLocaleString("vi-VN");
      },
    },
    {
      header: "Ngày giờ thực tế",
      accessor: "ngayGioThucTe",
      accessFunction: (data: any) => {
        return new Date(data.ngayGioThucTe!!).toLocaleString("vi-VN");
      },
    },
  ];

  onMount(() => {
    for (const ltd of lichSu) {
      let tenDoiThang =
        danhSachDoi.find((value) => value.maDoi == ltd.doiThang)?.tenDoi ??
        null;
      if (tenDoiThang === null) tenDoiThang = "Hòa";
      ltd.tenDoiThang = tenDoiThang;
      
      ltd.tenVTD = danhSachVTD.find((value) => value.maVTD === ltd.maVTD)?.tenVTD ?? "";
      ltd.tenSan = danhSachSan.find(value => value.maSan === ltd.maSan)?.tenSan ?? "";
      ltd.tenDoiMot =
        danhSachDoi.find((value) => value.maDoi == ltd.doiMot)?.tenDoi ?? "";
      ltd.tenDoiHai =
        danhSachDoi.find((value) => value.maDoi == ltd.doiHai)?.tenDoi ?? "";
    }
  });

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
