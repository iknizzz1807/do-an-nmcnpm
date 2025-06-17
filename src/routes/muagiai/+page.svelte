<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { MuaGiai } from "$lib/typesDatabase";
  import Form, {
    type FormField,
    type FormInputMap,
  } from "$lib/components/Form.svelte";
  import { SvelteMap } from "svelte/reactivity";
  import { onMount } from "svelte";
  import dateFormat from "dateformat";
  import {
    afterNavigate,
    beforeNavigate,
    invalidate,
    invalidateAll,
  } from "$app/navigation";
  let { data }: PageProps = $props();

  let danhSachMuaGiai: MuaGiai[] = $state(data.danhSachMuaGiai);

  let isEditable = $state(data.isEditable);

  let daChonMuaGiai: boolean = $state(data.daChonMuaGiai);

  afterNavigate(() => {
    if (!daChonMuaGiai) {
      showErrorToast("Hãy chọn một mùa giải");
    }
  });

  const columns = [
    { header: "", accessor: "maMG", hidden: true },
    { header: "Tên mùa giải", accessor: "tenMG" },
    {
      header: "Ngày diễn ra",
      accessor: "ngayDienRa",
      accessFunction: (data: MuaGiai) =>
        new Date(data.ngayDienRa!!).toLocaleDateString("vi-VN"),
    },
    {
      header: "Ngày kết thúc",
      accessor: "ngayKetThuc",
      accessFunction: (data: MuaGiai) =>
        new Date(data.ngayKetThuc!!).toLocaleDateString("vi-VN"),
    },
  ];

  const formFields: FormField[] = [
    {
      label: "Tên mùa giải",
      propertyName: "tenMG",
      type: "input",
      valueType: "string",
    },
    {
      label: "Ngày diễn ra",
      propertyName: "ngayDienRa",
      type: "Date",
      valueType: "Date",
    },
    {
      label: "Ngày kết thúc",
      propertyName: "ngayKetThuc",
      type: "Date",
      valueType: "Date",
    },
    {
      label: "Logo mùa giải",
      propertyName: "imageURL",
      type: "input",
      valueType: "string",
    },
  ];

  let selectedIndex: number = $state(0);

  let formState: boolean = $state(false);
  let editData: FormInputMap = $state(new SvelteMap());

  const onOpenForm = (): FormInputMap | null => {
    if (editData.size > 0) return editData;
    return new SvelteMap();
  };

  const onCloseForm = () => {
    editData.clear();
    selectedIndex = -1;
    formState = false;
  };

  const onEditClick = (data: MuaGiai, index: number) => {
    if (data satisfies MuaGiai) {
      editData.clear();
      editData.set("maMG", data.maMG ?? null);
      editData.set("tenMG", data.tenMG);
      editData.set("ngayDienRa", new Date(data.ngayDienRa));
      editData.set("ngayKetThuc", new Date(data.ngayKetThuc));
      editData.set("imageURL", data.imageURL ?? "");
      selectedIndex = index;
      formState = true;
      console.log(editData);
    } else {
      console.error("Data không thỏa mãn MuaGiai");
      selectedIndex = -1;
    }
  };

  const onDeleteClick = async (data: any, index: number) => {
    if (data satisfies MuaGiai) {
      selectedIndex = index;
      await deleteMuaGiai(data);
      selectedIndex = -1;
    } else {
      console.error("Data không thỏa mãn loại MuaGiai");
    }
  };

  const onItemClick = async (data: MuaGiai, index: number) => {
    try {
      const response = await fetch("/api/selectmuagiai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Không thể chọn mùa giải");

      window.location.href = "/";
    } catch (e) {
      showErrorToast(String(e));
    }
  };

  const submitMuaGiai = async (e: Event, data: MuaGiai) => {
    e.preventDefault();
    if (data.tenMG.trim() === "") return;
    if (data.ngayDienRa === null || data.ngayKetThuc === null) {
      showErrorToast("Ngày diễn ra và ngày kết thúc không được để trống");
      return;
    }
    if (data.ngayDienRa >= data.ngayKetThuc) {
      showErrorToast("Ngày kết thúc phải sau ngày diễn ra");
      return;
    }

    try {
      const response = await fetch("/api/muagiai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Lỗi tạo Mùa giải");
      }

      let result = await response.json();
      console.log("Mùa giải đã được tạo:", result);

      // Cập nhật danh sách Mùa giải nếu cần thiết
      if (selectedIndex === -1) danhSachMuaGiai.push(result);
      else {
        result.imageURL = danhSachMuaGiai[selectedIndex].imageURL;
        danhSachMuaGiai[selectedIndex] = result;
      }

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Tạo Mùa giải mới thành công");
      invalidateAll();
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };

  const deleteMuaGiai = async (data: MuaGiai) => {
    if ((data.maMG ?? null) === null) {
      showErrorToast("Không thể xóa tại -1");
      return;
    }

    try {
      const response = await fetch("/api/muagiai", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maMG: data.maMG }),
      });

      if (!response.ok) {
        throw new Error("Lỗi cập nhật");
      }

      danhSachMuaGiai.splice(selectedIndex, 1);

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Xóa thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };
</script>

<svelte:head>
  <title>Các Mùa giải</title>
</svelte:head>

{#if isEditable}
  <div class="flex justify-center gap-4">
    <ButtonPrimary text="Tạo mùa giải mới" onclick={() => (formState = true)} />
    {#if isEditable}
      <div class="flex justify-center">
        <a
          class="bg-green-600 mb-4 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md cursor-pointer text-base font-semibold transition-all duration-200 transform hover:-translate-y-0.5"
          href="/muagiai/lichsu"
        >
          Lịch sử cập nhật
        </a>
      </div>
    {/if}
  </div>
{/if}

<Table
  title="Danh sách các Mùa giải"
  {columns}
  data={danhSachMuaGiai}
  redirectParam={""}
  tableType=""
  {onItemClick}
  {onEditClick}
  {onDeleteClick}
  {isEditable}
  showTeamLogo={true}
/>

<Form
  bind:formState
  fields={formFields}
  submitForm={submitMuaGiai}
  {onCloseForm}
  {onOpenForm}
/>
