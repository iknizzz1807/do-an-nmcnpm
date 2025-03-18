<script lang="ts">
  import type { PageProps } from "./$types";
  import Table from "$lib/components/Table.svelte";
  let { data }: PageProps = $props();
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import type { CauThu } from "$lib/types";
  import { showOkToast, showErrorToast } from "$lib/components/Toast";
  import type { FormField, FormInputMap } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import { SvelteMap } from "svelte/reactivity";

  let danhSachCauThu: CauThu[] = $state(data.danhSachCauThu);
  const ma_doi = data.ma_doi;

  const formFields: FormField[] = [
    { label: "Tên cầu thủ", propertyName: "tenCT", type: "input", valueType: "string"},
    { label: "Ngày sinh", propertyName: "ngaySinh", type: "Date", valueType: "Date"},
    { label: "Loại cầu thủ", propertyName: "loaiCT", type: "select", valueType: "number", 
      options: [ { optionValue: 1, optionName: "1" }, {optionValue: 2, optionName: "2"}, {optionValue: 3, optionName: "3"}]},
    { label: "Nước ngoài", propertyName: "nuocNgoai", type: "select", valueType: "number", 
      options: [ { optionValue: 0, optionName: "Không" }, {optionValue: 1, optionName: "Có"}]},
    { label: "Ghi chú", propertyName: "ghiChu", type: "input", valueType: "string"},
  ];

  const columns = [
    { header: "Mã cầu thủ", accessor: "maCT", hidden: true },
    { header: "Tên cầu thủ", accessor: "tenCT" },
    { header: "Ngày sinh", accessor: "ngaySinh" },
    { header: "Loại cầu thủ", accessor: "loaiCT" },
    { header: "Nước ngoài", accessor: "nuocNgoai" },
    { header: "Ghi chú", accessor: "ghiChu" },
  ];
  let formState : boolean = $state(false);
  let editData : FormInputMap = $state(new SvelteMap());
  $inspect(formState);

  let updateIndex: number = $state(-1);
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
      editData.set("loaiCT", parseInt(data.loaiCT));
      editData.set("ghiChu", data.ghiChu);
      editData.set("nuocNgoai", parseInt(data.nuocNgoai));
      editData.set("ngaySinh", new Date(data.ngaySinh));
      updateIndex = index;
      formState = true;
    }
    else {
      formState = false;
      updateIndex = -1;
    }
  };

  const submitForm = async (e: Event, data: CauThu) => {
    e.preventDefault();
    if (updateIndex === -1)
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
      console.log(data);
      const response = await fetch("/api/cauthu/" + ma_doi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        showErrorToast("Lỗi tạo cầu thủ");
        throw new Error("Lỗi tạo cầu thủ");
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
      console.log(data);
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

      danhSachCauThu[updateIndex] = result satisfies CauThu;

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
/>

<div class="flex justify-center">
  <ButtonPrimary text={"Thêm cầu thủ"} onclick={() => formState = true} />
</div>

<Form 
  fields={formFields}
  submitForm={submitForm}
  onOpenForm={onOpenForm}
  onCloseForm={onCloseForm}
  bind:formState={formState}
  />