<script lang="ts">
  import SettingNumberInput from "./SettingNumberInput.svelte";
  import type { Settings, User, UserRole } from "$lib/typesAuth";
  import type { PageProps } from "./$types";
  import SettingSection from "./SettingSection.svelte";
  import SettingMainSection from "./SettingMainSection.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  // Table component is not directly used in this file anymore for main layout, but kept for potential future use or if sub-components use it.
  // import Table from "$lib/components/Table.svelte";
  // Form component is not directly used in this file anymore for main layout, but kept.
  // import Form, {
  //   type FormField,
  //   type FormInputMap,
  // } from "$lib/components/Form.svelte";
  // import { SvelteMap } from "svelte/reactivity"; // Not used
  import { onMount } from "svelte";
  import type { UserGroupRoles } from "$lib/typesResponse";
  import SettingUserTable from "./SettingUserTable.svelte";
  import SettingRoleTable from "./SettingRoleTable.svelte";

  const { data }: PageProps = $props();
  let setting: Settings = $state(data.setting);
  let users: User[] = $state(data.users);

  // --- Tab Management ---
  type SettingsTab = "usersAndGroups" | "roles" | "systemSettings";
  let activeSettingsTab: SettingsTab = $state("usersAndGroups");
  // --- End Tab Management ---

  onMount(() => {
    document.addEventListener("click", closeRolesDropdown);
    return () => {
      document.removeEventListener("click", closeRolesDropdown);
    };
  });

  const onSettingSubmit = async (e: Event) => {
    e.preventDefault();

    try {
      const response = await fetch("api/caidat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(setting),
      });

      if (!response.ok) throw new Error("Không thể cập nhật. Có lỗi xảy ra");
      showOkToast("Thành công");
    } catch (err) {
      showErrorToast(String(err));
    }
  };

  // For roles dropdown (used in User Group Management)
  let showRolesDropdown = $state(false);
  let rolesSearchQuery = $state("");
  let roles = $state(data.userRoles); // This is for the dropdown, SettingRoleTable uses its own prop

  // Toggle roles dropdown
  function toggleRolesDropdown() {
    showRolesDropdown = !showRolesDropdown;
  }

  // Close dropdown when clicking outside
  function closeRolesDropdown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".roles-dropdown")) {
      showRolesDropdown = false;
    }
  }

  // User group management
  let groupName = $state("");
  let selectedroles = $state<number[]>([]);
  let editingGroupId = $state<number>(-1);
  let userGroups = $state(data.userGroup);

  function toggleRoles(rolesId: number) {
    if (selectedroles.includes(rolesId)) {
      selectedroles = selectedroles.filter((id) => id !== rolesId);
    } else {
      selectedroles = [...selectedroles, rolesId];
    }
  }

  let filteredrolesForDropdown = $state(roles); // Renamed to avoid conflict if roles prop is used elsewhere

  $effect(() => {
    if (rolesSearchQuery) {
      filteredrolesForDropdown = roles.filter(
        (
          role // Changed 'roles' to 'role' for clarity
        ) =>
          role.roleName
            .toLowerCase()
            .includes(rolesSearchQuery.toLowerCase()) ||
          role.viewablePage
            .toLowerCase()
            .includes(rolesSearchQuery.toLowerCase())
      );
    } else {
      filteredrolesForDropdown = roles;
    }
  });

  function resetForm() {
    groupName = "";
    selectedroles = [];
    editingGroupId = -1;
    showRolesDropdown = false; // Also close dropdown on reset
  }

  async function saveUserGroup() {
    if (!groupName.trim()) {
      showErrorToast("Group name cannot be empty");
      return;
    }
    if (selectedroles.length === 0) {
      showErrorToast("Please select at least one role"); // Changed 'roles' to 'role'
      return;
    }

    const groupPayload = {
      groupName: groupName,
      roles: selectedroles,
      ...(editingGroupId !== -1 && { groupId: editingGroupId }), // Add groupId if editing
    };

    try {
      const response = await fetch("/api/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupPayload),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Lỗi cập nhật nhóm người dùng" }));
        throw new Error(errorData.message || "Lỗi cập nhật nhóm người dùng");
      }

      const result = await response.json();

      if (editingGroupId !== -1) {
        const index = userGroups.findIndex(
          (group) => group.groupId === editingGroupId
        );
        if (index !== -1) {
          userGroups[index] = {
            ...userGroups[index],
            ...groupPayload,
            groupId: editingGroupId,
          }; // Ensure groupId is preserved
        }
        showOkToast(`User group "${groupName}" updated successfully`);
      } else {
        userGroups = [...userGroups, { ...groupPayload, groupId: result.id }];
        showOkToast(`User group "${groupName}" created successfully`);
      }
    } catch (err) {
      showErrorToast(String(err));
    }
    resetForm();
  }

  async function editUserGroup(group: UserGroupRoles) {
    groupName = group.groupName;
    selectedroles = [...group.roles]; // Ensure new array instance
    editingGroupId = group.groupId;
    showRolesDropdown = false; // Close dropdown if open
  }

  async function deleteUserGroup(groupId: number) {
    if (confirm("Are you sure you want to delete this user group?")) {
      try {
        const response = await fetch(`/api/group?groupId=${groupId}`, {
          // Send groupId as query param for DELETE
          method: "DELETE",
        });
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Lỗi xóa nhóm người dùng" }));
          throw new Error(errorData.message || "Lỗi xóa nhóm người dùng");
        }
        userGroups = userGroups.filter((group) => group.groupId !== groupId);
        showOkToast("User group deleted successfully");
      } catch (err) {
        showErrorToast(String(err));
      }
    }
  }
