<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { MuaGiai } from "$lib/typesDatabase";
  import Form, { type FormField, type FormInputMap } from "$lib/components/Form.svelte";
  import { SvelteMap } from "svelte/reactivity";
  let { data }: PageProps = $props();

  let danhSachMuaGiai: MuaGiai[] = $state(data.danhSachMuaGiai);

  const columns = [
    { header: "", accessor: "maMG", hidden: true},
    { header: "Tên mùa giải", accessor: "tenMG" },
    { header: "Ngày diễn ra", accessor: "ngayDienRa",
      accessFunction: (data: MuaGiai) => new Date(data.ngayDienRa!!).toLocaleDateString() }
  ];

  const formFields : FormField[] = [
    { label: "Tên mùa giải", propertyName: "tenMG", type: "input", valueType: "string" },
    { label: "Ngày diễn ra", propertyName: "ngayDienRa", type: "Date", valueType: "Date" },
  ]
  let selectedIndex : number = $state(0);

  let formState: boolean = $state(false);
  let editData : FormInputMap = $state(new SvelteMap());

  const onOpenForm = () : FormInputMap | null => {
    if (editData.size > 0)
      return editData;
    return new SvelteMap();
  }

  const onCloseForm = () => {
    editData.clear();
  }

  const onEditClick =  (data: MuaGiai, index: number) => {
    if (data satisfies MuaGiai) {
      editData.clear();
      editData.set("maMG", data.maMG ?? null);
      editData.set("tenMG", data.tenMG);
      editData.set("ngayDienRa", data.ngayDienRa);
      selectedIndex = index;
      formState = true;
    }
    else {
      console.error("Data không thỏa mãn LichThiDau");
      selectedIndex = -1;
    }
  }

  const onDeleteClick = async (data : any, index: number) => {
    if (data satisfies MuaGiai) {
      selectedIndex = index;
      await deleteMuaGiai(data);
    }
    else {
      console.error("Data không thỏa mãn loại CauThu");
    }
  }

  const onItemClick = async (data: MuaGiai, index: number) => {
    try {
      
      const response = await fetch('api/selectmuagiai', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok)
        throw new Error("Không thể chọn mùa giải");
      
      window.location.href = '/';
    } catch(e) {
      showErrorToast(String(e));
    }
  }

  const submitMuaGiai = async (e: Event, data : MuaGiai) => {
    e.preventDefault();
    if (data.tenMG.trim() === "" ) return;

    if (
      danhSachMuaGiai.some(
        (MuaGiai) =>
          MuaGiai.tenMG.trim().toLowerCase() ===
          data.tenMG.trim().toLowerCase()
      )
    ) {
      showErrorToast("Tên Mùa giải đã tồn tại");
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

      const result = await response.json();

      // Cập nhật danh sách Mùa giải nếu cần thiết
      if (selectedIndex === -1) 
        danhSachMuaGiai.push(result);
      else
        danhSachMuaGiai[selectedIndex] = result;

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Tạo Mùa giải mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };

  const deleteMuaGiai = async (data : MuaGiai) => {
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
        showErrorToast("Lỗi cập nhật Mùa giải");
        throw new Error("Lỗi cập nhật Mùa giải");
      }

      danhSachMuaGiai.splice(selectedIndex, 1);

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Cập nhật cầu thủ mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    };
  };
</script>

<svelte:head>
  <title>Các Mùa giải</title>
</svelte:head>

<Table
  title="Danh sách các Mùa giải"
  {columns}
  data={danhSachMuaGiai}
  redirectParam={""}
  tableType=""
  onItemClick={onItemClick}
  onEditClick={onEditClick}
  onDeleteClick={onDeleteClick}
/>
<div class="flex justify-center">
  <ButtonPrimary text="Tạo đội mới" onclick={() => formState = true} />
</div>

<Form 
  bind:formState={formState}
  fields={formFields}
  submitForm={submitMuaGiai}
  onCloseForm={onCloseForm}
  onOpenForm={onOpenForm}
/>