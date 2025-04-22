<script lang="ts">
  import type { PageProps } from "./$types";
  import Table from "$lib/components/Table.svelte";
  import type { CauThuGhiBan } from "$lib/typesResponse";

  let { data }: PageProps = $props();

  let danhSachCauThu: CauThuGhiBan[] = $state(data.dsCTGhiBan);

  const columns = [
    { header: "", accessor: "maCT", hidden: true },
    { header: "Tên cầu thủ", accessor: "tenCT" },
    { header: "Tên đội", accessor: "tenDoi" },
    { header: "Loại cầu thủ", accessor: "maLCT" },
    { header: "Số bàn thắng", accessor: "soBanThang" },
  ];

</script>

<Table
  title={"Danh sách các cầu thủ"}
  {columns}
  data={danhSachCauThu}
  redirectParam={""}
  tableType={""}
/>