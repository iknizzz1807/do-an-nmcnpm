<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import Form, { type FieldOption, type FormField, type FormInputMap } from "$lib/components/Form.svelte";
  import Table from "$lib/components/Table.svelte";
  import type { BanThang, CauThu, LichThiDau } from "$lib/types";
  import { onMount } from "svelte";
  import { SvelteMap } from "svelte/reactivity";

  type Props = {
    dsBanThang: BanThang[],
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

  const { dsBanThang, cauThuDoiMot, cauThuDoiHai, maDoiMot, 
      maDoiHai, tenDoiMot, tenDoiHai, cauThuDoiMotOption, cauThuDoiHaiOption,
      doiOption } : Props = $props();

  let danhSachBanThang = $state(dsBanThang.concat());
  let formState: boolean = $state(false);
  let selectedIndex : number = $state(0);
  let editData : FormInputMap = $state(new SvelteMap());

  const columnsBanThang = [
    { header: "Cầu thủ", accessor: "tenCT" },
    { header: "Đội", accessor: "tenDoi" },
    { header: "Thời điểm", accessor: "thoiDiem" },
    { header: "Loại bàn thắng", accessor: "loaiBanThang" },
  ];
  
  const formFields: FormField[] = [
    { label: "Đội", propertyName: "maDoi", type: "select", valueType: "number", options: doiOption },
    { label: "Cầu thủ", propertyName: "maCT", type: "select", valueType: "number", 
      options: 
        (data: FormInputMap) => {
          console.log("called Map");
          if (data.get("maDoi") === maDoiMot)
            return cauThuDoiMotOption;
          else if (data.get("maDoi") === maDoiHai)
            return cauThuDoiHaiOption;
          return [];
        }
    },
    { label: "Thời điểm", propertyName: "thoiDiem", type: "input", valueType: "number" },
    { label: "Loại bàn thắng", propertyName: "loaiBanThang", type: "select", valueType: "string", 
      options: [ { optionValue: "A", optionName: "A" }, {optionValue: "B", optionName: "B"}]},
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
      console.error("Data không thỏa mãn LichThiDau");
    }
  }

  const submitForm = async (e: Event) => {
    e.preventDefault();
    // if (doiMotInput === 0 || doiHaiInput === 0 ||
    //     vongThiDauInput === 0 || maMGInput === 0 ||
    //     ngayGioInput.trim() === ""
    // ) return;

    // const data : LichThiDau = { 
    //   maTD: maTD === 0 ? undefined : maTD,
    //   doiMot: doiMotInput, 
    //   doiHai: doiHaiInput,
    //   vongThiDau: vongThiDauInput,
    //   maMG: maMGInput,
    //   ngayGio: ngayGioInput,
    // };
    // console.log(data);

    // try {
    //   const response = await fetch("/api/lichthidau", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Lỗi tạo đội bóng");
    //   }

    //   const result = await response.json();

    //   // Cập nhật danh sách đội bóng nếu cần thiết
    //   danhSachBanThang.push(result);

    //   // Đóng form và hiện toast thành công sau khi thành công
    //   closeForm();
    //   showOkToast("Tạo đội bóng mới thành công");
    // } catch (error) {
    //   console.error("Error:", error);
    //   showErrorToast(String(error));
    // }
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