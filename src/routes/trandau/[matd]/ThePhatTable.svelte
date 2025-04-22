<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import Form, { type FieldOption, type FormField, type FormInputMap } from "$lib/components/Form.svelte";
  import Table from "$lib/components/Table.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { ThePhat, CauThu } from "$lib/typesDatabase";
  import type { UpdateThePhat } from "$lib/typesResponse";
  import { onMount } from "svelte";
  import { SvelteMap } from "svelte/reactivity";

  type Props = {
    maTD: number,
    dsThePhat: ThePhat[],
    cauThuDoiMot : CauThu[],
    cauThuDoiHai : CauThu[],
    maDoiMot: number, 
    maDoiHai: number,
    tenDoiMot: string,
    tenDoiHai: string,
    cauThuDoiMotOption: FieldOption[],
    cauThuDoiHaiOption: FieldOption[],
    doiOption: FieldOption[]
  }

  const { maTD, dsThePhat, cauThuDoiMot, cauThuDoiHai, maDoiMot, 
      maDoiHai, tenDoiMot, tenDoiHai, cauThuDoiMotOption, cauThuDoiHaiOption,
      doiOption } : Props = $props();

  let danhSachThePhat = $state(dsThePhat.concat());

  let formState: boolean = $state(false);
  let selectedIndex : number = $state(0);
  let editData : FormInputMap = $state(new SvelteMap());

  const columnsThePhat = [
    { header: "Cầu thủ", accessor: "tenCT" },
    { header: "Đội", accessor: "tenDoi" },
    { header: "Thời điểm", accessor: "thoiDiem" },
    { header: "Loại thẻ", accessor: "maLTP" },
  ];
  
  const formFields: FormField[] = [
    { label: "Đội", propertyName: "maDoi", type: "select", valueType: "number", options: doiOption },
    { label: "Cầu thủ", propertyName: "maCT", type: "select", valueType: "number", options: 
      (data: FormInputMap) => {
        if (data.get("maDoi") === maDoiMot)
          return cauThuDoiMotOption;
        else if (data.get("maDoi") === maDoiHai)
          return cauThuDoiHaiOption;
        return [];
      }
    },
    { label: "Thời điểm", propertyName: "thoiDiem", type: "input", valueType: "number" },
    { label: "Loại thẻ phạt", propertyName: "maLTP", type: "select", valueType: "number", 
      options: [ { optionValue: 1, optionName: "Vàng" }, {optionValue: 2, optionName: "Đỏ"}]},
  ];

  onMount(() => {
    for (let thePhat of danhSachThePhat) {
      let cauThu : CauThu | null;
      if (thePhat.maDoi === maDoiMot) {
        cauThu = cauThuDoiMot.find((val) => val.maCT === thePhat.maCT) ?? null;
        thePhat.tenDoi = tenDoiMot;
      }
      else {
        cauThu = cauThuDoiHai.find((val) => val.maCT === thePhat.maCT) ?? null;
        thePhat.tenDoi = tenDoiHai;
      }
      if (cauThu === null)
        continue;
      thePhat.tenCT = cauThu.tenCT;
    }
  })

  const onOpenForm = () : FormInputMap | null => {
    selectedIndex = -1;
    if (editData.size > 0)
      return editData;
    return new SvelteMap();
  }

  const onCloseForm = () => {
    editData.clear();
  }

  const onEditClick = (data: ThePhat, index: number)  => {
    if (data satisfies ThePhat) {
      editData = new SvelteMap(Object.entries(data));
      selectedIndex = index;
      formState = true;
    }
    else {
      selectedIndex = -1;
      console.error("Data không thỏa mãn ThePhat");
    }
  }

  const submitForm = async (e: Event, data: ThePhat) => {
    e.preventDefault();

    try {
      const body : UpdateThePhat = {
        oldThePhat: selectedIndex === -1 ? null : danhSachThePhat[selectedIndex],
        newThePhat: data
      }

      const response = await fetch("/api/thephat/" + maTD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Lỗi tạo Thẻ phạt");
      }

      const result = await response.json();

      // Cập nhật danh sách Thẻ phạt nếu cần thiết
      if (selectedIndex === -1)
      {
        danhSachThePhat.push(result);
      }
      else 
        danhSachThePhat[selectedIndex] = result;

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Tạo Thẻ phạt mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };

</script>


<Table
  title="Danh sách các thẻ phạt"
  columns={columnsThePhat}
  data={danhSachThePhat}
  redirectParam={""}
  tableType=""
  onEditClick={onEditClick}
/>

<div class="flex justify-center">
  <ButtonPrimary text={"Thêm thẻ phạt mới"} onclick={() => formState = true} />
</div>

<Form 
  onOpenForm={onOpenForm}
  onCloseForm={onCloseForm}
  submitForm={submitForm}
  fields={formFields}
  bind:formState={formState}
/>