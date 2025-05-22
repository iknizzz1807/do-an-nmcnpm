<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import type { DoiBong, MuaGiai, LichThiDau } from "$lib/typesDatabase";
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import {
    type FieldOption,
    type FormField,
    type FormInputMap,
  } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import { SvelteMap } from "svelte/reactivity";
  import { page } from "$app/state";

  let { data }: PageProps = $props();

  let danhSachLTD: LichThiDau[] = $state(data.danhSachLTD);
  const danhSachDoi: DoiBong[] = $state(data.danhSachDoi);
  const danhSachMuaGiai: MuaGiai[] = $state(data.danhSachMuaGiai);
  const isEditable = $state(data.isEditable);

  for (const ltd of danhSachLTD) {
    let tenDoiThang =
      danhSachDoi.find((value) => value.maDoi == ltd.doiThang)?.tenDoi ?? null;
    if (tenDoiThang === null) tenDoiThang = "Hòa";
    ltd.tenDoiThang = tenDoiThang;
  }

  const doiOption: FieldOption[] = danhSachDoi
    .filter((val) => val.maDoi ?? null)
    .map((value) => {
      return {
        optionValue: value.maDoi!!,
        optionName: value.tenDoi,
      } satisfies FieldOption;
    });

  const muaGiaiOption: FieldOption[] = danhSachMuaGiai
    .filter((val) => val.maMG ?? null)
    .map((value) => {
      return {
        optionValue: value.maMG!!,
        optionName: value.tenMG,
      } satisfies FieldOption;
    });

  const formFields: FormField[] = [
    {
      label: "Đội một",
      propertyName: "doiMot",
      type: "select",
      valueType: "number",
      options: doiOption,
    },
    {
      label: "Đội hai",
      propertyName: "doiHai",
      type: "select",
      valueType: "number",
      options: doiOption,
    },
    {
      label: "Vòng thi đấu",
      propertyName: "maVTD",
      type: "select",
      valueType: "number",
      options: [
        { optionValue: 1, optionName: "1" },
        { optionValue: 2, optionName: "2" },
      ],
    },
    {
      label: "Đội thắng",
      propertyName: "doiThang",
      type: "select",
      valueType: "number",
      options: (data: FormInputMap) => {
        return [
          { optionValue: null, optionName: "Hòa" },
          doiOption.find((val) => data.get("doiMot") === val.optionValue) ?? {
            optionValue: "",
            optionName: "",
          },
          doiOption.find((val) => data.get("doiHai") === val.optionValue) ?? {
            optionValue: "",
            optionName: "",
          },
        ] satisfies FieldOption[];
      },
    },
    {
      label: "Ngày giờ dự kiến",
      propertyName: "ngayGioDuKien",
      type: "Date",
      valueType: "DateTime",
    },
    {
      label: "Ngày giờ thực tế",
      propertyName: "ngayGioThucTe",
      type: "Date",
      valueType: "DateTime",
    },
  ];

  const columns = [
    { header: "Đội Một", accessor: "tenDoiMot" },
    { header: "Đội Hai", accessor: "tenDoiHai" },
    { header: "Vòng thi đấu", accessor: "maVTD" },
    { header: "Mã mùa giải", accessor: "tenMG" },
    { header: "Đội thắng", accessor: "tenDoiThang" },
    {
      header: "Ngày giờ dự kiến",
      accessor: "ngayGioDuKien",
      accessFunction: (data: LichThiDau) => {
        return new Date(data.ngayGioDuKien!!).toLocaleString();
      },
    },
    {
      header: "Ngày giờ thực tế",
      accessor: "ngayGioThucTe",
      accessFunction: (data: LichThiDau) => {
        return new Date(data.ngayGioThucTe!!).toLocaleString();
      },
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
  };

  const onEditClick = (data: LichThiDau, index: number) => {
    if (data satisfies LichThiDau) {
      editData.clear();
      editData.set("maTD", data.maTD ?? null);
      editData.set("doiMot", data.doiMot);
      editData.set("doiHai", data.doiHai);
      editData.set("maVTD", data.maVTD);
      editData.set("doiThang", data.doiThang ?? null);
      editData.set("maMG", data.maMG);
      editData.set("ngayGioDuKien", new Date(data.ngayGioDuKien ?? ""));
      editData.set("ngayGioThucTe", new Date(data.ngayGioThucTe ?? ""));
      selectedIndex = index;
      formState = true;
    } else {
      selectedIndex = -1;
      console.error("Data không thỏa mãn LichThiDau");
    }
  };

  const onDeleteClick = async (data: LichThiDau, index: number) => {
    if (data satisfies LichThiDau) {
      selectedIndex = index;
      await deleteTranDau(data);
    } else {
      console.error("Data không thỏa mãn loại CauThu");
    }
  };

  const deleteTranDau = async (data: LichThiDau) => {
    if (!(data satisfies LichThiDau)) {
      console.error("Không nhập đúng dữ liệu");
      return;
    }

    if (
      data.doiMot === 0 ||
      data.doiHai === 0 ||
      data.maVTD === 0 ||
      data.maMG === 0
    )
      return;

    try {
      const response = await fetch("/api/lichthidau", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Lỗi xóa lịch thi đấu");
      }

      danhSachLTD.splice(selectedIndex, 1);

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Xóa lịch thi đấu thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };

  const submitForm = async (e: Event, data: LichThiDau) => {
    e.preventDefault();
    if (!(data satisfies LichThiDau)) {
      console.error("Không nhập đúng dữ liệu");
      return;
    }

    if (
      data.doiMot === 0 ||
      data.doiHai === 0 ||
      data.maVTD === 0 ||
      data.maMG === 0
    )
      return;

    console.log(editData);
    try {
      const response = await fetch("/api/lichthidau", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Lỗi tạo lịch thi đấu");
      }

      const result = await response.json();

      result.tenDoiMot =
        danhSachDoi.find((value) => value.maDoi == result.doiMot)?.tenDoi ?? "";
      result.tenDoiHai =
        danhSachDoi.find((value) => value.maDoi == result.doiHai)?.tenDoi ?? "";
      result.tenDoiThang =
        danhSachDoi.find((value) => value.maDoi == result.doiThang)?.tenDoi ??
        null;
      result.tenMG =
        danhSachMuaGiai.find((value) => value.maMG == result.maMG)?.tenMG ?? "";
      if (result.tenDoiThang === null) result.tenDoiThang = "Hòa";

      if (selectedIndex === -1) danhSachLTD.push(result);
      else danhSachLTD[selectedIndex] = result;

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Tạo lịch thi đấu mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };
</script>

<svelte:head>
  <title>Các trận đấu</title>
</svelte:head>

<Table
  title="Danh sách các trận đấu"
  {columns}
  data={danhSachLTD}
  redirectParam={"maTD"}
  tableType="trandau"
  {isEditable}
  {onEditClick}
  {onDeleteClick}
/>

<div class="flex justify-center gap-2">
  <ButtonPrimary
    text={"Thêm trận đấu mới"}
    onclick={() => {
      formState = true;
    }}
  />
  <a
    href="/sapxeptrandau"
    class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer"
    >Sắp xếp lịch
  </a>
</div>

<!-- Form bao gồm: 
 - Đội 1 đội 2 là được select từ danh sách các đội hiện có
 - Vòng thi đấu là select có 2 options là 1 và 2 vì chỉ thi đấu hai vòng
 - Mã mùa giải (sửa thành chọn mùa giải) là select từ danh sách các mùa giải hiện có
 - Đội thắng là select với hai options là hai đội đội một và đội hai sau khi đã chọn đủ hai đội này
 - Ngày giờ tiếp tục chọn date and time dưới dạng input
  -->
<Form
  {onOpenForm}
  {onCloseForm}
  {submitForm}
  fields={formFields}
  bind:formState
/>
