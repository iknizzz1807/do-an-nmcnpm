<script lang="ts">
  import LeagueTable from "$lib/components/LeagueTable.svelte";
  import Table from "$lib/components/Table.svelte";
  import type { BangXepHangNgay } from "$lib/types";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let bangXepHangNgay: BangXepHangNgay[] = $state(data.bangXepHangNgay);
  const columns = [
    { header: "", accessor: "maDoi", hidden: true },
    { header: "Tên đội", accessor: "tenDoi" },
    { header: "Số trận", accessor: "soTran" },
    { header: "Số trận thắng", accessor: "soTranThang" },
    { header: "Số trận thua", accessor: "soTranThua" },
    { header: "Số trận hòa", accessor: "soTranHoa" },
    { header: "Hiệu số", accessor: "hieuSo" },
    { header: "Hạng", accessor: "hang" },
  ];
</script>

<svelte:head>
  <title>Bảng xếp hạng</title>
</svelte:head>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Danh sách mùa giải</h1>
  <Table
    title={"Bảng xếp hạng ngày " + new Date().toDateString()}
    {columns}
    data={bangXepHangNgay}
    redirectParam={"maDoi"}
    tableType="bxh"
  />
</div>
