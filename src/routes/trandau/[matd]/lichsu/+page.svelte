<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import type { BanThang, CauThu, DoiBong, LoaiBT, MuaGiai, SanNha, ViTri, VongTD } from "$lib/typesDatabase";
  import { onMount } from "svelte";
  import type { BanThangBackup } from "$lib/typesBackup";
  let { data }: PageProps = $props();

  type Props = {
    lichSu: BanThangBackup[];
    cauThuDoiMot: { cauThu: CauThu; viTri: ViTri }[];
    cauThuDoiHai: { cauThu: CauThu; viTri: ViTri }[];
    doiMot: number;
    doiHai: number;
    tenDoiMot: string;
    tenDoiHai: string;
    loaiBTs: LoaiBT[];
  };

  let lichSu: BanThangBackup[] = $state(data.lichSu);
  let cauThuDoiMot: { cauThu: CauThu; viTri: ViTri }[] = $state(data.cauThuDoiMot);
  let cauThuDoiHai: { cauThu: CauThu; viTri: ViTri }[] = $state(data.cauThuDoiHai);
  let doiMot = $state(data.doiMot);
  let doiHai = $state(data.doiHai);
  let loaiBTs: LoaiBT[] = $state(data.loaiBTs);

  const columns = [
    { header: "ID", accessor: "BackupID", hidden: true },
    { 
      header: "Ngày chỉnh sửa", 
      accessor: "modifiedDate",
      accessFunction: (data : any) => new Date(data.modifiedDate).toLocaleString("vi-VN"), 
    },
    { header: "Cầu thủ", accessor: "tenCT" },
    { header: "Đội", accessor: "tenDoi" },
    { header: "Thời điểm", accessor: "thoiDiem" },
    { header: "Loại bàn thắng", accessor: "tenLBT" },
  ];

  onMount(() => {
    for (let banThang of lichSu) {
      let cauThu: CauThu | null;
      if (banThang.maDoi === doiMot?.maDoi) {
        cauThu =
          cauThuDoiMot.find((val) => val.cauThu.maCT === banThang.maCT)
            ?.cauThu ?? null;
        banThang.tenDoi = doiMot?.tenDoi;
      } else {
        cauThu =
          cauThuDoiHai.find((val) => val.cauThu.maCT === banThang.maCT)
            ?.cauThu ?? null;
        banThang.tenDoi = doiHai?.tenDoi;
      }
      if (cauThu === null) continue;
      banThang.tenCT = cauThu.tenCT;
      banThang.tenLBT = loaiBTs.find((val) => val.maLBT === banThang.maLBT)?.tenLBT ?? "Không xác định";
    }
  });

</script>

<svelte:head>
  <title>Các Mùa giải</title>
</svelte:head>

<Table
  title="Các lần chỉnh sửa cũ của mùa giải"
  {columns}
  data={lichSu}
  redirectParam={""}
  tableType=""
  showTeamLogo={false}
/>
