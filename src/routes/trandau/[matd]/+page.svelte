<script lang="ts">
  import type { PageProps } from "./$types";
  import type {
    BanThang,
    CauThu,
    LoaiBT,
    ThePhat,
    ViTri,
  } from "$lib/typesDatabase";
  import { type FieldOption } from "$lib/components/Form.svelte";
  import BanThangTable from "./BanThangTable.svelte";
  let { data }: PageProps = $props();

  const cauThuDoiMot: { cauThu: CauThu; viTri: ViTri }[] = $state(
    data.cauThuDoiMot
  );
  const cauThuDoiHai: { cauThu: CauThu; viTri: ViTri }[] = $state(
    data.cauThuDoiHai
  );
  const maDoiMot = $state(data.maDoiMot);
  const maDoiHai = $state(data.maDoiHai);
  const danhSachBanThang: BanThang[] = $state(data.danhSachBanThang);
  const loaiBTs: LoaiBT[] = $state(data.loaiBTs);
  const isEditable = $state(data.isEditable);
  // const danhSachThePhat : ThePhat[] = $state(data.danhSachThePhat);
  const cauThuDoiMotOption: FieldOption[] = cauThuDoiMot
    .filter((val) => val.cauThu.maCT ?? null)
    .map((value) => {
      return {
        optionValue: value.cauThu.maCT!!,
        optionName: value.cauThu.tenCT,
      } satisfies FieldOption;
    });

  const cauThuDoiHaiOption: FieldOption[] = cauThuDoiHai
    .filter((val) => val.cauThu.maCT ?? null)
    .map((value) => {
      return {
        optionValue: value.cauThu.maCT!!,
        optionName: value.cauThu.tenCT,
      } satisfies FieldOption;
    });

  const doiOption: FieldOption[] = [
    { optionValue: maDoiMot, optionName: data.tenDoiMot },
    { optionValue: maDoiHai, optionName: data.tenDoiHai },
  ];
</script>

<svelte:head>
  <title>Các trận đấu</title>
</svelte:head>

<BanThangTable
  maTD={data.maTD!!}
  thoiDiemGhiBanToiDa={data.thoiDiemGhiBanToiDa}
  dsBanThang={danhSachBanThang}
  {cauThuDoiMot}
  {cauThuDoiHai}
  {maDoiMot}
  {maDoiHai}
  tenDoiMot={data.tenDoiMot}
  tenDoiHai={data.tenDoiHai}
  {loaiBTs}
  {cauThuDoiMotOption}
  {cauThuDoiHaiOption}
  {doiOption}
  {isEditable}
/>

<!-- <ThePhatTable 
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
  doiOption={doiOption}/> -->
