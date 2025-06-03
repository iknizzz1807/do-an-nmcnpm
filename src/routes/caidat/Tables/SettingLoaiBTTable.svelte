<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import type { FormField, FormInputMap } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import Table from "$lib/components/Table.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { LoaiBT } from "$lib/typesDatabase";
  import { SvelteMap } from "svelte/reactivity";

  const { dataLoaiBT }: { dataLoaiBT: LoaiBT[] } = $props();

  let loaiBT : LoaiBT[] = $state(dataLoaiBT);
  let editData: FormInputMap = $state(new SvelteMap());
  let formState = $state(false);
  let selectedIndex = $state(-1);

  const columns = [
    { header: "ID", accessor: "maLBT", hidden: true },
    { header: "Tên bàn thắng", accessor: "tenLBT" },
    { header: "Điểm bàn thắng", accessor: "diemBT" },
  ];
  const roleFields: FormField[] = [
    {
      label: "Tên bàn thắng",
      propertyName: "tenLBT",
      type: "input",
      valueType: "string",
    },
    {
      label: "Điểm bàn thắng",
      propertyName: "diemBT",
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

  const onEditClick = async (data: LoaiBT, index: number) => {
    if (data satisfies LoaiBT) {
      editData.clear();
      editData.set("maLBT", data.maLBT!!);
      editData.set("tenLBT", data.tenLBT);
      editData.set("diemBT", data.diemBT ?? 0);
      formState = true;
      selectedIndex = index;
    } else {
      console.error("Data không thỏa mãn");
      selectedIndex = -1;
    }
  };

  const submitForm = async (e: Event, data: LoaiBT) => {
    e.preventDefault();

    if (data.tenLBT.trim() === "") {
      showErrorToast("roleName/viewablePage không thể trống");
      return;
    }

    try {
      const response = await fetch("api/loaibt", {
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
      if (selectedIndex === -1)
        loaiBT.push(responseData);
      else
        loaiBT[selectedIndex] = responseData;

      showOkToast("Cập nhật thành công");
      formState = false;
    } catch (err) {
      if (err instanceof Error) showErrorToast(err.message);
    }
  };

  const onDeleteClick = async (data: any, index: number) => {
    if (data satisfies LoaiBT) {
      selectedIndex = index;
      await deleteLoaiBT(data.maLBT);
    } else {
      console.error("Data không thỏa mãn");
    }
  };

  const deleteLoaiBT = async (maLBT: number) => {
    try {
      const response = await fetch("/api/loaibt", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maLBT: maLBT }),
      });

      if (!response.ok) {
        throw new Error("Lỗi cập nhật");
      }

      loaiBT.splice(selectedIndex, 1);

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Cập nhật thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };
</script>

<div class="space-y-6">
  <Table
    title="Quản lý Loại Bàn Thắng"
    {columns}
    data={loaiBT}
    redirectParam={""}
    tableType=""
    {onEditClick}
    {onDeleteClick}
  />

  <div class="flex justify-center mt-6">
    <ButtonPrimary
      text="Tạo loại bàn thắng mới"
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
