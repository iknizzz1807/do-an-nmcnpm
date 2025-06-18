<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Form, {
    type FieldOption,
    type FormField,
    type FormInputMap,
  } from "$lib/components/Form.svelte";
  import Table from "$lib/components/Table.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { BanThang, CauThu, LoaiBT, ViTri } from "$lib/typesDatabase";
  import type { UpdateBanThang } from "$lib/typesResponse";
  import { onMount } from "svelte";
  import { SvelteMap } from "svelte/reactivity";

  type Props = {
    maTD: number;
    dsBanThang: BanThang[];
    banThangDoiMot: number;
    banThangDoiHai: number;
    cauThuDoiMot: { cauThu: CauThu; viTri: ViTri }[];
    cauThuDoiHai: { cauThu: CauThu; viTri: ViTri }[];
    thoiDiemGhiBanToiDa: number;
    maDoiMot: number;
    maDoiHai: number;
    tenDoiMot: string;
    tenDoiHai: string;
    loaiBTs: LoaiBT[];
    cauThuDoiMotOption: FieldOption[];
    cauThuDoiHaiOption: FieldOption[];
    doiOption: FieldOption[];
    isEditable: boolean;
  };

  let {
    maTD,
    dsBanThang = $bindable([]),
    banThangDoiMot = $bindable(0),
    banThangDoiHai = $bindable(0),
    cauThuDoiMot,
    cauThuDoiHai,
    maDoiMot,
    thoiDiemGhiBanToiDa,
    maDoiHai,
    tenDoiMot,
    tenDoiHai,
    loaiBTs,
    cauThuDoiMotOption,
    cauThuDoiHaiOption,
    doiOption,
    isEditable,
  }: Props = $props();

  const sortDSBT = (a: BanThang, b: BanThang) => a.thoiDiem - b.thoiDiem;
  let loaiBTOptions: FieldOption[] = $state(
    loaiBTs.map((value) => ({
      optionValue: value.maLBT!!,
      optionName: value.tenLBT,
    }))
  );
  let danhSachBanThang = $state(dsBanThang);
  let formState: boolean = $state(false);
  let selectedIndex: number = $state(-1);
  let editData: FormInputMap = $state(new SvelteMap());

  const columnsBanThang = [
    { header: "Cầu thủ", accessor: "tenCT" },
    { header: "Đội", accessor: "tenDoi" },
    { header: "Thời điểm", accessor: "thoiDiem" },
    { header: "Loại bàn thắng", accessor: "tenLBT" },
  ];

  const formFields: FormField[] = [
    {
      label: "Đội",
      propertyName: "maDoi",
      type: "select",
      valueType: "number",
      options: doiOption,
    },
    {
      label: "Cầu thủ",
      propertyName: "maCT",
      type: "select",
      valueType: "number",
      options: (data: FormInputMap) => {
        if (data.get("maDoi") === maDoiMot) return cauThuDoiMotOption;
        else if (data.get("maDoi") === maDoiHai) return cauThuDoiHaiOption;
        return [];
      },
    },
    {
      label: "Thời điểm",
      propertyName: "thoiDiem",
      type: "input",
      valueType: "number",
      max: thoiDiemGhiBanToiDa,
    },
    {
      label: "Loại bàn thắng",
      propertyName: "maLBT",
      type: "select",
      valueType: "number",
      options: loaiBTOptions,
    },
  ];

  onMount(() => {
    for (let banThang of danhSachBanThang) {
      let cauThu: CauThu | null;
      if (banThang.maDoi === maDoiMot) {
        cauThu =
          cauThuDoiMot.find((val) => val.cauThu.maCT === banThang.maCT)
            ?.cauThu ?? null;
        banThang.tenDoi = tenDoiMot;
      } else {
        cauThu =
          cauThuDoiHai.find((val) => val.cauThu.maCT === banThang.maCT)
            ?.cauThu ?? null;
        banThang.tenDoi = tenDoiHai;
      }
      if (cauThu === null) continue;
      banThang.tenCT = cauThu.tenCT;
      banThang.tenLBT = loaiBTs.find((val) => val.maLBT === banThang.maLBT)?.tenLBT ?? "Không xác định";
      
      if (banThang.maDoi === maDoiMot) {
        if (banThang.tenLBT === "Phản lưới")
          banThangDoiHai++;
        else
          banThangDoiMot++;
      }
      else {
        if (banThang.tenLBT === "Phản lưới")
          banThangDoiMot++;
        else
          banThangDoiHai++;
      } 
    }
  });

  const onOpenForm = (): FormInputMap | null => {
    if (editData.size > 0) return editData;
    return new SvelteMap();
  };

  const onCloseForm = () => {
    editData.clear();
    selectedIndex = -1;
    formState = false;
  };

  const onEditClick = (data: BanThang, index: number) => {
    if (data satisfies BanThang) {
      editData = new SvelteMap(Object.entries(data));
      selectedIndex = index;
      formState = true;
    } else {
      selectedIndex = -1;
      console.error("Data không thỏa mãn BanThang");
    }
  };

  const submitForm = async (e: Event, data: BanThang) => {
    e.preventDefault();

    try {
      const body: UpdateBanThang = {
        oldBanThang:
          selectedIndex == -1 ? null : danhSachBanThang[selectedIndex],
        newBanThang: data,
      };

      const response = await fetch("/api/banthang/" + maTD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const result = await response.json();
        if (result.message) {
          throw new Error(result.message);
        }
        throw new Error("Lỗi xóa Bàn thắng");
      }

      let result = await response.json();

      let prevBanThang = null;
      if (selectedIndex === -1) {
        let cauThu: CauThu | null;
        if (result.maDoi === maDoiMot) {
          cauThu =
            cauThuDoiMot.find((val) => val.cauThu.maCT === result.maCT)
              ?.cauThu ?? null;
          result.tenDoi = tenDoiMot;
        } else {
          cauThu =
            cauThuDoiHai.find((val) => val.cauThu.maCT === result.maCT)
              ?.cauThu ?? null;
          result.tenDoi = tenDoiHai;
        }
        if (cauThu === null)
          throw new Error("WTF tại sao lại không tìm thấy cầu thủ???");
        result.tenCT = cauThu.tenCT;

        danhSachBanThang.push(result);
        danhSachBanThang.sort(sortDSBT);
      } 
      else {
        prevBanThang = danhSachBanThang[selectedIndex];
        danhSachBanThang[selectedIndex] = result;
      }
      result.tenLBT = loaiBTs.find((val) => val.maLBT === result.maLBT)?.tenLBT ?? "Không xác định";
      
      console.log(result.tenLBT);
      if (prevBanThang) {
        if (prevBanThang.maDoi === maDoiMot) {
          if (prevBanThang.tenLBT === "Phản lưới")
            banThangDoiHai--;
          else
            banThangDoiMot--;
        } else {
          if (prevBanThang.tenLBT === "Phản lưới")
            banThangDoiMot--;
          else
            banThangDoiHai--;
        }
      }

      if (result.maDoi === maDoiMot) {
        if (result.tenLBT === "Phản lưới")
          banThangDoiHai++;
        else
          banThangDoiMot++;
      }
      else {
        if (result.tenLBT === "Phản lưới")
          banThangDoiMot++;
        else
          banThangDoiHai++;
      } 
      result.tenLBT = loaiBTs.find((val) => val.maLBT === result.maLBT)?.tenLBT ?? "Không xác định";

      formState = false;
      showOkToast("Tạo Bàn thắng mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };

  const onDeleteClick = async (data: any, index: number) => {
    if (data satisfies BanThang) {
      selectedIndex = index;
      await deleteBanThang(data);
      selectedIndex = -1;
    } else {
      console.error("Data không thỏa mãn");
    }
  };

  const deleteBanThang = async (banThang: BanThang) => {
    try {
      const response = await fetch("/api/banthang/" + banThang.maTD, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(banThang),
      });

      if (!response.ok) {
        const result = await response.json();
        if (result.message) {
          throw new Error(result.message);
        }
        throw new Error("Lỗi xóa Bàn thắng");
      }

      const result: BanThang = danhSachBanThang[selectedIndex];
      result.tenLBT = loaiBTs.find((val) => val.maLBT === result.maLBT)?.tenLBT ?? "Không xác định";
      if (result.maDoi === maDoiMot) {
        if (result.tenLBT === "Phản lưới")
          banThangDoiHai--;
        else
          banThangDoiMot--;
      }
      else {
        if (result.tenLBT === "Phản lưới")
          banThangDoiMot--;
        else
          banThangDoiHai--;
      } 
      danhSachBanThang.splice(selectedIndex, 1);

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Xóa bàn thắng thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };
</script>

{#if isEditable}
  <div class="flex justify-center gap-4">
    <ButtonPrimary
      text=" Chi tiết danh sách cầu thủ thi đấu"
      onclick={() => goto(page.url.pathname + "/chitiet")}
      />
    <ButtonPrimary
      text={"Thêm bàn thắng mới"}
      onclick={() => (formState = true)}
      />
  </div>
{/if}

<Table
  title="Danh sách các bàn thắng"
  columns={columnsBanThang}
  data={danhSachBanThang}
  redirectParam={""}
  tableType=""
  {onEditClick}
  {onDeleteClick}
  {isEditable}
/>

<Form
  {onOpenForm}
  {onCloseForm}
  {submitForm}
  fields={formFields}
  bind:formState
/>
