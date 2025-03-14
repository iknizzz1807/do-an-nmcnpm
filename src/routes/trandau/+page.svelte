<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import type { DoiBong, DSMuaGiai, LichThiDau } from "$lib/types";
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import { muaGiai } from "$lib/components/Nav.svelte"
  import { get } from "svelte/store";
  import { type FieldOption, type FormField, type FormInputMap } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import { validate } from "uuid";
  import { getViewSelectedFields } from "drizzle-orm";
  let { data }: PageProps = $props();

  let danhSachLTD: LichThiDau[] = $state(data.danhSachLTD);
  const danhSachDoi : DoiBong[] = $state(data.danhSachDoi);
  const danhSachMuaGiai : DSMuaGiai[] = $state(data.danhSachMuaGiai);

  for (const ltd of danhSachLTD) {
    let tenDoiThang = danhSachDoi.find((value) => value.maDoi == ltd.doiThang)?.tenDoi ?? null;
    if (tenDoiThang === null)
      tenDoiThang = "Hòa";
    ltd.tenDoiThang = tenDoiThang;
  }

  const doiOption : FieldOption[] = danhSachDoi.filter((val) => val.maDoi ?? null).map((value) => {
    return { optionValue: value.maDoi!!, optionName: value.tenDoi } satisfies FieldOption;
  });
  
  const muaGiaiOption : FieldOption[] = danhSachMuaGiai.filter((val) => val.maMG ?? null).map((value) => {
    return { optionValue: value.maMG!!, optionName: value.tenMG } satisfies FieldOption;
  });

  const formFields: FormField[] = [
    { label: "Đội một", propertyName: "doiMot", type: "select", valueType: "number", options: doiOption},
    { label: "Đội hai", propertyName: "doiHai", type: "select", valueType: "number", options: doiOption},
    { label: "Vòng thi đấu", propertyName: "vongThiDau", type: "select", valueType: "number", 
      options: [ { optionValue: 1, optionName: "1" }, {optionValue: 2, optionName: "2"}]},
    { label: "Đội thắng", propertyName: "doiThang", type: "select", valueType: "number", options: doiOption},
    { label: "Ngày giờ", propertyName: "ngayGio", type: "Date", valueType: "Date"}
  ];

  const columns = [
    { header: "Đội Một", accessor: "tenDoiMot" },
    { header: "Đội Hai", accessor: "tenDoiHai" },
    { header: "Vòng thi đấu", accessor: "vongThiDau" },
    { header: "Mã mùa giải", accessor: "tenMG" },
    { header: "Đội thắng", accessor: "tenDoiThang" },
    { header: "Ngày giờ", accessor: "ngayGio" },
  ];

  let selectedIndex : number = $state(0);

  let formState : boolean = $state(false);
  let editData = $state(new Map());

  const onOpenForm = () => {
    if (selectedIndex == -1) 
      return null;
    if (editData.size > 0)
      return editData;
    return new Map();
  }

  const onCloseForm = () => {
    editData.clear();
  }

  const onItemClick = (data: any, index: number) => {
    if (data satisfies LichThiDau) {
      editData.clear();
      editData.set("maTD", data.maTD);
      editData.set("doiMot", data.doiMot);
      editData.set("doiHai", data.doiHai);
      editData.set("vongThiDau", data.vongThiDau);
      editData.set("doiThang", data.doiThang);
      editData.set("maMG", data.maMG);
      editData.set("ngayGio", data.ngayGio);
      selectedIndex = index;
      formState = true;
    }
    else {
      selectedIndex = -1;
      console.error("Data không thỏa mãn LichThiDau");
    }
  }

  const submitForm = async (e: Event, data: any) => {
    e.preventDefault();
    if (!(data satisfies LichThiDau)) {
      console.error("Không nhập đúng dữ liệu");
      return;
    }

    if (data.doiMot === 0 || data.doiHai === 0 ||
        data.vongThiDau === 0 || data.maMG === 0
    ) return;
    
    try {
      const response = await fetch("/api/lichthidau", {
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

      result.tenDoiMot = danhSachDoi.find((value) => value.maDoi == result.doiMot)?.tenDoi ?? "";
      result.tenDoiHai = danhSachDoi.find((value) => value.maDoi == result.doiHai)?.tenDoi ?? "";
      result.tenDoiThang = danhSachDoi.find((value) => value.maDoi == result.doiThang)?.tenDoi ?? "";
      result.tenMG = danhSachMuaGiai.find((value) => value.maMG == result.maMG)?.tenMG ?? "";
      
      if (selectedIndex === -1)
        danhSachLTD.push(result);
      else
        danhSachLTD[selectedIndex] = result;

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Tạo đội bóng mới thành công");
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
  redirectParam={"tenCT"}
  tableType="cauThu"
  onItemClick={onItemClick}
/>

<div class="flex justify-center">
  <ButtonPrimary text={"Thêm trận đấu mới"} onclick={() => {formState = true}} />
</div>

<!-- Form bao gồm: 
 - Đội 1 đội 2 là được select từ danh sách các đội hiện có
 - Vòng thi đấu là select có 2 options là 1 và 2 vì chỉ thi đấu hai vòng
 - Mã mùa giải (sửa thành chọn mùa giải) là select từ danh sách các mùa giải hiện có
 - Đội thắng là select với hai options là hai đội đội một và đội hai sau khi đã chọn đủ hai đội này
 - Ngày giờ tiếp tục chọn date and time dưới dạng input
  -->
<Form 
  onOpenForm={onOpenForm}
  onCloseForm={onCloseForm}
  submitForm={submitForm}
  fields={formFields}
  bind:formState={formState}
/>