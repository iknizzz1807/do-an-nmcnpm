<script lang="ts">
  import type { PageProps } from "./$types";
  import Table from "$lib/components/Table.svelte";
  let { data }: PageProps = $props();
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import type { CauThu, LoaiCT } from "$lib/typesDatabase";
  import { showOkToast, showErrorToast } from "$lib/components/Toast";
  import type {
    FieldOption,
    FormField,
    FormInputMap,
  } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import { SvelteMap } from "svelte/reactivity";

  let danhSachCauThu: CauThu[] = $state(data.danhSachCauThu);
  const isEditable = $state(data.isEditable);
  const danhSachLoaiCT: LoaiCT[] = $state(data.loaiCTs);
  const tuoiMin: number = $state(data.tuoiMin);
  const tuoiMax: number = $state(data.tuoiMax);
  const ma_doi = data.ma_doi;
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - tuoiMax);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - tuoiMin);

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
    { header: "Mã cầu thủ", accessor: "maCT", hidden: true },
    { header: "Tên cầu thủ", accessor: "tenCT" },
    { header: "Ngày sinh", accessor: "ngaySinh" },
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
    { header: "Số áo", accessor: "soAo" },
    //{ header: "Nước ngoài", accessor: "nuocNgoai" },
    { header: "Ghi chú", accessor: "ghiChu" },
  ];
  let formState: boolean = $state(false);
  let editData: FormInputMap = $state(new SvelteMap());

  let selectedIndex: number = $state(-1);
  let maCT: number = $state(0);

  const onOpenForm = (): FormInputMap | null => {
    if (editData.size > 0) return editData;
    return new SvelteMap();
  };

  const onCloseForm = () => {
    editData.clear();
    selectedIndex = -1;
    formState = false;
  };
  $inspect(selectedIndex, "selectedIndex");

  const onEditClick = (data: any, index: number) => {
    if (data satisfies CauThu) {
      editData.clear();
      editData.set("maCT", data.maCT);
      editData.set("tenCT", data.tenCT);
      editData.set("ngaySinh", new Date(data.ngaySinh));
      editData.set("ghiChu", data.ghiChu);
      editData.set("maLCT", data.maLCT);
      editData.set("soAo", data.soAo);
      editData.set("maDoi", parseInt(ma_doi));
      selectedIndex = index;
      formState = true;
    } else {
      formState = false;
      selectedIndex = -1;
    }
  };

  const submitForm = async (e: Event, data: CauThu) => {
    e.preventDefault();
    console.log(selectedIndex);
    if (selectedIndex === -1) addPlayer(data);
    else updatePlayer(data);
  };

  const addPlayer = async (data: any) => {
    if (data.tenCT.trim() === "" || data.ghiChu.trim() === "") {
      showErrorToast("Vui lòng điền đầy đủ form");
      return;
    }

    try {
      const response = await fetch("/api/cauthu/" + ma_doi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const result = await response.json();

      danhSachCauThu.push(result);

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Tạo cầu thủ mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };

  const updatePlayer = async (data: CauThu) => {
    if (data.tenCT.trim() === "" || data.ghiChu.trim() === "") {
      showErrorToast("Vui lòng điền đầy đủ form");
      return;
    }

    try {
      const response = await fetch("/api/cauthu/" + ma_doi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const result = await response.json();

      danhSachCauThu[selectedIndex] = result satisfies CauThu;

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Cập nhật cầu thủ mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
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
        const error = await response.json();
        if (error.message) {
          throw new Error(error.message);
        }
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

{#if isEditable}
  <div class="flex justify-center gap-4">
    <ButtonPrimary text={"Thêm cầu thủ"} onclick={() => (formState = true)} />
    <a
      class="bg-green-600 mb-4 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md cursor-pointer text-base font-semibold transition-all duration-200 transform hover:-translate-y-0.5"
      href={"/doi/" + data.maDoi + "/lichsu"}
    >
      Lịch sử cập nhật
    </a>
  </div>
{/if}

<Table
  title={"Danh sách các cầu thủ"}
  {columns}
  data={danhSachCauThu}
  redirectParam={""}
  tableType={"cauthu"}
  {onEditClick}
  {onDeleteClick}
  {isEditable}
/>

<Form
  fields={formFields}
  {submitForm}
  {onOpenForm}
  {onCloseForm}
  bind:formState
/>
