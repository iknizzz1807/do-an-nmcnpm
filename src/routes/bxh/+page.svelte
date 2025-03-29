<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import { showErrorToast } from "$lib/components/Toast";
  import type { BangXepHangNgay } from "$lib/types";

  let date : String = $state("");
  let bangXepHangNgay: BangXepHangNgay[] = $state([]);
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

  const onDateChange = async () => {
    try {
      const reponse = await fetch("/api/bangxephang/ngay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ date: date })
      })
      if (!reponse.ok)
        throw new Error("Failed to fetch dâta");

      bangXepHangNgay = await reponse.json();

    } catch (err) {
      showErrorToast(String(err));
    }
  }
</script>

<svelte:head>
  <title>Bảng xếp hạng</title>
</svelte:head>


<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Danh sách mùa giải</h1>
  
  <form>
    <label
      class="block text-gray-700 text-sm font-bold mb-2"
      for="date"
    >
    Ngày
    </label>
    <input
      id="date"
      type="date"
      onchange={onDateChange}
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      required
      bind:value={date}
    />
  </form>
  <Table
    title={"Bảng xếp hạng ngày " + new Date().toDateString()}
    {columns}
    data={bangXepHangNgay}
    redirectParam={"maDoi"}
    tableType="bxh"
  />
</div>
