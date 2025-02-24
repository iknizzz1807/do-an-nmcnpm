<script lang="ts">
  import LeagueTable from "$lib/components/LeagueTable.svelte";
  import type { BangXepHangNgay } from "$lib/types";
  import type { PageProps } from "./$types";

  let { data } : PageProps = $props();

  let bangXepHangNgay : BangXepHangNgay[] = $state(data.bangXepHangNgay);
  // console.log(bangXepHangNgay);
  const columns = [
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
  <div class="mb-4">
    <select
      name="season"
      id="season"
      class="block p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
    >
      <option value="2024">2024</option>
      <option value="2025">2025</option>
    </select>
  </div>
  <LeagueTable
    title="Bảng xếp hạng ngày 24/02/2025"
    {columns}
    data={bangXepHangNgay}
    redirectParam={"bangXepHang/ngay"}
    tableType="bangXepHang" />
</div>
