<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import type { FormField, FormInputMap } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import Table from "$lib/components/Table.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { TieuChiXepHang } from "$lib/typesDatabase";
  import { SvelteMap } from "svelte/reactivity";

  const { dataTieuChiXepHang }: { dataTieuChiXepHang: TieuChiXepHang[] } = $props();

  let tieuChi: TieuChiXepHang[] = $state(dataTieuChiXepHang);
  let editData: FormInputMap = $state(new SvelteMap());
  let formState = $state(false);
  let selectedIndex = $state(-1);

  const columns = [
    { header: "ID", accessor: "maTC", hidden: true },
    { header: "Tên Tiêu chí", accessor: "tenTC" },
    { header: "Ưu tiên", accessor: "uuTien" },
  ];
  const diemsoFields: FormField[] = [
    {
      label: "Tên tiêu chí",
      propertyName: "tenTC",
      type: "input",
      valueType: "string",
    },
    {
      label: "Ưu tiên",
      propertyName: "uuTien",
      type: "input",
      valueType: "number",
    },
  ];

  const onOpenForm = (): FormInputMap | null => {
    if (editData.size > 0) return editData;

    // For new entries, clear data
    editData.clear();
    selectedIndex = -1;
    editData.set("tenTC", "");
    editData.set("uuTien", 0);

    return editData;
  };

  const onCloseForm = () => {
    editData.clear();
    selectedIndex = -1;
    formState = false;
  };

  const onEditClick = (data: TieuChiXepHang, index: number) => {
    editData.clear();
    editData.set("maTC", data.maTC!!);
    editData.set("tenTC", data.tenTC);
    editData.set("uuTien", data.uuTien ?? 0);
    formState = true;
    selectedIndex = index;
  };

  const submitForm = async (e: Event, data: TieuChiXepHang) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/caidat/tieuchi", {
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
        tieuChi.push(responseData);
      } else {
        tieuChi[selectedIndex] = responseData;
      }

      showOkToast("Cập nhật thành công");
      formState = false;
    } catch (err) {
      if (err instanceof Error) showErrorToast(err.message);
    }
  };

  const onDeleteClick = async (data: any, index: number) => {
    if (confirm(`Bạn có chắc muốn xóa "${data.tenTC}" không?`)) {
      selectedIndex = index;
      await deleteTieuChiXepHang(data.maTC);
      selectedIndex = -1;
    }
  };

  const deleteTieuChiXepHang = async (maTC: number) => {
    try {
      const response = await fetch("/api/caidat/tieuchi", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maTC: maTC }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi xóa Điểm số");
      }

      tieuChi.splice(selectedIndex, 1);
      showOkToast("Xóa thành công");
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
    data={tieuChi}
    redirectParam={""}
    tableType=""
    {onEditClick}
    {onDeleteClick}
    showExportCSV={false}
  />
  <div class="flex justify-center mt-6">
    <ButtonPrimary
      text="Tạo tiêu chí xếp hạng mới"
      onclick={() => {
        selectedIndex = -1;
        editData.clear();
        formState = true;
      }}
    />
  </div>
</div>

<Form
  fields={diemsoFields}
  bind:formState
  {submitForm}
  {onOpenForm}
  {onCloseForm}
/>
