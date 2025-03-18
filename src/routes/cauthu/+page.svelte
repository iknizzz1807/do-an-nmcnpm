<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import type { CauThu } from "$lib/types";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  let { data }: PageProps = $props();

  let danhSachCauThu: CauThu[] = $state(data.danhSachCauThu);

  const columns = [
    { header: "Tên cầu thủ", accessor: "tenCT" },
    { header: "Loại cầu thủ", accessor: "loaiCT" },
    { header: "Ghi chú", accessor: "ghiChu" },
    { header: "Nước ngoài", accessor: "nuocNgoai" },
    { header: "Ngày sinh", accessor: "ngaySinh" },
  ];
  let maCT: number = $state(0);
  let tenCTInput: string = $state("");
  let loaiCTInput: number = $state(0);
  let ghiChuInput: string = $state("");
  let nuocNgoaiInput: boolean = $state(false);
  let ngaySinhInput: string = $state(new Date().toISOString().split("T")[0]);
  
  let formState: boolean = $state(false);
  let selectedIndex : number = $state(0);

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

  const openForm = () => {
    formState = true;
  };

  const resetInput = () => {
    tenCTInput = "";
    loaiCTInput = 0;
    ghiChuInput = "";
    nuocNgoaiInput = false;
    ngaySinhInput = new Date().toISOString().split("T")[0];
    selectedIndex = 0;
  };

  const closeForm = () => {
    formState = false;
    resetInput();
  };

  const onEditClick = (data: any, index: number) => {
    if (data satisfies CauThu) {
      selectedIndex = index;
      maCT = data.maCT;
      tenCTInput = data.tenCT;
      loaiCTInput = parseInt(data.loaiCT);
      ghiChuInput = data.ghiChu;
      nuocNgoaiInput = Boolean(parseInt(data.nuocNgoai));
      ngaySinhInput = data.ngaySinh;
      openForm();
    }
    else {
      console.error("Data không thỏa mãn loại CauThu");
    }
  }

  const onDeleteClick = async (data : any, index: number) => {
    if (data satisfies CauThu) {
      selectedIndex = index;
      maCT = data.maCT;
      await deletePlayer();
    }
    else {
      console.error("Data không thỏa mãn loại CauThu");
    }
  }

  const updatePlayer = async (e: Event) => {
    e.preventDefault();

    if (tenCTInput.trim() === "" || ghiChuInput.trim() === "") {
      showErrorToast("Vui lòng điền đầy đủ form");
      return;
    }

    const dataInput : CauThu = {
      maCT: maCT,
      tenCT: tenCTInput,
      loaiCT: loaiCTInput,
      ghiChu: ghiChuInput,
      nuocNgoai: nuocNgoaiInput,
      ngaySinh: ngaySinhInput,
    };

    try {
      console.log(dataInput);
      const response = await fetch("/api/cauthu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataInput),
      });

      if (!response.ok) {
        showErrorToast("Lỗi cập nhật cầu thủ");
        throw new Error("Lỗi cập nhật cầu thủ");
      }

      const result = await response.json();

      danhSachCauThu[selectedIndex] = result satisfies CauThu;

      // Đóng form và hiện toast thành công sau khi thành công
      closeForm();
      showOkToast("Cập nhật cầu thủ mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    };
  };

  const deletePlayer = async () => {
    try {
      const response = await fetch("/api/cauthu", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maCT: maCT }),
      });

      if (!response.ok) {
        showErrorToast("Lỗi cập nhật cầu thủ");
        throw new Error("Lỗi cập nhật cầu thủ");
      }

      danhSachCauThu.splice(selectedIndex, 1);

      // Đóng form và hiện toast thành công sau khi thành công
      closeForm();
      showOkToast("Cập nhật cầu thủ mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    };
  };

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
  redirectParam={""}
  tableType="cauThu"
  deleteButton={true}
  onDeleteClick={onDeleteClick}
  editButton={true}
  onEditClick={onEditClick}
/>


{#if formState}
  <div
    class="fixed inset-0 flex items-center justify-center backdrop-blur-[1px] bg-white/30"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Tạo cầu thủ mới</h2>
      <form onsubmit={updatePlayer}>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="tenDoi"
          >
            Tên cầu thủ
          </label>
          <input
            id="tenDoi"
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            bind:value={tenCTInput}
          />
        </div>

        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="loaiCT"
          >
            Loại cầu thủ
          </label>
          <select
            id="loaiCT"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            bind:value={loaiCTInput}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="tenDoi"
          >
            Ghi chú
          </label>
          <input
            id="tenDoi"
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            bind:value={ghiChuInput}
          />
        </div>

        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="loaiCT"
          >
            Nước ngoài?
          </label>
          <select
            id="loaiCT"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            bind:value={nuocNgoaiInput}
          >
            <option value="1">Không</option>
            <option value="2">Có</option>
          </select>
        </div>

        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="ngaySinh"
          >
            Ngày sinh
          </label>
          <input
            id="ngaySinh"
            type="date"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            bind:value={ngaySinhInput}
          />
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            onclick={closeForm}
          >
            Hủy
          </button>
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onclick={updatePlayer}
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}