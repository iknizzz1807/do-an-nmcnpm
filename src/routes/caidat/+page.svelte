<script lang="ts">
  import type { Settings, User, UserRole } from "$lib/typesAuth";
  import type { PageProps } from "./$types";
  import type { UserGroupRoles } from "$lib/typesResponse";
  import SettingRoleTable from "./Tables/SettingRoleTable.svelte";
  import UserGroupTab from "./Tabs/UserGroupTab.svelte";
  import SystemSettingsTab from "./Tabs/SystemSettingsTab.svelte";
  import SettingSanNhaTable from "./Tables/SettingSanNhaTable.svelte";
  import SettingLoaiCTTable from "./Tables/SettingLoaiCTTable.svelte";
  import SettingViTriTable from "./Tables/SettingViTriTable.svelte";
  import SettingLoaiBTTable from "./Tables/SettingLoaiBTTable.svelte";
  import SettingVongTDTable from "./Tables/SettingVongTDTable.svelte";
  import SettingDiemSoTable from "./Tables/SettingDiemSoTable.svelte";

  const { data }: PageProps = $props();

  let users: User[] = $state(data.users);
  let userGroup: UserGroupRoles[] = $state(data.userGroup);
  let roles: UserRole[] = $state(data.userRoles);

  // --- Tab Management ---
  type SettingsTab = {
    id: string;
    name: string;
  };
  const tabs: SettingsTab[] = [
    { id: "systemSettings", name: "System Settings" },
    { id: "usersAndGroups", name: "Users & Groups" },
    { id: "roles", name: "Roles" },

    { id: "sanNha", name: "Sân nhà" },
    { id: "loaiCT", name: "Loại cầu thủ" },
    { id: "loaiBT", name: "Loại Bàn thắng" },
    { id: "viTri", name: "Vị trí" },
    { id: "vongTD", name: "Vòng thi đấu" },
    { id: "diemSo", name: "Điểm số" },
  ];
  let activeSettingsTab: SettingsTab = $state(tabs[0]);
  // --- End Tab Management ---
</script>

<div class="page-content">
  <h1 class="content-title text-3xl font-bold text-gray-800 mb-2">Cài Đặt</h1>
  <div class="title-underline w-24 h-1 bg-green-600 mb-8"></div>

  <!-- Tab Navigation -->
  <div class="mb-6 border-b border-gray-300">
    <nav class="-mb-px flex space-x-6 overflow-x-auto pb-px" aria-label="Tabs">
      {#each tabs as tab}
        <button
          class="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150
            {activeSettingsTab.id === tab.id
            ? 'border-green-600 text-green-700'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-400'}"
          onclick={() => (activeSettingsTab = tab)}
        >
          {tab.name}
        </button>
      {/each}
    </nav>
  </div>

  <!-- Tab Content -->
  <div class="mt-6">
    {#if activeSettingsTab.id === "usersAndGroups"}
      <UserGroupTab bind:users bind:roles bind:userGroup />
    {:else if activeSettingsTab.id === "roles"}
      <SettingRoleTable bind:roles />
    {:else if activeSettingsTab.id === "systemSettings"}
      <SystemSettingsTab setting={data.setting} />
    {:else if activeSettingsTab.id === "sanNha"}
      <SettingSanNhaTable dataSanNha={data.sanNha} />
    {:else if activeSettingsTab.id === "loaiCT"}
      <SettingLoaiCTTable dataLoaiCT={data.loaiCT} />
    {:else if activeSettingsTab.id === "loaiBT"}
      <SettingLoaiBTTable dataLoaiBT={data.loaiBT} />
    {:else if activeSettingsTab.id === "viTri"}
      <SettingViTriTable dataViTri={data.viTri} />
    {:else if activeSettingsTab.id === "vongTD"}
      <SettingVongTDTable dataVongTD={data.vongTD} />
    {:else if activeSettingsTab.id === "diemSo"}
      <SettingDiemSoTable dataDiemSo={data.diemSo} />
    {/if}
  </div>
</div>
