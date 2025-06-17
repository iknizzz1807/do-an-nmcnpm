<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import type { FormField, FormInputMap } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import Table from "$lib/components/Table.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { VongTD } from "$lib/typesDatabase";
  import { SvelteMap } from "svelte/reactivity";

  let { dataVongTD }: { dataVongTD: VongTD[] } = $props();

  let vongTD: VongTD[] = $state(dataVongTD);
  let editData: FormInputMap = $state(new SvelteMap());
  let formState = $state(false);
  let selectedIndex = $state(-1);

  const columns = [
    { header: "ID", accessor: "maVTD", hidden: true },
    { header: "Tên vòng thi đấu", accessor: "tenVTD" },
  ];
  const roleFields: FormField[] = [
    {
      label: "Tên vòng thi đấu",
      propertyName: "tenVTD",
      type: "input",
      valueType: "string",
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

  const onEditClick = async (data: VongTD, index: number) => {
    if (data satisfies VongTD) {
      editData.clear();
      editData.set("maVTD", data.maVTD!!);
      editData.set("tenVTD", data.tenVTD);
      formState = true;
      selectedIndex = index;
    } else {
      console.error("Data không thỏa mãn");
      selectedIndex = -1;
    }
  };

  const submitForm = async (e: Event, data: VongTD) => {
    e.preventDefault();

    if (data.tenVTD.trim() === "") {
      showErrorToast("roleName/viewablePage không thể trống");
      return;
    }

    try {
      const response = await fetch("/api/caidat/vongtd", {
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
      if (selectedIndex === -1) vongTD.push(responseData);
      else vongTD[selectedIndex] = responseData;

      showOkToast("Cập nhật thành công");
      formState = false;
    } catch (err) {
      if (err instanceof Error) showErrorToast(err.message);
    }
  };

  const onDeleteClick = async (data: any, index: number) => {
    if (data satisfies VongTD) {
      selectedIndex = index;
      await deleteVongTD(data.maVTD);
    } else {
      console.error("Data không thỏa mãn");
    }
  };

  const deleteVongTD = async (maVTD: number) => {
    try {
      const response = await fetch("/api/caidat/vongtd", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maVTD: maVTD }),
      });

      if (!response.ok) {
        throw new Error("Lỗi cập nhật");
      }

      vongTD.splice(selectedIndex, 1);

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
  title="Các vòng thi đấu"
  {columns}
  data={vongTD}
  redirectParam={""}
  tableType=""
  {onEditClick}
  {onDeleteClick}
/>

<div class="flex justify-center pt-4">
  <ButtonPrimary
    text="Tạo vòng thi đấu mới"
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
