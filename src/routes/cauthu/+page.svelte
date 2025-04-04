<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import type { CauThu } from "$lib/typesDatabase";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import Form, { type FormField, type FormInputMap } from "$lib/components/Form.svelte";
  import { SvelteMap } from "svelte/reactivity";
  let { data }: PageProps = $props();

  let danhSachCauThu: CauThu[] = $state(data.danhSachCauThu);
  const tuoiMin : number = $state(data.tuoiMin);
  const tuoiMax : number = $state(data.tuoiMax);
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - tuoiMax);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - tuoiMin);

  let danhSachCauThuCopy = danhSachCauThu;

  const columns = [
    { header: "Mã cầu thủ", accessor: "maCT", hidden: true },
    { header: "Tên cầu thủ", accessor: "tenCT" },
    { header: "Loại cầu thủ", accessor: "loaiCT" },
    { header: "Ghi chú", accessor: "ghiChu" },
    { header: "Nước ngoài", accessor: "nuocNgoai" },
    { header: "Ngày sinh", accessor: "ngaySinh" },
    { header: "Bàn thắng", accessor: "banThang" },
  ];

  const formFields : FormField[] = [
    { label: "Tên cầu thủ", propertyName: "tenCT", type: "input", valueType: "string" },
    
    { label: "Loại cầu thủ", propertyName: "loaiCT", type: "select", valueType: "number", options: [
      { optionValue: 1, optionName: "1" },
      { optionValue: 2, optionName: "2" },
      { optionValue: 3, optionName: "3" },
      { optionValue: 4, optionName: "4" },
      { optionValue: 5, optionName: "5" },
    ]},

    { label: "Ghi chú", propertyName: "ghiChu", type: "input", valueType: "string" },

    { label: "Nước ngoài", propertyName: "nuocNgoai", type: "select", valueType: "number", options: [
      { optionValue: 0, optionName: "Không" },
      { optionValue: 1, optionName: "Có" },
    ]},

    { label: "Ngày sinh", propertyName: "ngaySinh", type: "Date", valueType: "Date",
      min: minDate.toISOString().slice(0, 10), max: maxDate.toISOString().slice(0, 10) }
  ]

  let formState: boolean = $state(false);
  let selectedIndex: number = $state(0);
  let editData : FormInputMap = $state(new SvelteMap());

  let searchTerm: string = $state("");
  let isOpen: boolean = $state(false);

  let filteredResults: any[] = $state([]);
  $effect(() => {
    filteredResults = danhSachCauThu.filter((result) =>
      result.tenCT.toLowerCase().includes(searchTerm.toLowerCase())
    );
    //
  });

  const searchPlayer = () => {
    danhSachCauThu = danhSachCauThuCopy.filter((result) =>
      result.tenCT.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

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

  const onOpenForm = () : FormInputMap | null => {
    if (editData.size > 0)
      return editData;
    return new SvelteMap();
  }

  const onCloseForm = () => {
    editData.clear();
  }

  const onEditClick = (data: any, index: number) => {
    if (data satisfies CauThu) {
      editData.clear();
      editData.set("maCT", data.maCT);
      editData.set("tenCT", data.tenCT);
      editData.set("loaiCT", parseInt(data.loaiCT));
      editData.set("ghiChu", data.ghiChu);
      editData.set("nuocNgoai", Number(data.nuocNgoai));
      editData.set("ngaySinh", new Date(data.ngaySinh));
      console.log(editData);
      formState = true;
      selectedIndex = index;
    } else {
      console.error("Data không thỏa mãn loại CauThu");
      selectedIndex = -1;
    }
  };

  const onDeleteClick = async (data: CauThu, index: number) => {
    if (data satisfies CauThu) {
      selectedIndex = index;
      await deletePlayer(data);
    } else {
      console.error("Data không thỏa mãn loại CauThu");
    }
  };

  const updatePlayer = async (e: Event, data: CauThu) => {
    e.preventDefault();

    if (data.tenCT.trim() === "" || data.ghiChu.trim() === "") {
      showErrorToast("Vui lòng điền đầy đủ form");
      return;
    }

    try {
      const response = await fetch("/api/cauthu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        showErrorToast("Lỗi cập nhật cầu thủ");
        throw new Error("Lỗi cập nhật cầu thủ");
      }

      const result = await response.json();

      const tempBanThang = danhSachCauThu[selectedIndex].banThang;
      danhSachCauThu[selectedIndex] = result satisfies CauThu;
      danhSachCauThu[selectedIndex].banThang = tempBanThang;

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Cập nhật cầu thủ mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };

  const deletePlayer = async (data: CauThu) => {
    try {
      const response = await fetch("/api/cauthu", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maCT: data.maCT }),
      });

      if (!response.ok) {
        showErrorToast("Lỗi cập nhật cầu thủ");
        throw new Error("Lỗi cập nhật cầu thủ");
      }

      danhSachCauThu.splice(selectedIndex, 1);

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Cập nhật cầu thủ mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
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
      onkeydown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          searchPlayer();
        }
      }}
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
  {onDeleteClick}
  {onEditClick}
/>

<Form 
  bind:formState={formState}
  fields={formFields}  
  submitForm={updatePlayer}
  onCloseForm={onCloseForm}
  onOpenForm={onOpenForm}

/>