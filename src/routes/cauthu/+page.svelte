<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import type { CauThu } from "$lib/types";
  let { data }: PageProps = $props();

  let danhSachCauThu: CauThu[] = $state(data.danhSachCauThu);

  const columns = [
    { header: "Tên cầu thủ", accessor: "tenCT" },
    { header: "Loại cầu thủ", accessor: "loaiCT" },
    { header: "Ghi chú", accessor: "ghiChu" },
    { header: "Nước ngoài", accessor: "nuocNgoai" },
    { header: "Ngày sinh", accessor: "ngaySinh" },
  ];

  let searchTerm: string = $state("");
  let isOpen: boolean = $state(false);

  let filteredResults: any[] = $state([]);
  $effect(() => {
    filteredResults = danhSachCauThu.filter((result) =>
      result.tenCT.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  function handleInputChange() {
    isOpen = searchTerm.length > 0;
  }

  function handleFocus() {
    isOpen = searchTerm.length > 0;
  }

  function handleBlur() {
    setTimeout(() => {
      isOpen = false;
    }, 200);
  }
</script>

<svelte:head>
  <title>Các Cầu thủ</title>
</svelte:head>

<div class="w-full max-w-md mx-auto relative">
  <div class="relative">
    <div
      class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
    >
      <svg
        class="w-4 h-4 text-gray-500"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
        />
      </svg>
    </div>
    <input
      type="search"
      class="w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
      placeholder="Tìm kiếm..."
      bind:value={searchTerm}
      oninput={handleInputChange}
      onfocus={handleFocus}
      onblur={handleBlur}
    />
  </div>

  {#if isOpen && searchTerm}
    <div
      class="absolute z-10 w-full bg-white divide-y divide-gray-100 rounded-lg shadow-lg mt-1 border border-gray-200"
    >
      {#if filteredResults.length > 0}
        <ul class="py-2 text-sm text-gray-700">
          {#each filteredResults as result}
            <li>
              <div class="px-4 py-3 hover:bg-gray-100 cursor-pointer">
                <div class="font-medium">{result.tenCT}</div>
                <div class="text-xs text-gray-500">{result.ghiChu}</div>
              </div>
            </li>
          {/each}
        </ul>
      {:else}
        <div class="p-4 text-sm text-gray-500">Không tìm thấy kết quả nào.</div>
      {/if}
    </div>
  {/if}
</div>

<Table
  title="Danh sách các Cầu thủ"
  {columns}
  data={danhSachCauThu}
  redirectParam={"tenCT"}
  tableType="cauThu"
/>
