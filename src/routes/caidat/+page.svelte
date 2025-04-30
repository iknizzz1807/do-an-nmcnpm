<script lang="ts">
  import SettingNumberInput from "./SettingNumberInput.svelte";
  import type { Settings, User, UserRole } from "$lib/typesAuth";
  import type { PageProps } from "./$types";
  import SettingSection from "./SettingSection.svelte";
  import SettingMainSection from "./SettingMainSection.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import Table from "$lib/components/Table.svelte";
  import Form, {
    type FormField,
    type FormInputMap,
  } from "$lib/components/Form.svelte";
  import { SvelteMap } from "svelte/reactivity";
  import { onMount } from "svelte";
  import type { UserGroupRoles } from "$lib/typesResponse";
  import SettingUserTable from "./SettingUserTable.svelte";
  import SettingRoleTable from "./SettingRoleTable.svelte";

  const { data }: PageProps = $props();
  let setting: Settings = $state(data.setting);
  let users: User[] = $state(data.users);


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


  // For roles dropdown
  let showRolesDropdown = $state(false);
  let rolesSearchQuery = $state("");
  let roles = $state(data.userRoles);


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

  // Mock data for user group management
  let groupName = $state("");
  let selectedroles = $state<number[]>([]);
  let editingGroupId = $state<number>(-1);

  // Mock user groups
  let userGroups = $state(data.userGroup);

  // Toggle a roles selection
  function toggleRoles(rolesId: number) {
    if (selectedroles.includes(rolesId)) {
      selectedroles = selectedroles.filter(
        (id) => id !== rolesId
      );
    } else {
      selectedroles = [...selectedroles, rolesId];
    }
  }

  let filteredroles = $state(roles);

  $effect(() => {
    if (rolesSearchQuery) {
      filteredroles = roles.filter(
        (roles) =>
          roles.roleName
            .toLowerCase()
            .includes(rolesSearchQuery.toLowerCase()) ||
          roles.viewablePage
            .toLowerCase()
            .includes(rolesSearchQuery.toLowerCase()) 
      );
    } else {
      filteredroles = roles;
    }
  });

  // Reset the form
  function resetForm() {
    groupName = "";
    selectedroles = [];
    editingGroupId = -1;
  }

  // Save the user group
  async function saveUserGroup() {
    if (!groupName.trim()) {
      showErrorToast("Group name cannot be empty");
      return;
    }

    if (selectedroles.length === 0) {
      showErrorToast("Please select at least one roles");
      return;
    }

    if (editingGroupId !== -1) {
      // Update existing group
      const index = userGroups.findIndex(
        (group) => group.groupId === editingGroupId
      );
      if (index !== -1) {
        try
        {
          const response = await fetch("/api/group", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              {
                groupId: editingGroupId,
                groupName: groupName,
                roles: selectedroles,
              }
            ),
          });
          
          if (!response.ok)
            throw new Error("Lỗi cập nhật roles");

          userGroups[index] = {
            ...userGroups[index],
            groupName: groupName,
            roles: selectedroles,
          };
          showOkToast(`User group "${groupName}" updated successfully`);
        }
        catch(err)
        {
          showErrorToast(String(err));
        }
      }
    } else {
      // Create new group
      try
      {
        const response = await fetch("/api/group", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              {
                groupName: groupName,
                roles: selectedroles,
              }
            ),
          });
          if (!response.ok)
            throw new Error("Lỗi cập nhật roles");

          const result = await response.json();
          userGroups = [
            ...userGroups,
            {
              groupId: result.id,
              groupName: groupName,
              roles: selectedroles,
            },
          ];

          showOkToast(`User group "${groupName}" created successfully`);

      }
      catch (e)
      {
        showErrorToast(String(e));
      }
        
    }

    // Reset form after saving
    resetForm();
  }

  // Edit an existing user group
  async function editUserGroup(group: UserGroupRoles) {
    groupName = group.groupName;
    selectedroles = [...group.roles];
    editingGroupId = group.groupId;
  }

  // Delete a user group
  function deleteUserGroup(groupId: number) {
    if (confirm("Are you sure you want to delete this user group?")) {
      userGroups = userGroups.filter((group) => group.groupId !== groupId);
      showOkToast("User group deleted successfully");
    }
  }
