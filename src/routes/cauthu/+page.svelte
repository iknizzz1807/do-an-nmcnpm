<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import type { CauThu } from "$lib/types";
  let { data }: PageProps = $props();

  let danhSachCauThu: CauThu[] = $state(data.danhSachCauThu);

  const columns = [
    { header: "Tên cầu thủ", accessor: "tenCT" },
    { header: "Loại cầu thủ", accessor: "loaiCT" },
    { header: "Ghi chú", accessor: "ghiChu" },
    { header: "Nước ngoài", accessor: "nuocNgoai" },
    { header: "Ngày sinh", accessor: "ngaySinh" },
  ];

</script>

<svelte:head>
  <title>Các Cầu thủ</title>
</svelte:head>

<Table
  title="Danh sách các Cầu thủ"
  {columns}
  data={danhSachCauThu}
  redirectParam={"tenCT"}
  tableType="cauThu"
/>