</script>

<main class="container mx-auto p-4">
  <!-- Tab Navigation -->
  <div class="mb-6 border-b border-gray-200">
    <nav class="-mb-px flex space-x-8" aria-label="Tabs">
      <button
        class="{activeSettingsTab === 'usersAndGroups'
          ? 'border-indigo-500 text-indigo-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
        onclick={() => (activeSettingsTab = "usersAndGroups")}
      >
        Users & Groups
      </button>
      <button
        class="{activeSettingsTab === 'roles'
          ? 'border-indigo-500 text-indigo-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
        onclick={() => (activeSettingsTab = "roles")}
      >
        Roles
      </button>
      <button
        class="{activeSettingsTab === 'systemSettings'
          ? 'border-indigo-500 text-indigo-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
        onclick={() => (activeSettingsTab = "systemSettings")}
      >
        System Settings
      </button>
    </nav>
  </div>

  <!-- Tab Content -->
  {#if activeSettingsTab === "usersAndGroups"}
    <SettingUserTable {users} bind:groups={userGroups} />

    <SettingMainSection sectionName="User Group Management">
      <SettingSection sectionName="Create or Edit User Group">
        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 mb-2"
            for="groupName"
          >
            User Group Name
          </label>
          <input
            id="groupName"
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Enter group name (e.g. Team Manager, League Admin)"
            bind:value={groupName}
          />
        </div>

        <div class="mt-4">
          <h3 class="text-lg font-medium text-gray-700 mb-2">Assign Roles</h3>
          <div class="relative roles-dropdown">
            <button
              type="button"
              class="flex justify-between items-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-left focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              onclick={toggleRolesDropdown}
            >
              <span
                >{selectedroles.length} role{selectedroles.length === 1
                  ? ""
                  : "s"} selected</span
              >
              <svg
                class="w-5 h-5 ml-2 transition-transform duration-200 {showRolesDropdown
                  ? 'rotate-180'
                  : ''}"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>

            {#if showRolesDropdown}
              <div
                class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto border border-gray-200"
              >
                <div class="p-2">
                  <div class="mb-2 px-2">
                    <input
                      type="text"
                      class="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Search roles..."
                      bind:value={rolesSearchQuery}
                      onclick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div class="space-y-1">
                    {#each filteredrolesForDropdown as roleItem (roleItem.roleId)}
                      <div
                        class="flex items-center px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer"
                        onclick={() => toggleRoles(roleItem.roleId)}
                      >
                        <input
                          id={`perm_${roleItem.roleId}`}
                          type="checkbox"
                          class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded pointer-events-none"
                          checked={selectedroles.includes(roleItem.roleId)}
                          tabindex="-1"
                        />
                        <label
                          for={`perm_${roleItem.roleId}`}
                          class="ml-2 flex flex-col cursor-pointer"
                        >
                          <span class="text-sm font-medium text-gray-700"
                            >{roleItem.roleName}</span
                          >
                          <span class="text-xs text-gray-500"
                            >{roleItem.viewablePage}</span
                          >
                          {#if roleItem.canEdit}
                            <span class="text-xs text-green-600">Can Edit</span>
                          {/if}
                        </label>
                      </div>
                    {:else}
                      <p class="px-2 py-2 text-sm text-gray-500">
                        No roles found.
                      </p>
                    {/each}
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onclick={resetForm}
          >
            {editingGroupId !== -1 ? "Cancel Edit" : "Reset"}
          </button>
          <button
            type="button"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onclick={saveUserGroup}
          >
            {editingGroupId !== -1 ? "Update Group" : "Save User Group"}
          </button>
        </div>
      </SettingSection>

      <SettingSection sectionName="Existing User Groups">
        {#if userGroups.length > 0}
          <div class="overflow-hidden bg-white shadow sm:rounded-md">
            <ul role="list" class="divide-y divide-gray-200">
              {#each userGroups as group (group.groupId)}
                <li>
                  <div class="flex items-center px-4 py-4 sm:px-6">
                    <div
                      class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between"
                    >
                      <div>
                        <p class="truncate text-sm font-medium text-indigo-600">
                          {group.groupName}
                        </p>
                        <p class="mt-1 flex items-center text-sm text-gray-500">
                          {group.roles.length} role{group.roles.length === 1
                            ? ""
                            : "s"} assigned
                        </p>
                      </div>
                      <div class="mt-2 flex-shrink-0 sm:mt-0 sm:ml-5">
                        <div class="flex -space-x-1 overflow-hidden">
                          {#each group.roles.slice(0, 5) as roleId}
                            {@const roleDetails = roles.find(
                              (r) => r.roleId === roleId
                            )}
                            {#if roleDetails}
                              <span
                                title={roleDetails.roleName}
                                class="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-200 text-gray-700 flex items-center justify-center text-xs"
                              >
                                {roleDetails.roleName.substring(0, 1)}
                              </span>
                            {/if}
                          {/each}
                          {#if group.roles.length > 5}
                            <span
                              class="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-300 text-gray-800 flex items-center justify-center text-xs"
                            >
                              +{group.roles.length - 5}
                            </span>
                          {/if}
                        </div>
                      </div>
                    </div>
                    <div class="ml-4 flex flex-shrink-0 space-x-2">
                      <button
                        type="button"
                        class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onclick={() => editUserGroup(group)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        class="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-2 text-sm font-medium leading-4 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onclick={() => deleteUserGroup(group.groupId)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              {/each}
            </ul>
          </div>
        {:else}
          <p class="text-center text-sm text-gray-500 py-4">
            No user groups created yet.
          </p>
        {/if}
      </SettingSection>
    </SettingMainSection>
  {:else if activeSettingsTab === "roles"}
    <SettingRoleTable bind:roles={data.userRoles} />
  {:else if activeSettingsTab === "systemSettings"}
    <form onsubmit={onSettingSubmit}>
      <SettingMainSection sectionName="System Settings">
        <SettingSection sectionName="Player Settings">
          <SettingNumberInput
            min={16}
            max={40}
            forValue="tuoiMin"
            bind:bindValue={setting.tuoiMin}
            label="Minimum Player Age"
            unit="years"
          />
          <SettingNumberInput
            min={16}
            max={60}
            forValue="tuoiMax"
            bind:bindValue={setting.tuoiMax}
            label="Maximum Player Age"
            unit="years"
          />
        </SettingSection>

        <SettingSection sectionName="Team Settings">
          <SettingNumberInput
            min={11}
            max={30}
            forValue="soCauThuMin"
            bind:bindValue={setting.soCauThuMin}
            label="Minimum Players per Team"
            unit=""
          />
          <SettingNumberInput
            min={15}
            max={40}
            forValue="soCauThuMax"
            bind:bindValue={setting.soCauThuMax}
            label="Maximum Players per Team"
            unit=""
          />
        </SettingSection>

        <SettingSection sectionName="Match Settings">
          <SettingNumberInput
            min={45}
            max={120}
            forValue="thoiDiemGhiBanToiDa"
            bind:bindValue={setting.thoiDiemGhiBanToiDa}
            label="Maximum Time for Goal Scoring"
            unit="minutes"
          />
        </SettingSection>

        <SettingSection sectionName="Point System">
          <SettingNumberInput
            min={1}
            max={10}
            forValue="diemThang"
            bind:bindValue={setting.diemThang}
            label="Points for Win"
            unit=""
          />
          <SettingNumberInput
            min={0}
            max={5}
            forValue="diemHoa"
            bind:bindValue={setting.diemHoa}
            label="Points for Draw"
            unit=""
          />
          <SettingNumberInput
            min={-10}
            max={10}
            forValue="diemThua"
            bind:bindValue={setting.diemThua}
            label="Points for Loss"
            unit=""
          />
          <p class="text-sm text-gray-500 mt-2">
            Note: Points for a win must be greater than points for a draw, which
            must be greater than points for a loss. (Validation handled by
            server)
          </p>
        </SettingSection>

        <!-- Ranking Priority Section (Placeholder for now) -->
        <SettingSection sectionName="Ranking Priority (Tiebreakers)">
          <p class="text-sm text-gray-600 mb-4">
            Define the order of criteria used to rank teams if they have the
            same number of points. Drag to reorder (functionality not yet
            implemented).
          </p>
          <div class="space-y-2">
            <div
              class="flex items-center bg-gray-100 p-3 rounded-md border border-gray-200"
            >
              <span
                class="w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-3 text-xs"
                >1</span
              >
              <span class="text-gray-700 text-sm">Goal Difference</span>
            </div>
            <div
              class="flex items-center bg-gray-100 p-3 rounded-md border border-gray-200"
            >
              <span
                class="w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-3 text-xs"
                >2</span
              >
              <span class="text-gray-700 text-sm">Goals For</span>
            </div>
            <div
              class="flex items-center bg-gray-100 p-3 rounded-md border border-gray-200"
            >
              <span
                class="w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-3 text-xs"
                >3</span
              >
              <span class="text-gray-700 text-sm">Head-to-head Results</span>
            </div>
          </div>
        </SettingSection>
      </SettingMainSection>

      <div class="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          System Preferences
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 mb-1"
              for="defaultLanguage">Default Language</label
            >
            <select
              id="defaultLanguage"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
            >
              <option value="en">English</option>
              <option value="vi">Vietnamese</option>
            </select>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 mb-1"
              for="defaultTimeZone">Default Time Zone</label
            >
            <select
              id="defaultTimeZone"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
            >
              <option value="UTC+0700">Hanoi, Vietnam (UTC+07:00)</option>
              <option value="UTC+0000">London, UK (UTC+00:00)</option>
            </select>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 mb-1"
              for="dataExportFormat">Data Export Format</label
            >
            <select
              id="dataExportFormat"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
            >
              <option value="csv">CSV</option>
              <option value="xlsx">Excel (XLSX)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >System Notifications</label
            >
            <div class="space-y-2">
              <div class="flex items-center">
                <input
                  id="email_notifications"
                  type="checkbox"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  checked
                />
                <label
                  for="email_notifications"
                  class="ml-2 block text-sm text-gray-700"
                  >Email Notifications</label
                >
              </div>
              <div class="flex items-center">
                <input
                  id="browser_notifications"
                  type="checkbox"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  for="browser_notifications"
                  class="ml-2 block text-sm text-gray-700"
                  >Browser Notifications</label
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          class="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Save System Settings
        </button>
      </div>
    </form>
  {/if}
</main>
