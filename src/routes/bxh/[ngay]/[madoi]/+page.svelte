<script lang="ts">
  import type { PageProps } from "./$types";
  import Table from "$lib/components/Table.svelte";
  import type { CauThuGhiBan } from "$lib/typesResponse";
  import { onMount } from "svelte";

  let { data }: PageProps = $props();

  let danhSachCauThu: CauThuGhiBan[] = $state(data.dsCTGhiBan);

  onMount(() => {
    danhSachCauThu.sort((a, b) => b.soBanThang - a.soBanThang);
  });

  const columns = [
    { header: "", accessor: "maCT", hidden: true },
    { header: "Tên cầu thủ", accessor: "tenCT" },
    { header: "Tên đội", accessor: "tenDoi" },
    { header: "Loại cầu thủ", accessor: "maLCT" },
    { header: "Số bàn thắng", accessor: "soBanThang" },
  ];
</script>

<div class="page-content">
  <h1 class="content-title text-3xl font-bold text-gray-800 mb-2">
    Chi Tiết Cầu Thủ Ghi Bàn
  </h1>
  <div class="title-underline w-64 h-1 bg-green-600 mb-8"></div>

  <Table
    title={"Danh sách cầu thủ ghi bàn cho đội " +
      (danhSachCauThu[0]?.tenDoi || "Đội")}
    {columns}
    data={danhSachCauThu}
    redirectParam={""}
    tableType={""}
    isEditable={false}
  />
</div>
