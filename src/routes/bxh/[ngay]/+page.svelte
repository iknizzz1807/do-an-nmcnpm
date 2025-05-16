<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import { showErrorToast } from "$lib/components/Toast";
  import type { BangXepHangNgay } from "$lib/typesResponse";
  import dateFormat from "dateformat";

  const { data } = $props();
  let dateBXH: string = $state(data.dateBXH);
  $inspect(dateBXH);
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

  const onDateChange = async (e: Event) => {
    try {
      const reponse = await fetch(
        "/api/bxh/" + dateFormat(dateBXH, "isoDate"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!reponse.ok) throw new Error("Failed to fetch data");

      bangXepHangNgay = await reponse.json();
    } catch (err) {
      showErrorToast(String(err));
    }
  };
</script>

<svelte:head>
  <title>Bảng xếp hạng</title>
</svelte:head>

<div class="page-content">
  <h1 class="content-title text-3xl font-bold text-gray-800 mb-2">
    Bảng Xếp Hạng Giải Đấu
  </h1>
  <div class="title-underline w-48 h-1 bg-purple-600 mb-8"></div>

  <form class="mb-6 bg-white p-4 rounded-lg shadow border border-gray-200">
    <label class="block text-gray-700 text-sm font-medium mb-1" for="dateBXH">
      Chọn ngày xem bảng xếp hạng
    </label>
    <input
      id="dateBXH"
      type="date"
      onchange={onDateChange}
      class="shadow-sm appearance-none border border-gray-300 rounded-md w-full md:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      required
      bind:value={dateBXH}
    />
  </form>
  <Table
    title={"Bảng xếp hạng ngày " +
      (dateBXH.trim() === ""
        ? new Date()
        : new Date(dateBXH)
      ).toLocaleDateString("vi-VN")}
    {columns}
    data={bangXepHangNgay}
    redirectParam={"maDoi"}
    tableType={"bxh/" + dateFormat(dateBXH, "isoDate")}
  />
</div>
