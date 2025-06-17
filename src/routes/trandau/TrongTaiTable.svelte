<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import type { FormField, FormInputMap } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import Table from "$lib/components/Table.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { TrongTai } from "$lib/typesDatabase";
  import { SvelteMap } from "svelte/reactivity";

  let { dataTrongTai = $bindable() }: { dataTrongTai: TrongTai[] } = $props();

  let trongTais: TrongTai[] = $state(dataTrongTai);
  let editData: FormInputMap = $state(new SvelteMap());
  let formState = $state(false);
  let selectedIndex = $state(-1);

  const columns = [
    { header: "ID", accessor: "maTT", hidden: true },
    { header: "Tên trọng tài", accessor: "tenTT" },
    {
      header: "Ngày sinh",
      accessor: "ngaySinh",
      accessFunction: (data: TrongTai) => {
        return new Date(data.ngaySinh).toLocaleDateString("vi-VN");
      },
    },
  ];
  const roleFields: FormField[] = [
    {
      label: "Tên trọng tài",
      propertyName: "tenTT",
      type: "input",
      valueType: "string",
    },
    {
      label: "Ngày sinh",
      propertyName: "ngaySinh",
      type: "Date",
      valueType: "Date",
    },
  ];

  const onOpenForm = (): FormInputMap | null => {
    if (editData.size > -1) return editData;
    return new SvelteMap();
  };

  const onCloseForm = () => {
    editData.clear();
    selectedIndex = -1;
    formState = false;
  };

  const onEditClick = async (data: TrongTai, index: number) => {
    if (data satisfies TrongTai) {
      editData.clear();
      editData.set("maTT", data.maTT!!);
      editData.set("tenTT", data.tenTT);
      editData.set("ngaySinh", data.ngaySinh);
      formState = true;
      selectedIndex = index;
    } else {
      console.error("Data không thỏa mãn");
      selectedIndex = -1;
    }
  };

  const submitForm = async (e: Event, data: TrongTai) => {
    e.preventDefault();

    if (data.tenTT.trim() === "") {
      showErrorToast("roleName/viewablePage không thể trống");
      return;
    }

    try {
      const response = await fetch("/api/trongtai", {
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
      if (selectedIndex === -1) trongTais.push(responseData);
      else trongTais[selectedIndex] = responseData;

      showOkToast("Cập nhật thành công");
      formState = false;
    } catch (err) {
      if (err instanceof Error) showErrorToast(err.message);
    }
  };

  const onDeleteClick = async (data: any, index: number) => {
    if (data satisfies TrongTai) {
      selectedIndex = index;
      await deleteTrongTai(data.maTT);
      selectedIndex = -1;
    } else {
      console.error("Data không thỏa mãn");
    }
  };

  const deleteTrongTai = async (maTT: number) => {
    try {
      const response = await fetch("/api/trongtai", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maTT: maTT }),
      });

      if (!response.ok) {
        throw new Error("Lỗi cập nhật");
      }

      trongTais.splice(selectedIndex, 1);

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
  title="Các trọng tài"
  {columns}
  data={trongTais}
  redirectParam={""}
  tableType=""
  {onEditClick}
  {onDeleteClick}
/>

<div class="flex justify-center pt-4">
  <ButtonPrimary
    text="Tạo trọng tài mới"
    onclick={() => (formState = true)}
  />
</div>

<Form
  fields={roleFields}
  bind:formState
  {submitForm}
  {onOpenForm}
  {onCloseForm}
/>
