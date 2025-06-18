<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import type { MuaGiai, SanNha } from "$lib/typesDatabase";
  import { onMount } from "svelte";
  import type { DoiBongBackup } from "$lib/typesBackup";
  let { data }: PageProps = $props();

  let lichSu : DoiBongBackup[] = $state(data.lichSu);
  let danhSachSanNha: SanNha[] = $state(data.danhSachSanNha);

  const columns = [
    { header: "ID", accessor: "BackupID", hidden: true },
    { 
      header: "Ngày chỉnh sửa", 
      accessor: "modifiedDate",
      accessFunction: (data : any) => new Date(data.modifiedDate).toLocaleString("vi-VN"), 
    },
    { header: "Mã đội", accessor: "maDoi" },
    { header: "Tên đội", accessor: "tenDoi" },
    { header: "Mã sân", accessor: "maSan" },
  ];

  onMount(() => {
    for (const doiBong of lichSu) {
      doiBong.tenSan =
        danhSachSanNha.find((val) => val.maSan === doiBong.maSan)?.tenSan ?? "";
    }
  })
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
