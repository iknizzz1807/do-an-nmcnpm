<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import type { FormField, FormInputMap } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import Table from "$lib/components/Table.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { ViTri } from "$lib/typesDatabase";
  import { SvelteMap } from "svelte/reactivity";

  const { dataViTri }: { dataViTri: ViTri[] } = $props();

  let viTri: ViTri[] = $state(dataViTri);
  let editData: FormInputMap = $state(new SvelteMap());
  let formState = $state(false);
  let selectedIndex = $state(-1);

  const columns = [
    { header: "ID", accessor: "maVT", hidden: true },
    { header: "Tên vị trí", accessor: "tenVT" },
  ];
  const roleFields: FormField[] = [
    {
      label: "Tên vị trí",
      propertyName: "tenVT",
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

  const onEditClick = async (data: ViTri, index: number) => {
    if (data satisfies ViTri) {
      editData.clear();
      editData.set("maVT", data.maVT!!);
      editData.set("tenVT", data.tenVT);
      formState = true;
      selectedIndex = index;
    } else {
      console.error("Data không thỏa mãn");
      selectedIndex = -1;
    }
  };

  const submitForm = async (e: Event, data: ViTri) => {
    e.preventDefault();

    if (data.tenVT.trim() === "") {
      showErrorToast("roleName/viewablePage không thể trống");
      return;
    }

    try {
      const response = await fetch("/api/caidat/vitri", {
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
      if (selectedIndex === -1) viTri.push(responseData);
      else viTri[selectedIndex] = responseData;

      showOkToast("Cập nhật thành công");
      formState = false;
    } catch (err) {
      if (err instanceof Error) showErrorToast(err.message);
    }
  };

  const onDeleteClick = async (data: any, index: number) => {
    if (data satisfies ViTri) {
      selectedIndex = index;
      await deleteViTri(data.maVT);
    } else {
      console.error("Data không thỏa mãn");
    }
  };

  const deleteViTri = async (maVT: number) => {
    try {
      const response = await fetch("/api/caidat/vitri", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maVT: maVT }),
      });

      if (!response.ok) {
        throw new Error("Lỗi cập nhật");
      }

      viTri.splice(selectedIndex, 1);

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
  data={viTri}
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