</script>


<main>
  <SettingRoleTable bind:roles={roles}/>
  
  <SettingUserTable users={users} bind:groups={userGroups} />
  
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

        <!-- <SettingNumberInput min={0} max={20} forValue="soCauThuNuocNgoaiToiDa"
          bind:bindValue={setting.soCauThuNuocNgoaiToiDa} label="Maximum Foreign Players per Team" unit=""/> -->
      </SettingSection>

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
          <h3 class="text-lg font-medium text-gray-700 mb-2">
            Assign roles
          </h3>
          <div class="relative roles-dropdown">
            <button
              type="button"
              class="flex justify-between items-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-left focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              onclick={() => toggleRolesDropdown()}
            >
              <span>{selectedroles.length} roles selected</span>
              <svg
                class="w-5 h-5 ml-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
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
                class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto"
              >
                <div class="p-2">
                  <div class="mb-2 px-2">
                    <input
                      type="text"
                      class="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Search roles..."
                      bind:value={rolesSearchQuery}
                    />
                  </div>
                  <div class="space-y-2">
                    {#each filteredroles as roles}
                      <div
                        class="flex items-center px-2 py-1 hover:bg-gray-100 rounded-md"
                      >
                        <input
                          id={`perm_${roles.roleId}`}
                          type="checkbox"
                          class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          checked={selectedroles.includes(roles.roleId)}
                          onchange={() => toggleRoles(roles.roleId)}
                        />
                        <label
                          for={`perm_${roles.roleId}`}
                          class="ml-2 flex flex-col cursor-pointer"
                        >
                          <span class="text-sm font-medium text-gray-700"
                            >{roles.roleName}</span
                          >
                          <span class="text-xs text-gray-500"
                            >{roles.viewablePage}</span
                          >
                          {#if roles.canEdit}
                            <span class="text-xs text-gray-500"
                              >Có thể chỉnh sửa</span
                            >
                          {/if}
                        </label>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>

        <div class="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onclick={resetForm}
          >
            Reset
          </button>
          <button
            type="button"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            onclick={saveUserGroup}
          >
            Save User Group
          </button>
        </div>
      </SettingSection>

      <SettingSection sectionName="Existing User Groups">
        <div class="overflow-hidden bg-white shadow sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            {#each userGroups as group}
              <li>
                <div class="flex items-center px-4 py-4 sm:px-6">
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-gray-900">
                      {group.groupName}
                    </p>
                    <p class="mt-1 truncate text-sm text-gray-500">
                      {group.roles.length} roles assigned
                    </p>
                  </div>
                  <div class="ml-4 flex flex-shrink-0 space-x-2">
                    <button
                      type="button"
                      class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      onclick={() => editUserGroup(group)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
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
      </SettingSection>

      <SettingSection sectionName="Match Settings">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 mb-2"
            for="something">Number of Goal Types</label
          >
          <select
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="1">1 (Standard)</option>
            <option value="2">2 (Standard + Penalty)</option>
            <option value="3">3 (Standard + Penalty + Own Goal)</option>
            <option value="4">
              4 (Standard + Penalty + Own Goal + Free Kick)
            </option>
          </select>
        </div>

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
          must be greater than points for a loss.
        </p>
      </SettingSection>

      <div class="space-y-4">
        <div
          class="flex items-center bg-gray-50 p-4 rounded-md border border-gray-200"
        >
          <span
            class="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center mr-3"
            >1</span
          >
          <span class="text-gray-700">Points</span>
          <div class="ml-auto flex space-x-2">
            <button
              class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
              disabled
            >
              ↑
            </button>
            <button class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
              ↓
            </button>
          </div>
        </div>
        <div
          class="flex items-center bg-gray-50 p-4 rounded-md border border-gray-200"
        >
          <span
            class="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center mr-3"
            >2</span
          >
          <span class="text-gray-700">Goal Difference</span>
          <div class="ml-auto flex space-x-2">
            <button class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
              ↑
            </button>
            <button class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
              ↓
            </button>
          </div>
        </div>
        <div
          class="flex items-center bg-gray-50 p-4 rounded-md border border-gray-200"
        >
          <span
            class="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center mr-3"
            >3</span
          >
          <span class="text-gray-700">Goals For</span>
          <div class="ml-auto flex space-x-2">
            <button class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
              ↑
            </button>
            <button class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
              ↓
            </button>
          </div>
        </div>
        <div
          class="flex items-center bg-gray-50 p-4 rounded-md border border-gray-200"
        >
          <span
            class="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center mr-3"
            >4</span
          >
          <span class="text-gray-700">Head-to-head Results</span>
          <div class="ml-auto flex space-x-2">
            <button class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
              ↑
            </button>
            <button
              class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled
            >
              ↓
            </button>
          </div>
        </div>
      </div>
    </SettingMainSection>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">System Preferences</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 mb-2"
            for="nothing">Default Language</label
          >
          <select
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="en">English</option>
            <option value="vi">Vietnamese</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
          </select>
        </div>
        <div>
          <label
            class="block text-sm font-medium text-gray-700 mb-2"
            for="nothing">Default Time Zone</label
          >
          <select
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="UTC+0700">Hanoi, Vietnam (UTC+07:00)</option>
            <option value="UTC+0000">London, UK (UTC+00:00)</option>
            <option value="UTC-0500">New York, USA (UTC-05:00)</option>
            <option value="UTC+0100">Paris, France (UTC+01:00)</option>
            <option value="UTC+0900">Tokyo, Japan (UTC+09:00)</option>
          </select>
        </div>
        <div>
          <label
            class="block text-sm font-medium text-gray-700 mb-2"
            for="nothing">Data Export Format</label
          >
          <select
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="csv">CSV</option>
            <option value="xlsx">Excel (XLSX)</option>
            <option value="pdf">PDF</option>
            <option value="json">JSON</option>
          </select>
        </div>
        <div>
          <label
            class="block text-sm font-medium text-gray-700 mb-2"
            for="nothing">System Notifications</label
          >
          <div class="space-y-2">
            <div class="flex items-center">
              <input
                id="email_notifications"
                name="email_notifications"
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
                name="browser_notifications"
                type="checkbox"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                checked
              />
              <label
                for="browser_notifications"
                class="ml-2 block text-sm text-gray-700"
                >Browser Notifications</label
              >
            </div>
            <div class="flex items-center">
              <input
                id="sms_notifications"
                name="sms_notifications"
                type="checkbox"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                for="sms_notifications"
                class="ml-2 block text-sm text-gray-700"
                >SMS Notifications</label
              >
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <label
          class="block text-sm font-medium text-gray-700 mb-2"
          for="nothing">Automatic Data Backup</label
        >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-center">
            <input
              id="backup_daily"
              name="backup_frequency"
              type="radio"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              checked
            />
            <label for="backup_daily" class="ml-2 block text-sm text-gray-700"
              >Daily</label
            >
          </div>
          <div class="flex items-center">
            <input
              id="backup_weekly"
              name="backup_frequency"
              type="radio"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <label for="backup_weekly" class="ml-2 block text-sm text-gray-700"
              >Weekly</label
            >
          </div>
          <div class="flex items-center">
            <input
              id="backup_monthly"
              name="backup_frequency"
              type="radio"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <label for="backup_monthly" class="ml-2 block text-sm text-gray-700"
              >Monthly</label
            >
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-end space-x-4">
      <button
        class="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
      >
        Save Changes
      </button>
    </div>
  </form>
</main>
