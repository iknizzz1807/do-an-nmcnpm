<script lang="ts">
  import type { PageProps } from "./$types";
  import type { BanThang, CauThu, ThePhat } from "$lib/typesDatabase";
  import { type FieldOption } from "$lib/components/Form.svelte";
  import BanThangTable from "./BanThangTable.svelte";
  import ThePhatTable from "./ThePhatTable.svelte";
  let { data }: PageProps = $props();

  const cauThuDoiMot : CauThu[] = $state(data.cauThuDoiMot);
  const cauThuDoiHai : CauThu[] = $state(data.cauThuDoiHai);
  const maDoiMot = $state(data.maDoiMot);
  const maDoiHai = $state(data.maDoiHai);
  const danhSachBanThang: BanThang[] = $state(data.danhSachBanThang);
  const danhSachThePhat : ThePhat[] = $state(data.danhSachThePhat);
  const cauThuDoiMotOption : FieldOption[] = cauThuDoiMot.filter((val) => val.maCT ?? null).map((value) => {
    return { optionValue: value.maCT!!, optionName: value.tenCT } satisfies FieldOption;
  });
  
  const cauThuDoiHaiOption : FieldOption[] = cauThuDoiHai.filter((val) => val.maCT ?? null).map((value) => {
    return { optionValue: value.maCT!!, optionName: value.tenCT } satisfies FieldOption;
  });

  const doiOption : FieldOption[] = [
    { optionValue: maDoiMot, optionName: data.tenDoiMot },
    { optionValue: maDoiHai, optionName: data.tenDoiHai },
  ]

</script>

<svelte:head>
  <title>Các trận đấu</title>
</svelte:head>

<BanThangTable 
  maTD={data.maTD!!}
  thoiDiemGhiBanToiDa={data.thoiDiemGhiBanToiDa}
  dsBanThang={danhSachBanThang}
  cauThuDoiMot={cauThuDoiMot}
  cauThuDoiHai={cauThuDoiHai}
  maDoiMot={maDoiMot}
  maDoiHai={maDoiHai}
  tenDoiMot={data.tenDoiMot}
  tenDoiHai={data.tenDoiHai}
  cauThuDoiMotOption={cauThuDoiMotOption}
  cauThuDoiHaiOption={cauThuDoiHaiOption}
  doiOption={doiOption}/>

  
<ThePhatTable 
  maTD={data.maTD!!}
  dsThePhat={danhSachThePhat}
  cauThuDoiMot={cauThuDoiMot}
  cauThuDoiHai={cauThuDoiHai}
  maDoiMot={maDoiMot}
  maDoiHai={maDoiHai}
  tenDoiMot={data.tenDoiMot}
  tenDoiHai={data.tenDoiHai}
  cauThuDoiMotOption={cauThuDoiMotOption}
  cauThuDoiHaiOption={cauThuDoiHaiOption}
  doiOption={doiOption}/>

<!-- <Table
  title="Danh sách các thẻ phạt"
  columns={columnsThePhat}
  data={danhSachThePhat}
  redirectParam={""}
  tableType=""
  onItemClick={onEditClick}
/>

<div class="flex justify-center">
  <ButtonPrimary text={"Thêm thẻ phạt mới"} onclick={openForm} />
</div> -->

<!-- Form bao gồm: 
 - Đội 1 đội 2 là được select từ danh sách các đội hiện có
 - Vòng thi đấu là select có 2 options là 1 và 2 vì chỉ thi đấu hai vòng
 - Mã mùa giải (sửa thành chọn mùa giải) là select từ danh sách các mùa giải hiện có
 - Đội thắng là select với hai options là hai đội đội một và đội hai sau khi đã chọn đủ hai đội này
 - Ngày giờ tiếp tục chọn date and time dưới dạng input
  -->

