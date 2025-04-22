<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import Form, { type FieldOption, type FormField, type FormInputMap } from "$lib/components/Form.svelte";
  import Table from "$lib/components/Table.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { BanThang, CauThu } from "$lib/typesDatabase";
  import type { UpdateBanThang } from "$lib/typesResponse";
  import { onMount } from "svelte";
  import { SvelteMap } from "svelte/reactivity";

  type Props = {
    maTD: number,
    dsBanThang: BanThang[],
    cauThuDoiMot : CauThu[],
    cauThuDoiHai : CauThu[],
    thoiDiemGhiBanToiDa: number,
    maDoiMot: number, 
    maDoiHai: number,
    tenDoiMot: string,
    tenDoiHai: string,
    cauThuDoiMotOption: FieldOption[],
    cauThuDoiHaiOption: FieldOption[],
    doiOption: FieldOption[]
  }

  const { maTD, dsBanThang, cauThuDoiMot, cauThuDoiHai, maDoiMot, thoiDiemGhiBanToiDa,
      maDoiHai, tenDoiMot, tenDoiHai, cauThuDoiMotOption, cauThuDoiHaiOption,
      doiOption } : Props = $props();

  const sortDSBT = (a: BanThang, b : BanThang) => a.thoiDiem - b.thoiDiem;
  let danhSachBanThang = $state(dsBanThang.concat());
  let formState: boolean = $state(false);
  let selectedIndex : number = $state(-1);
  let editData : FormInputMap = $state(new SvelteMap());

  const columnsBanThang = [
    { header: "Cầu thủ", accessor: "tenCT" },
    { header: "Đội", accessor: "tenDoi" },
    { header: "Thời điểm", accessor: "thoiDiem" },
    { header: "Loại bàn thắng", accessor: "maLBT" },
  ];
  
  const formFields: FormField[] = [
    { label: "Đội", propertyName: "maDoi", type: "select", valueType: "number", options: doiOption },
    { label: "Cầu thủ", propertyName: "maCT", type: "select", valueType: "number", 
      options: 
        (data: FormInputMap) => {
          if (data.get("maDoi") === maDoiMot)
            return cauThuDoiMotOption;
          else if (data.get("maDoi") === maDoiHai)
            return cauThuDoiHaiOption;
          return [];
        }
    },
    { label: "Thời điểm", propertyName: "thoiDiem", type: "input", valueType: "number", max: thoiDiemGhiBanToiDa },
    { label: "Loại bàn thắng", propertyName: "maLBT", type: "select", valueType: "number", 
      options: [ { optionValue: 1, optionName: "A" }, {optionValue: 2, optionName: "B"}]},
  ];

  onMount(() => {
    for (let banThang of danhSachBanThang) {
      let cauThu : CauThu | null;
      if (banThang.maDoi === maDoiMot) {
        cauThu = cauThuDoiMot.find((val) => val.maCT === banThang.maCT) ?? null;
        banThang.tenDoi = tenDoiMot;
      }
      else {
        cauThu = cauThuDoiHai.find((val) => val.maCT === banThang.maCT) ?? null;
        banThang.tenDoi = tenDoiHai;
      }
      if (cauThu === null)
        continue;
      banThang.tenCT = cauThu.tenCT;
    }
  })

  const onOpenForm = () : FormInputMap | null => {
    if (editData.size > 0)
      return editData;
    return new SvelteMap();
  }

  const onCloseForm = () => {
    editData.clear();
  }

  const onEditClick = (data: BanThang, index: number) => {
    if (data satisfies BanThang) {
      editData = new SvelteMap(Object.entries(data));
      selectedIndex = index;
      formState = true;
    }
    else {
      selectedIndex = -1;
      console.error("Data không thỏa mãn BanThang");
    }
  }

  const submitForm = async (e: Event, data: BanThang) => {
    e.preventDefault();

    try {
      const body : UpdateBanThang = {
        oldBanThang: selectedIndex == -1 ? null : danhSachBanThang[selectedIndex],
        newBanThang: data
      }

      const response = await fetch("/api/banthang/" + maTD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Lỗi tạo Bàn thắng");
      }

      let result = await response.json();

      // Cập nhật danh sách Bàn thắng nếu cần thiết
      if (selectedIndex === -1) {
        let cauThu : CauThu | null;
        if (result.maDoi === maDoiMot) {
          cauThu = cauThuDoiMot.find((val) => val.maCT === result.maCT) ?? null;
          result.tenDoi = tenDoiMot;
        }
        else {
          cauThu = cauThuDoiHai.find((val) => val.maCT === result.maCT) ?? null;
          result.tenDoi = tenDoiHai;
        }
        if (cauThu === null)
          throw new Error("WTF tại sao lại không tìm thấy cầu thủ???");
        result.tenCT = cauThu.tenCT;
        danhSachBanThang.push(result);
        danhSachBanThang.sort(sortDSBT);
      }
      else 
        danhSachBanThang[selectedIndex] = result;

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Tạo Bàn thắng mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };

</script>


<Table
  title="Danh sách các bàn thắng"
  columns={columnsBanThang}
  data={danhSachBanThang}
  redirectParam={""}
  tableType=""
  onEditClick={onEditClick}
/>

<div class="flex justify-center">
  <ButtonPrimary text={"Thêm bàn thắng mới"} onclick={() => formState = true} />
</div>

<Form 
  onOpenForm={onOpenForm}
  onCloseForm={onCloseForm}
  submitForm={submitForm}
  fields={formFields}
  bind:formState={formState}
/>