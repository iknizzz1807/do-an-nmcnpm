<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import type { LichThiDau } from "$lib/types";
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