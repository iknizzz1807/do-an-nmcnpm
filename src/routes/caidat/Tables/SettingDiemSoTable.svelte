<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import type { FormField, FormInputMap } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import Table from "$lib/components/Table.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { DiemSo } from "$lib/typesDatabase";
  import { SvelteMap } from "svelte/reactivity";
  import { validate } from "uuid";

  const { dataDiemSo }: { dataDiemSo: DiemSo[] } = $props();

  let diemSo : DiemSo[] = $state(dataDiemSo);
  let editData: FormInputMap = $state(new SvelteMap());
  let formState = $state(false);
  let selectedIndex = $state(-1);

  const columns = [
    { header: "ID", accessor: "maDS", hidden: true },
    { header: "Tên điểm số", accessor: "tenDS" },
    { header: "Điểm điểm số", accessor: "diemSo" },
  ];
  const roleFields: FormField[] = [
    {
      label: "Tên điểm số",
      propertyName: "tenDS",
      type: "input",
      valueType: "string",
    },
    {
      label: "Điểm điểm số",
      propertyName: "diemSo",
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

  const onEditClick = async (data: DiemSo, index: number) => {
    if (data satisfies DiemSo) {
      editData.clear();
      editData.set("maDS", data.maDS!!);
      editData.set("tenDS", data.tenDS);
      editData.set("diemSo", data.diemSo ?? 0);
      formState = true;
      selectedIndex = index;
    } else {
      console.error("Data không thỏa mãn LichThiDau");
      selectedIndex = -1;
    }
  };

  const submitForm = async (e: Event, data: DiemSo) => {
    e.preventDefault();

    if (data.tenDS.trim() === "") {
      showErrorToast("roleName/viewablePage không thể trống");
      return;
    }

    try {
      const response = await fetch("api/diemso", {
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
      console.log(selectedIndex);
      if (selectedIndex === -1)
        diemSo.push(responseData);
      else
        diemSo[selectedIndex] = responseData;

      showOkToast("Cập nhật thành công");
      formState = false;
    } catch (err) {
      if (err instanceof Error) showErrorToast(err.message);
    }
  };

  const onDeleteClick = async (data: any, index: number) => {
    if (data satisfies DiemSo) {
      selectedIndex = index;
      await deleteDiemSo(data.maDS);
    } else {
      console.error("Data không thỏa mãn loại CauThu");
    }
  };

  const deleteDiemSo = async (maDS: number) => {
    try {
      const response = await fetch("/api/diemso", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maDS: maDS }),
      });

      if (!response.ok) {
        throw new Error("Lỗi xóa Điểm số");
      }

      diemSo.splice(selectedIndex, 1);

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Cập nhật điểm số mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };
</script>

<div class="space-y-6">
  <Table
    title="Quản lý Điểm số"
    {columns}
    data={diemSo}
    redirectParam={""}
    tableType=""
    {onEditClick}
    {onDeleteClick}
  />

  <div class="flex justify-center mt-6">
    <ButtonPrimary
      text="Tạo loại điểm số mới"
      onclick={() => {
        selectedIndex = -1;
        editData.clear();
        formState = true;
      }}
    />
  </div>
</div>

<Form
  fields={roleFields}
  bind:formState
  {submitForm}
  {onOpenForm}
  {onCloseForm}
/>
