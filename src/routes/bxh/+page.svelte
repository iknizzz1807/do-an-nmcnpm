<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import { showErrorToast } from "$lib/components/Toast";
  import type { MuaGiai } from "$lib/typesDatabase.js";
  import type { BangXepHangNgay } from "$lib/typesResponse";
  import dateFormat from "dateformat";

  const { data } = $props();
  let dateBXH: string = $state(data.dateBXH);
  let monthBXH: string = $state("");
  let danhSachMuaGiai: MuaGiai[] = $state(data.danhSachMuaGiai);
  let muaGiaiBXH: MuaGiai | null = $state(null);
  let bxhSelected: ("ngay" | "thang" | "muagiai") = $state("ngay");

  $inspect(dateBXH);
  let bangXepHang: BangXepHangNgay[] = $state(data.bangXepHangNgay);
  const columns = [
    { header: "", accessor: "maDoi", hidden: true },
    { header: "Tên đội", accessor: "tenDoi" },
    { header: "Số trận", accessor: "soTran" },
    { header: "Số trận thắng", accessor: "soTranThang" },
    { header: "Số trận thua", accessor: "soTranThua" },
    { header: "Số trận hòa", accessor: "soTranHoa" },
    { header: "Hiệu số", accessor: "hieuSo" },
    { header: "Số bàn thắng", accessor: "soBanThang" },
    { header: "Hạng", accessor: "hang" },
  ];

  const onDateChange = async (e: Event) => {
    try {
      bangXepHang = [];
      console.log("dateBXH", dateBXH);
      const reponse = await fetch(
        "/api/bxh/ngay/" + dateFormat(dateBXH, "isoDate"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!reponse.ok) throw new Error("Failed to fetch data");

      bangXepHang = await reponse.json();
    } catch (err) {
      showErrorToast(String(err));
    }
  };

  const onMonthChange = async (e: Event) => {
    try {
      bangXepHang = [];
      const reponse = await fetch(
        "/api/bxh/thang/" + dateFormat(monthBXH, "isoDate"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!reponse.ok) throw new Error("Failed to fetch data");

      bangXepHang = await reponse.json();
    } catch (err) {
      showErrorToast(String(err));
    }
  };
  
  const onMuaGiaiChange = async (e: Event) => {
    try {
      bangXepHang = [];
      const reponse = await fetch(
        "/api/bxh/muagiai/" + muaGiaiBXH!!.maMG,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!reponse.ok) throw new Error("Failed to fetch data");

      bangXepHang = await reponse.json();
    } catch (err) {
      showErrorToast(String(err));
    }
  };
</script>

<svelte:head>
  <title>Bảng xếp hạng</title>
</svelte:head>

<div class="page-content">
  <!-- <h1 class="content-title text-3xl font-bold text-gray-800 mb-2">
    Bảng Xếp Hạng Giải Đấu
  </h1>
  <div class="title-underline w-88 h-1 bg-purple-600 mb-8"></div> -->

  <div class="mb-6 bg-white p-4 rounded-lg shadow border border-gray-200">
    <form class="flex items-center space-x-2 mb-4">
      <input type="radio" id="ngay" name="bxh" value="ngay" bind:group={bxhSelected} checked>
      <label for="ngay">Theo ngày</label>
      <input type="radio" id="thang" name="bxh" value="thang" bind:group={bxhSelected}>
      <label for="thang">Theo tháng</label>
      <input type="radio" id="muagiai" name="bxh" value="muagiai" bind:group={bxhSelected}>
      <label for="muagiai">Theo mùa giải</label>
    </form>

    {#if bxhSelected === "muagiai"}
      <label
        class="block text-gray-700 text-sm font-medium mb-1.5"
        for="muaGiaiBXH"
      >
        Chọn ngày xem mùa giải
      </label>
      <select
        id="muaGiaiBXH"
        class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2.5 px-3.5 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        required
        onchange={onMuaGiaiChange}
        bind:value={muaGiaiBXH}
      >
        {#each danhSachMuaGiai as muaGiai}
          <option value={muaGiai}>{muaGiai.tenMG}</option>
        {/each}
      </select>
    {:else if bxhSelected === "thang"}
      <label class="block text-gray-700 text-base font-medium mb-1" for="monthBXH">
        Chọn ngày xem bảng xếp hạng
      </label>
      <input
        id="monthBXH"
        type="month"
        onchange={onMonthChange}
        class="shadow-sm appearance-none border border-gray-300 rounded-md w-full md:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        required
        bind:value={monthBXH}
        />
    {:else}
      <label class="block text-gray-700 text-base font-medium mb-1" for="dateBXH">
        Chọn ngày xem bảng xếp hạng
      </label>
      <input
        id="dateBXH"
        type="date"
        onchange={onDateChange}
        class="shadow-sm appearance-none border border-gray-300 rounded-md w-full md:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        required
        bind:value={dateBXH}
        />
    {/if}
  </div>
  <Table
    title={"Bảng xếp hạng ngày " +
      (dateBXH.trim() === ""
        ? new Date()
        : new Date(dateBXH)
      ).toLocaleDateString("vi-VN")}
    {columns}
    data={bangXepHang}
    redirectParam={"maDoi"}
    tableType={"bxh/" + bxhSelected + "/" + (bxhSelected === "muagiai" ? 
    muaGiaiBXH?.maMG ?? 0 : 
    (bxhSelected === "thang" ? 
       dateFormat(monthBXH, "isoDate")
      : dateFormat(dateBXH, "isoDate")))}
  />
</div>
