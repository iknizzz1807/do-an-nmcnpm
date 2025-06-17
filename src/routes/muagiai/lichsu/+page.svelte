<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import type { MuaGiai } from "$lib/typesDatabase";
  let { data }: PageProps = $props();

  let lichSu = $state(data.lichSu);

  const columns = [
    { header: "ID", accessor: "BackupID", hidden: true },
    { 
      header: "Ngày chỉnh sửa", 
      accessor: "modifiedDate",
      accessFunction: (data : any) => new Date(data.modifiedDate).toLocaleString("vi-VN"), 
    },
    { header: "Mã mùa giải", accessor: "maMG" },
    { header: "Tên mùa giải", accessor: "tenMG" },
    {
      header: "Ngày diễn ra",
      accessor: "ngayDienRa",
      accessFunction: (data: MuaGiai) =>
        new Date(data.ngayDienRa!!).toLocaleDateString("vi-VN"),
    },
    {
      header: "Ngày kết thúc",
      accessor: "ngayKetThuc",
      accessFunction: (data: MuaGiai) =>
        new Date(data.ngayKetThuc!!).toLocaleDateString("vi-VN"),
    },
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
  showTeamLogo={true}
/>
