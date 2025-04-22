<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { DoiBong, SanNha } from "$lib/typesDatabase";
  import Form, { type FieldOption, type FormField, type FormInputMap } from "$lib/components/Form.svelte";
  import { SvelteMap } from "svelte/reactivity";
  let { data }: PageProps = $props();

  let danhSachDoiBong: DoiBong[] = $state(data.danhSachDoiBong);
  let danhSachSanNha: SanNha[] = $state(data.danhSachSanNha);

  for (const doiBong of danhSachDoiBong) {
    doiBong.tenSan = danhSachSanNha.find((val) => val.maSan === doiBong.maSan)?.tenSan ?? "";
  }

  const sanNhaOption : FieldOption[] = danhSachSanNha.map((val) => ({ optionValue: val.maSan ?? 0, optionName: val.tenSan }));

  const columns = [
    { header: "", accessor: "maDoi", hidden: true},
    { header: "Tên đội", accessor: "tenDoi" },
    { header: "Sân nhà", accessor: "tenSan" },
  ];

  const formFields : FormField[] = [
    { label: "Tên đội", propertyName: "tenDoi", type: "input", valueType: "string" },
    { label: "Sân nhà", propertyName: "maSan", type: "select", valueType: "number", options: sanNhaOption }
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
      editData.set("maSan", data.maSan);
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
    if (data.tenDoi.trim() === "") return;

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
      result.tenSan = danhSachSanNha.find((val) => val.maSan === result.maSan)?.tenSan ?? "";

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