<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import type { FormField, FormInputMap } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import Table from "$lib/components/Table.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { SanNha } from "$lib/typesDatabase";
  import { SvelteMap } from "svelte/reactivity";

  let { dataSanNha } : { dataSanNha: SanNha[] } = $props();

  let sanNha : SanNha[] = $state(dataSanNha);
  let editData: FormInputMap = $state(new SvelteMap());
  let formState = $state(false);
  let selectedIndex = $state(-1);
  
  const columns = [
    { header: "ID", accessor: "maSan", hidden: true },
    { header: "Tên sân", accessor: "tenSan" },
    { header: "Địa chi", accessor: "diaChi" },
  ];
  const roleFields: FormField[] = [
    {
      label: "Tên sân",
      propertyName: "tenSan",
      type: "input",
      valueType: "string",
    },
    {
      label: "Địa chi",
      propertyName: "diaChi",
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

  const onEditClick = async (data: SanNha, index: number) => {
    if (data satisfies SanNha) {
      editData.clear();
      editData.set("maSan", data.maSan!!);
      editData.set("tenSan", data.tenSan);
      editData.set("diaChi", data.diaChi);
      formState = true;
      selectedIndex = index;
    } else {
      console.error("Data không thỏa mãn");
      selectedIndex = -1;
    }
  };

  const submitForm = async (e: Event, data: SanNha) => {
    e.preventDefault();

    if (data.tenSan.trim() === "" || data.diaChi.trim() === "") {
      showErrorToast("roleName/viewablePage không thể trống");
      return;
    }

    try {
      const response = await fetch("api/sannha", {
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
        sanNha.push(responseData);
      else
        sanNha[selectedIndex] = responseData;

      showOkToast("Cập nhật thành công");
      formState = false;
    } catch (err) {
      if (err instanceof Error) showErrorToast(err.message);
    }
  };

  const onDeleteClick = async (data : any, index: number) => {
    if (data satisfies SanNha) {
      selectedIndex = index;
      await deleteSanNha(data.maSan);
    }
    else {
      console.error("Data không thỏa mãn loại CauThu");
    }
  }
  
  const deleteSanNha = async (maSan : number) => {
    try {
      const response = await fetch("/api/sannha", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maSan: maSan }),
      });

      if (!response.ok) {
        showErrorToast("Lỗi cập nhật sân nhà");
        throw new Error("Lỗi cập nhật sân nhà");
      }

      sanNha.splice(selectedIndex, 1);

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Cập nhật sân nhà mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    };
  };

</script>


<Table
title="Roles"
columns={columns}
data={sanNha}
redirectParam={""}
tableType=""
{onEditClick}
{onDeleteClick}
/>

<div class="flex justify-center">
  <ButtonPrimary text="Tạo sân nhà mới" onclick={() => (formState = true)} />
</div>

<Form
  fields={roleFields}
  bind:formState
  {submitForm}
  {onOpenForm}
  {onCloseForm}
/>