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

  const { data }: PageProps = $props();

  let users: User[] = $state(data.users);
  let userGroup : UserGroupRoles[] = $state(data.userGroup);
  let roles : UserRole[] = $state(data.userRoles);

  // --- Tab Management ---
  type SettingsTab = {
    id : string;
    name : string;
  }
  const tabs : SettingsTab[] = [
    { id: "systemSettings", name: "System Settings" }, 
    { id: "usersAndGroups", name: "Users & Groups" }, 
    { id: "roles", name: "Roles" }, 

    { id: "sanNha", name: "Sân nhà" }, 
    { id: "loaiCT", name: "Loại cầu thủ" }, 
    { id: "loaiBT", name: "Loại Bàn thắng" }, 
    { id: "viTri", name: "Vị trí" }, 
    { id: "vongTD", name: "Vòng thi đấu" }, 
  ]
  let activeSettingsTab: SettingsTab = $state(tabs[0]);
  // --- End Tab Management ---

</script>

<main class="container mx-auto p-4">
  <!-- Tab Navigation -->
  <div class="mb-6 border-b border-gray-200">
    <nav class="-mb-px flex space-x-8" aria-label="Tabs">
      {#each tabs as tab}
        <button
          class="{activeSettingsTab.id === tab.id
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          onclick={() => (activeSettingsTab.id = tab.id)}
        >
          {tab.name}
        </button>
      {/each}
      
    </nav>
  </div>

  <!-- Tab Content -->
  {#if activeSettingsTab.id === "usersAndGroups"}
    <UserGroupTab
      bind:users={users}
      bind:roles={roles}
      bind:userGroup={userGroup}
      />
  {:else if activeSettingsTab.id === "roles"}
    <SettingRoleTable bind:roles={roles} />
  {:else if activeSettingsTab.id === "systemSettings"}
    <SystemSettingsTab setting={data.setting}/>
  {:else if activeSettingsTab.id === "sanNha"}
    <SettingSanNhaTable sanNha={data.sanNha}/>
  {:else if activeSettingsTab.id === "loaiCT"}
    <SettingLoaiCTTable loaiCT={data.loaiCT}/>
  {:else if activeSettingsTab.id === "loaiBT"}
    <SettingLoaiBTTable loaiBT={data.loaiBT}/>
  {:else if activeSettingsTab.id === "viTri"}
    <SettingViTriTable viTri={data.viTri}/>
  {:else if activeSettingsTab.id === "vongTD"}
    <SettingVongTDTable vongTD={data.vongTD}/>
  {/if}
</main>
