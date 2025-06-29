<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import type { CauThu, LoaiCT } from "$lib/typesDatabase";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import Form, {
    type FormField,
    type FormInputMap,
  } from "$lib/components/Form.svelte";
  import { SvelteMap } from "svelte/reactivity";
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  let { data }: PageProps = $props();

  let danhSachLoaiCT: LoaiCT[] = $state(data.loaiCTs);
  let danhSachCauThu: CauThu[] = $state(data.danhSachCauThu);
  const isEditable = $state(data.isEditable);
  const tuoiMin: number = $state(data.tuoiMin);
  const tuoiMax: number = $state(data.tuoiMax);
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - tuoiMax);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - tuoiMin);

  let danhSachCauThuCopy = danhSachCauThu;

  const formFields: FormField[] = [
    {
      label: "Tên cầu thủ",
      propertyName: "tenCT",
      type: "input",
      valueType: "string",
    },

    {
      label: "Ngày sinh",
      propertyName: "ngaySinh",
      type: "Date",
      valueType: "Date",
      min: minDate.toISOString().slice(0, 10),
      max: maxDate.toISOString().slice(0, 10),
    },

    {
      label: "Loại cầu thủ",
      propertyName: "maLCT",
      type: "select",
      valueType: "number",
      options: danhSachLoaiCT.map((value) => ({
        optionValue: value.maLCT ?? 0,
        optionName: value.tenLCT,
      })),
    },
    {
      label: "Số áo",
      propertyName: "soAo",
      type: "input",
      valueType: "number",
    },
    {
      label: "Ghi chú",
      propertyName: "ghiChu",
      type: "input",
      valueType: "string",
    },
  ];

  const columns = [
    { header: "Mã cầu thủ", accessor: "maCT" },
    { header: "Tên cầu thủ", accessor: "tenCT" },
    {
      header: "Ngày sinh",
      accessor: "ngaySinh",
      accessFunction: (data: CauThu) => {
        return new Date(data.ngaySinh).toLocaleDateString("vi-VN");
      },
    },
    {
      header: "Loại cầu thủ",
      accessor: "maLCT",
      accessFunction: (data: CauThu) => {
        return (
          danhSachLoaiCT.find((value) => value.maLCT === data.maLCT)?.tenLCT ??
          ""
        );
      },
    },
    //{ header: "Nước ngoài", accessor: "nuocNgoai" },
    { header: "Ghi chú", accessor: "ghiChu" },
    { header: "Số bàn thắng", accessor: "banThang" },
  ];

  let formState: boolean = $state(false);
  let selectedIndex: number = $state(0);
  let editData: FormInputMap = $state(new SvelteMap());

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

  const onOpenForm = (): FormInputMap | null => {
    if (editData.size > 0) return editData;
    return new SvelteMap();
  };

  const onCloseForm = () => {
    editData.clear();
    selectedIndex = -1;
    formState = false;
  };

  const onEditClick = (data: any, index: number) => {
    if (data satisfies CauThu) {
      editData.clear();
      editData.set("maCT", data.maCT);
      editData.set("tenCT", data.tenCT);
      editData.set("ngaySinh", new Date(data.ngaySinh));
      editData.set("ghiChu", data.ghiChu);
      editData.set("maLCT", parseInt(data.maLCT));
      editData.set("soAo", data.soAo);
      editData.set("maDoi", data.maDoi);
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
      selectedIndex = -1;
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
        const responseData = await response.json();
        throw new Error(responseData.message || "Lỗi cập nhật cầu thủ");
      }

      const result = await response.json();

      const tempBanThang = danhSachCauThu[selectedIndex].banThang;
      danhSachCauThu[selectedIndex] = result satisfies CauThu;
      danhSachCauThu[selectedIndex].banThang = tempBanThang;

      formState = false;
      showOkToast("Cập nhật cầu thủ mới thành công");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        showErrorToast(error.message);
      } else console.error("Error:", error);
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
        const responseData = await response.json();
        throw new Error(responseData.message || "Lỗi cập nhật cầu thủ");
      }

      danhSachCauThu.splice(selectedIndex, 1);

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Xóa cầu thủ thành công");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        showErrorToast(error.message);
      } else console.error("Error:", error);
    }
  };
</script>

<svelte:head>
  <title>Các Cầu thủ</title>
</svelte:head>

<div class="w-full max-w-4xl mx-auto relative mb-6">
  <div class="flex gap-4 justify-center items-center">
    <div class="relative flex-1">
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

    <div>
      {#if isEditable}
        <div class="flex justify-center items-center">
          <a
            class="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md cursor-pointer text-base font-semibold transition-all duration-200 transform hover:-translate-y-0.5"
            href="/cauthu/lichsu"
          >
            Lịch sử cập nhật
          </a>
        </div>
      {/if}
    </div>
  </div>
</div>

<Table
  title="Danh sách các Cầu thủ"
  {columns}
  data={filteredResults}
  redirectParam={"maCT"}
  tableType="cauthu"
  {onDeleteClick}
  {onEditClick}
  {isEditable}
/>

<Form
  bind:formState
  fields={formFields}
  submitForm={updatePlayer}
  {onCloseForm}
  {onOpenForm}
/>
