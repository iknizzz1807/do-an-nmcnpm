<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import type { LichThiDau } from "$lib/types";
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  let { data }: PageProps = $props();

  let danhSachLTD: LichThiDau[] = $state(data.danhSachLTD);

  const columns = [
    { header: "Đội Một", accessor: "doiMot" },
    { header: "Đội Hai", accessor: "doiHai" },
    { header: "Vòng thi đấu", accessor: "vongThiDau" },
    { header: "Mã mùa giải", accessor: "maMG" },
    { header: "Đội thắng", accessor: "doiThang" },
    { header: "Ngày giờ", accessor: "ngayGio" },
  ];
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
/>

<div class="flex justify-center">
  <ButtonPrimary text={"Thêm trận đấu mới"} onclick={() => {}} />
</div>

<!-- Form bao gồm: 
 - Đội 1 đội 2 là được select từ danh sách các đội hiện có
 - Vòng thi đấu là select có 2 options là 1 và 2 vì chỉ thi đấu hai vòng
 - Mã mùa giải (sửa thành chọn mùa giải) là select từ danh sách các mùa giải hiện có
 - Đội thắng là select với hai options là hai đội đội một và đội hai sau khi đã chọn đủ hai đội này
 - Ngày giờ tiếp tục chọn date and time dưới dạng input
  -->
