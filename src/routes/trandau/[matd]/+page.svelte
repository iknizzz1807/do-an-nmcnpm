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

<!-- ADDED: Match Result Banner -->
<div
  class="bg-gradient-to-r from-purple-800 to-indigo-900 text-white rounded-lg shadow-lg p-6 mb-8"
>
  <div
    class="text-center text-lime-400 font-semibold tracking-wider text-sm mb-4"
  >
    FULL TIME
  </div>
  <div class="grid grid-cols-3 items-center text-center">
    <!-- Team 1 -->
    <div class="flex flex-col items-center justify-center space-y-2">
      <!-- Placeholder for team logo. In a real app, this would be an <img> tag with data.doiMot.logoUrl -->
      <div
        class="w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full flex items-center justify-center border-2 border-white/10"
      >
        <!-- Using team initials as a placeholder -->
        <span class="text-3xl font-bold text-gray-300"
          >{data.tenDoiMot.substring(0, 1).toUpperCase()}</span
        >
      </div>
      <h2 class="text-lg sm:text-xl font-bold">{data.tenDoiMot}</h2>
    </div>

    <!-- Score -->
    <div class="text-4xl sm:text-5xl font-bold text-lime-300">
      <span class="tracking-widest">
        {danhSachBanThang.filter((bt) => bt.maDoi === maDoiMot)
          .length} - {danhSachBanThang.filter((bt) => bt.maDoi === maDoiHai)
          .length}
      </span>
    </div>

    <!-- Team 2 -->
    <div class="flex flex-col items-center justify-center space-y-2">
      <!-- Placeholder for team logo -->
      <div
        class="w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full flex items-center justify-center border-2 border-white/10"
      >
        <span class="text-3xl font-bold text-gray-300"
          >{data.tenDoiHai.substring(0, 1).toUpperCase()}</span
        >
      </div>
      <h2 class="text-lg sm:text-xl font-bold">{data.tenDoiHai}</h2>
    </div>
  </div>
</div>

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
