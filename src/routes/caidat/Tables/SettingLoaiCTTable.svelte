<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import type { FormField, FormInputMap } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import Table from "$lib/components/Table.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { LoaiCT } from "$lib/typesDatabase";
  import { SvelteMap } from "svelte/reactivity";

  const { dataLoaiCT }: { dataLoaiCT: LoaiCT[] } = $props();

  let loaiCT: LoaiCT[] = $state(dataLoaiCT);
  let editData: FormInputMap = $state(new SvelteMap());
  let formState = $state(false);
  let selectedIndex = $state(-1);

  const columns = [
    { header: "ID", accessor: "maLCT", hidden: true },
    { header: "Tên cầu thủ", accessor: "tenLCT" },
    { header: "Số cầu thủ tối đa", accessor: "soCauThuToiDa" },
  ];
  const roleFields: FormField[] = [
    {
      label: "Tên cầu thủ",
      propertyName: "tenLCT",
      type: "input",
      valueType: "string",
    },
    {
      label: "Số cầu thủ tối đa",
      propertyName: "soCauThuToiDa",
      type: "input",
      valueType: "number",
    },
  ];

  const onOpenForm = (): FormInputMap | null => {
    if (editData.size > -1) return editData;
    return new SvelteMap();
  };

  const onCloseForm = () => {
    editData.clear();
    formState = false;
  };

  const onEditClick = async (data: LoaiCT, index: number) => {
    if (data satisfies LoaiCT) {
      editData.clear();
      editData.set("maLCT", data.maLCT!!);
      editData.set("tenLCT", data.tenLCT);
      editData.set("soCauThuToiDa", data.soCauThuToiDa);
      formState = true;
      selectedIndex = index;
    } else {
      console.error("Data không thỏa mãn");
      selectedIndex = -1;
    }
  };

  const submitForm = async (e: Event, data: LoaiCT) => {
    e.preventDefault();

    if (data.tenLCT.trim() === "") {
      showErrorToast("roleName/viewablePage không thể trống");
      return;
    }

    try {
      const response = await fetch("api/loaict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status !== 500) throw new Error(error.message);
        throw new Error("Không thể update");
      }

      const responseData = await response.json();

      console.log(responseData);
      if (selectedIndex === -1) loaiCT.push(responseData);
      else loaiCT[selectedIndex] = responseData;

      showOkToast("Cập nhật thành công");
      formState = false;
    } catch (err) {
      if (err instanceof Error) showErrorToast(err.message);
    }
  };

  const onDeleteClick = async (data: any, index: number) => {
    if (data satisfies LoaiCT) {
      selectedIndex = index;
      await deleteLoaiCT(data.maLCT);
    } else {
      console.error("Data không thỏa mãn");
    }
  };

  const deleteLoaiCT = async (maLCT: number) => {
    try {
      const response = await fetch("/api/loaict", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maLCT: maLCT }),
      });

      if (!response.ok) {
        throw new Error("Lỗi cập nhật");
      }

      loaiCT.splice(selectedIndex, 1);

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Cập nhật mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };
</script>

<Table
  title="Roles"
  {columns}
  data={loaiCT}
  redirectParam={""}
  tableType=""
  {onEditClick}
  {onDeleteClick}
/>

<div class="flex justify-center pt-4">
  <ButtonPrimary text="Tạo sân nhà mới" onclick={() => (formState = true)} />
</div>

<Form
  fields={roleFields}
  bind:formState
  {submitForm}
  {onOpenForm}
  {onCloseForm}
/>
