<script lang="ts">
  import type { PageProps } from "./$types";
  import Table from "$lib/components/Table.svelte";
  let { data }: PageProps = $props();
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import type { CauThu, LoaiCT } from "$lib/typesDatabase";
  import { showOkToast, showErrorToast } from "$lib/components/Toast";
  import type { FieldOption, FormField, FormInputMap } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import { SvelteMap } from "svelte/reactivity";

  let danhSachCauThu: CauThu[] = $state(data.danhSachCauThu);
  const isEditable = $state(data.isEditable);
  const danhSachLoaiCT: LoaiCT[] = $state(data.loaiCTs);
  const tuoiMin : number = $state(data.tuoiMin);
  const tuoiMax : number = $state(data.tuoiMax);
  const ma_doi = data.ma_doi;
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - tuoiMax);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - tuoiMin);

  const formFields: FormField[] = [
    { label: "Tên cầu thủ", propertyName: "tenCT", type: "input", valueType: "string"},

    { label: "Ngày sinh", propertyName: "ngaySinh", type: "Date", valueType: "Date", 
      min: minDate.toISOString().slice(0, 10), max: maxDate.toISOString().slice(0, 10)},

    { label: "Loại cầu thủ", propertyName: "maLCT", type: "select", valueType: "number", 
      options: danhSachLoaiCT.map((value) => ({optionValue: value.maLCT ?? 0, optionName: value.tenLCT})) },

    { label: "Số áo", propertyName: "soAo", type: "input", valueType: "number"},
    { label: "Ghi chú", propertyName: "ghiChu", type: "input", valueType: "string"},
  ];

  const columns = [
    { header: "Mã cầu thủ", accessor: "maCT", hidden: true },
    { header: "Tên cầu thủ", accessor: "tenCT" },
    { header: "Ngày sinh", accessor: "ngaySinh" },
    { header: "Loại cầu thủ", accessor: "maLCT", accessFunction: (data: CauThu) => {
      return danhSachLoaiCT.find((value) => value.maLCT === data.maLCT)?.tenLCT ?? "";
    } },
    { header: "Số áo", accessor: "soAo" },
    //{ header: "Nước ngoài", accessor: "nuocNgoai" },
    { header: "Ghi chú", accessor: "ghiChu" },
  ];
  let formState : boolean = $state(false);
  let editData : FormInputMap = $state(new SvelteMap());

  let selectedIndex: number = $state(-1);
  let maCT: number = $state(0);

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
      editData.set("maLCT", parseInt(data.maLCT));
      editData.set("ghiChu", data.ghiChu);
      //editData.set("nuocNgoai", Number(data.nuocNgoai));
      editData.set("ngaySinh", new Date(data.ngaySinh));
      selectedIndex = index;
      formState = true;
    }
    else {
      formState = false;
      selectedIndex = -1;
    }
  };

  const submitForm = async (e: Event, data: CauThu) => {
    e.preventDefault();
    if (selectedIndex === -1)
      addPlayer(data);
    else
      updatePlayer(data);
  }
  
  const onDeleteClick = async (e: Event) => {
    e.preventDefault();

  }


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
      const response = await fetch("/api/cauthu" + ma_doi, {
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

      danhSachCauThu[selectedIndex] = result satisfies CauThu;

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Cập nhật cầu thủ mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };

</script>

<Table
  title={"Danh sách các cầu thủ"}
  {columns}
  data={danhSachCauThu}
  redirectParam={""}
  tableType={"cauthu"}
  onEditClick={onEditClick}
  isEditable={isEditable}
/>


{#if isEditable}
  <div class="flex justify-center">
    <ButtonPrimary text={"Thêm cầu thủ"} onclick={() => formState = true} />
  </div>
{/if}

<Form 
  fields={formFields}
  submitForm={submitForm}
  onOpenForm={onOpenForm}
  onCloseForm={onCloseForm}
  bind:formState={formState}
  />