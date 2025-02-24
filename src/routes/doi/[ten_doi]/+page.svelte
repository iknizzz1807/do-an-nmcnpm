<script lang="ts">
  import type { PageProps } from "./$types";
  import Table from "$lib/components/Table.svelte";
  let { data }: PageProps = $props();

  let danhSachCauThu = data.danhSachCauThuTraVe;

  const columns = [
    { header: "Mã cầu thủ", accessor: "maCT" },
    { header: "Tên cầu thủ", accessor: "tenCT" },
    { header: "Ngày sinh", accessor: "ngaySinh" },
    { header: "Loại cầu thủ", accessor: "loaiCT" },
    { header: "Ghi chú", accessor: "ghiChu" },
  ];
</script>

<Table
  title={"Danh sách các cầu thủ"}
  {columns}
  data={danhSachCauThu}
  redirectParam={"maCauThu"}
  tableType={"cauthu"}
/>
