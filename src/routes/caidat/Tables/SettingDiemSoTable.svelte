<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import type { FormField, FormInputMap } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import Table from "$lib/components/Table.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { DiemSo } from "$lib/typesDatabase";
  import { SvelteMap } from "svelte/reactivity";

  const { dataDiemSo }: { dataDiemSo: DiemSo[] } = $props();

  let diemSo: DiemSo[] = $state(dataDiemSo);
  let editData: FormInputMap = $state(new SvelteMap());
  let formState = $state(false);
  let selectedIndex = $state(-1);

  const columns = [
    { header: "ID", accessor: "maDS", hidden: true },
    { header: "Tên điểm số", accessor: "tenDS" },
    { header: "Điểm", accessor: "diemSo" },
  ];
  const diemsoFields: FormField[] = [
    {
      label: "Số điểm tương ứng",
      propertyName: "diemSo",
      type: "input",
      valueType: "number",
    },
  ];

  const onOpenForm = (): FormInputMap | null => {
    if (editData.size > 0) return editData;

    // For new entries, clear data
    editData.clear();
    selectedIndex = -1;
    editData.set("tenDS", "");
    editData.set("diemSo", 0);

    return editData;
  };

  const onCloseForm = () => {
    editData.clear();
    selectedIndex = -1;
    formState = false;
  };

  const onEditClick = (data: DiemSo, index: number) => {
    editData.clear();
    editData.set("maDS", data.maDS!!);
    editData.set("tenDS", data.tenDS);
    editData.set("diemSo", data.diemSo ?? 0);
    formState = true;
    selectedIndex = index;
  };

  const submitForm = async (e: Event, data: DiemSo) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/caidat/diemso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Không thể cập nhật");
      }

      const responseData = await response.json();

      if (selectedIndex === -1) {
        diemSo.push(responseData);
      } else {
        diemSo[selectedIndex] = responseData;
      }

      showOkToast("Cập nhật thành công");
      formState = false;
    } catch (err) {
      if (err instanceof Error) showErrorToast(err.message);
    }
  };

  const onDeleteClick = async (data: any, index: number) => {
    if (confirm(`Bạn có chắc muốn xóa "${data.tenDS}" không?`)) {
      selectedIndex = index;
      await deleteDiemSo(data.maDS);
      selectedIndex = -1;
    }
  };

  const deleteDiemSo = async (maDS: number) => {
    try {
      const response = await fetch("/api/caidat/diemso", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maDS: maDS }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi xóa Điểm số");
      }

      diemSo.splice(selectedIndex, 1);
      showOkToast("Xóa thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };
</script>

<!-- RESTRUCTURED: Removed outer container and title. This component now focuses only on the table and its associated form logic. -->
<div class="space-y-6">
  <Table
    title="Quản lý Điểm số"
    {columns}
    data={diemSo}
    redirectParam={""}
    tableType=""
    {onEditClick}
    {onDeleteClick}
    showExportCSV={false}
  />
</div>

<Form
  fields={diemsoFields}
  bind:formState
  {submitForm}
  {onOpenForm}
  {onCloseForm}
/>
