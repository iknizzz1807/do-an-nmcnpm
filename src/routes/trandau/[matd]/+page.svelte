<script lang="ts">
  import type { PageProps } from "./$types";
  import type { BanThang, CauThu, ThePhat } from "$lib/typesDatabase";
  import { type FieldOption } from "$lib/components/Form.svelte";
  import BanThangTable from "./BanThangTable.svelte";
  import ThePhatTable from "./ThePhatTable.svelte";
  import { page } from "$app/state";
  let { data }: PageProps = $props();

  const cauThuDoiMot : CauThu[] = $state(data.cauThuDoiMot);
  const cauThuDoiHai : CauThu[] = $state(data.cauThuDoiHai);
  const maDoiMot = $state(data.maDoiMot);
  const maDoiHai = $state(data.maDoiHai);
  const danhSachBanThang: BanThang[] = $state(data.danhSachBanThang);
  const isEditable = $state(data.isEditable);
  // const danhSachThePhat : ThePhat[] = $state(data.danhSachThePhat);
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
<a href={ page.url.pathname + "/chitiet"}>Chi tiết</a>

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
  doiOption={doiOption}
  isEditable={isEditable}/>

  
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

