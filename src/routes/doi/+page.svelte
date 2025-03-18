<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { DoiBong } from "$lib/types";
  import Form, { type FormField, type FormInputMap } from "$lib/components/Form.svelte";
  import { SvelteMap } from "svelte/reactivity";
  let { data }: PageProps = $props();

  let danhSachDoiBong: DoiBong[] = $state(data.danhSachDoiBong);

  const columns = [
    { header: "", accessor: "maDoi", hidden: true},
    { header: "Tên đội", accessor: "tenDoi" },
    { header: "Sân nhà", accessor: "sanNha" },
  ];

  const formFields : FormField[] = [
    { label: "Tên đội", propertyName: "tenDoi", type: "input", valueType: "string" },
    { label: "Sân nhà", propertyName: "sanNha", type: "input", valueType: "string" }
  ]
  let selectedIndex : number = $state(0);
  let maDoi : number = $state(0);

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

  const onEditClick =  (data: DoiBong, index: number) => {
    if (data satisfies DoiBong) {
      editData.clear();
      editData.set("maDoi", data.maDoi ?? null);
      editData.set("tenDoi", data.tenDoi);
      editData.set("sanNha", data.sanNha);
      selectedIndex = index;
      formState = true;
    }
    else {
      console.error("Data không thỏa mãn LichThiDau");
      selectedIndex = -1;
    }
  }

  const onDeleteClick = async (data : any, index: number) => {
    if (data satisfies DoiBong) {
      selectedIndex = index;
      maDoi = data.maDoi;
      await deleteDoiBong();
    }
    else {
      console.error("Data không thỏa mãn loại CauThu");
    }
  }

  const addDoiBong = async (e: Event, data : DoiBong) => {
    e.preventDefault();
    if (data.tenDoi.trim() === "" || data.sanNha.trim() === "") return;

    if (
      danhSachDoiBong.some(
        (doiBong) =>
          doiBong.tenDoi.trim().toLowerCase() ===
          data.tenDoi.trim().toLowerCase()
      )
    ) {
      showErrorToast("Tên đội bóng đã tồn tại");
      return;
    }

    try {
      const response = await fetch("/api/doibong", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Lỗi tạo đội bóng");
      }

      const result = await response.json();

      // Cập nhật danh sách đội bóng nếu cần thiết
      if (selectedIndex === -1) 
        danhSachDoiBong.push(result);
      else
        danhSachDoiBong[selectedIndex] = result;

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Tạo đội bóng mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };

  const updateDoiBong = async (e: Event, data : DoiBong) => {
    e.preventDefault();
    if (data.tenDoi.trim() === "" || data.sanNha.trim() === "") return;

    if (
      danhSachDoiBong.some(
        (doiBong) =>
          doiBong.tenDoi.trim().toLowerCase() ===
          data.tenDoi.trim().toLowerCase()
      )
    ) {
      showErrorToast("Tên đội bóng đã tồn tại");
      return;
    }

    try {
      const response = await fetch("/api/doibong", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Lỗi tạo đội bóng");
      }

      const result = await response.json();

      // Cập nhật danh sách đội bóng nếu cần thiết
      danhSachDoiBong.push(result);

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Tạo đội bóng mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };

  const deleteDoiBong = async () => {
    try {
      const response = await fetch("/api/doibong", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maDoi: maDoi }),
      });

      if (!response.ok) {
        showErrorToast("Lỗi cập nhật đội bóng");
        throw new Error("Lỗi cập nhật đội bóng");
      }

      danhSachDoiBong.splice(selectedIndex, 1);

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
  <title>Các đội bóng</title>
</svelte:head>

<Table
  title="Danh sách các đội bóng"
  {columns}
  data={danhSachDoiBong}
  redirectParam={"maDoi"}
  tableType="doi"
  onEditClick={onEditClick}
  onDeleteClick={onDeleteClick}
/>
<div class="flex justify-center">
  <ButtonPrimary text="Tạo đội mới" onclick={() => formState = true} />
</div>

<Form 
  bind:formState={formState}
  fields={formFields}
  submitForm={addDoiBong}
  onCloseForm={onCloseForm}
  onOpenForm={onOpenForm}
/>