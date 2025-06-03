<script lang="ts">
  import type { PageProps } from "./$types";
  import Table, { type TableColumnSpecifier, type TableProps } from "$lib/components/Table.svelte";
  import type { CauThu, DoiBong, LichThiDau, LoaiCT } from "$lib/typesDatabase";
  let { data }: PageProps = $props();

  const cauThu: CauThu = $state(data.cauThu!!);
  const danhSachLoaiCT: LoaiCT[] = $state(data.loaiCTs);
  const doiBong: DoiBong = $state(data.doiBong!!);
  const tranDau: LichThiDau[] = $state(data.tranDau);
  const tuoiMin: number = $state(data.tuoiMin);
  const tuoiMax: number = $state(data.tuoiMax);
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - tuoiMax);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - tuoiMin);

  const columnsCauThu : TableColumnSpecifier[] = [
    { header: "Mã cầu thủ", accessor: "maCT", hidden: true },
    { header: "Tên cầu thủ", accessor: "tenCT" },
    { header: "Ngày sinh", accessor: "ngaySinh" },
    {
      header: "Loại cầu thủ",
      accessor: "maLCT",
      accessFunction: (data: CauThu) => {
        return (
          danhSachLoaiCT.find((value) => value.maLCT === data.maLCT)?.tenLCT ??
          ""
        );
      },
    },
    { header: "Số áo", accessor: "soAo" },
    { header: "Ghi chú", accessor: "ghiChu" },
  ];
  
  const columnsDoiBong: TableColumnSpecifier[] = [
    { header: "", accessor: "maDoi", hidden: true },
    { header: "Tên đội", accessor: "tenDoi" },
    { header: "Sân nhà", accessor: "tenSan" },
  ];
  
  const columnsTranDau = [
    { header: "Đội Một", accessor: "tenDoiMot" },
    { header: "Đội Hai", accessor: "tenDoiHai" },
    { header: "Vòng thi đấu", accessor: "tenVTD" },
    { header: "Đội thắng", accessor: "tenDoiThang" },
    {
      header: "Ngày giờ",
      accessor: "ngayGioThucTe",
      accessFunction: (data: LichThiDau) => {
        return new Date(data.ngayGioThucTe!!).toLocaleString();
      },
    },
  ];
</script>

<Table
  title={"Cầu thủ"}
  columns={columnsCauThu}
  data={[cauThu]}
  redirectParam={""}
  tableType={""}
/>

<Table
  title={"Đội bóng"}
  columns={columnsDoiBong}
  data={[doiBong]}
  redirectParam={"maDoi"}
  tableType={"doi"}
/>
<Table
  title={"Danh sách các trận dấu"}
  columns={columnsTranDau}
  data={tranDau}
  redirectParam={"maTD"}
  tableType={"trandau"}
/>