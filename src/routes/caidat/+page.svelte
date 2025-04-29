<script lang="ts">
  import SettingNumberInput from "./SettingNumberInput.svelte";
  import type { Settings, User } from "$lib/typesAuth";
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

  const { data }: PageProps = $props();
  let setting: Settings = $state(data.setting);
  let users: User[] = $state(data.users);
  let editData: FormInputMap = $state(new SvelteMap());

  let formState = $state(false);
  let selectedIndex = $state(-1);

  onMount(() => {
    document.addEventListener("click", closePermissionDropdown);
    return () => {
      document.removeEventListener("click", closePermissionDropdown);
    };
  });

  const userFields: FormField[] = [
    {
      label: "Username",
      propertyName: "username",
      type: "input",
      valueType: "string",
    },
    {
      label: "Email",
      propertyName: "email",
      type: "input",
      valueType: "string",
    },
    {
      label: "User Type",
      propertyName: "isAdmin",
      type: "select",
      valueType: "number",
      options: [
        { optionName: "User", optionValue: 0 },
        { optionName: "Admin", optionValue: 1 },
      ],
    },
  ];

  const columnsUser = [
    { header: "ID", accessor: "id", hidden: true },
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    // { header: "User Type", accessor: "isAdmin", accessFunction: (data: User) => data.isAdmin ? "Admin" : "User" },
  ];

  const onOpenForm = (): FormInputMap | null => {
    if (editData.size > -1) return editData;
    return new SvelteMap();
  };

  const onCloseForm = () => {
    editData.clear();
    formState = false;
  };

  const onEditClick = async (data: User, index: number) => {
    if (data satisfies User) {
      editData.clear();
      editData.set("id", data.id);
      editData.set("username", data.username);
      editData.set("email", data.email);
      // editData.set("isAdmin", Number(data.isAdmin));
      formState = true;
      selectedIndex = index;
    } else {
      console.error("Data không thỏa mãn LichThiDau");
      selectedIndex = -1;
    }
  };

  const submitForm = async (e: Event, data: User) => {
    e.preventDefault();

    if (data.username.trim() === "" || data.email.trim() === "") {
      showErrorToast("Username/Email không thể trống");
      return;
    }

    try {
      const response = await fetch("api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status !== 500) throw new Error(error.message);
        throw new Error("Không thể update");
      }

      const responseData = await response.json();

      console.log(responseData);
      users[selectedIndex] = responseData;

      showOkToast("Cập nhật thành công");
      formState = false;
    } catch (err) {
      if (err instanceof Error) showErrorToast(err.message);
    }
  };

  const onSubmit = async (e: Event) => {
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

  // For permission dropdown
  let showPermissionDropdown = $state(false);
  let permissionSearchQuery = $state("");

  // Toggle permission dropdown
  function togglePermissionDropdown() {
    showPermissionDropdown = !showPermissionDropdown;
  }

  // Close dropdown when clicking outside
  function closePermissionDropdown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".permission-dropdown")) {
      showPermissionDropdown = false;
    }
  }

  // Mock data for user group management
  let groupName = $state("");
  let selectedPermissions = $state<string[]>([]);
  let editingGroupId = $state<string | null>(null);

  // Mock permissions data
  const permissions = [
    {
      id: "team_view",
      name: "View Teams",
      description: "Can view team information and roster",
    },
    {
      id: "team_create",
      name: "Create Teams",
      description: "Can create new teams in the system",
    },
    {
      id: "team_edit",
      name: "Edit Teams",
      description: "Can modify existing team information",
    },
    {
      id: "team_delete",
      name: "Delete Teams",
      description: "Can remove teams from the system",
    },
    {
      id: "player_view",
      name: "View Players",
      description: "Can view player information and statistics",
    },
    {
      id: "player_create",
      name: "Create Players",
      description: "Can add new players to the system",
    },
    {
      id: "player_edit",
      name: "Edit Players",
      description: "Can modify existing player information",
    },
    {
      id: "player_delete",
      name: "Delete Players",
      description: "Can remove players from the system",
    },
    {
      id: "match_view",
      name: "View Matches",
      description: "Can view match schedules and results",
    },
    {
      id: "match_create",
      name: "Schedule Matches",
      description: "Can create and schedule new matches",
    },
    {
      id: "match_edit",
      name: "Edit Matches",
      description: "Can modify match details and time",
    },
    {
      id: "match_result",
      name: "Record Results",
      description: "Can record and update match results and statistics",
    },
    {
      id: "settings_view",
      name: "View Settings",
      description: "Can view system settings",
    },
    {
      id: "settings_edit",
      name: "Edit Settings",
      description: "Can modify system settings",
    },
    {
      id: "user_manage",
      name: "Manage Users",
      description: "Can create, edit, and delete user accounts",
    },
  ];

  // Mock user groups
  let userGroups = $state([
    {
      id: "1",
      name: "Quản lý sân bóng",
      permissions: ["match_view", "match_create", "match_edit", "match_result"],
    },
    {
      id: "2",
      name: "Quản lý đội bóng",
      permissions: [
        "team_view",
        "team_edit",
        "player_view",
        "player_create",
        "player_edit",
      ],
    },
    {
      id: "3",
      name: "Admin hệ thống",
      permissions: [
        "team_view",
        "team_create",
        "team_edit",
        "team_delete",
        "player_view",
        "player_create",
        "player_edit",
        "player_delete",
        "match_view",
        "match_create",
        "match_edit",
        "match_result",
        "settings_view",
        "settings_edit",
        "user_manage",
      ],
    },
  ]);

  // Toggle a permission selection
  function togglePermission(permissionId: string) {
    if (selectedPermissions.includes(permissionId)) {
      selectedPermissions = selectedPermissions.filter(
        (id) => id !== permissionId
      );
    } else {
      selectedPermissions = [...selectedPermissions, permissionId];
    }
  }

  let filteredPermissions = $state(permissions);

  $effect(() => {
    if (permissionSearchQuery) {
      filteredPermissions = permissions.filter(
        (permission) =>
          permission.name
            .toLowerCase()
            .includes(permissionSearchQuery.toLowerCase()) ||
          permission.description
            .toLowerCase()
            .includes(permissionSearchQuery.toLowerCase())
      );
    } else {
      filteredPermissions = permissions;
    }
  });

  // Reset the form
  function resetForm() {
    groupName = "";
    selectedPermissions = [];
    editingGroupId = null;
  }

  // Save the user group
  function saveUserGroup() {
    if (!groupName.trim()) {
      showErrorToast("Group name cannot be empty");
      return;
    }

    if (selectedPermissions.length === 0) {
      showErrorToast("Please select at least one permission");
      return;
    }

    if (editingGroupId) {
      // Update existing group
      const index = userGroups.findIndex(
        (group) => group.id === editingGroupId
      );
      if (index !== -1) {
        userGroups[index] = {
          ...userGroups[index],
          name: groupName,
          permissions: selectedPermissions,
        };
      }
      showOkToast(`User group "${groupName}" updated successfully`);
    } else {
      // Create new group
      const newId = (userGroups.length + 1).toString();
      userGroups = [
        ...userGroups,
        {
          id: newId,
          name: groupName,
          permissions: selectedPermissions,
        },
      ];
      showOkToast(`User group "${groupName}" created successfully`);
    }

    // Reset form after saving
    resetForm();
  }

  // Edit an existing user group
  function editUserGroup(group: {
    id: string;
    name: string;
    permissions: string[];
  }) {
    groupName = group.name;
    selectedPermissions = [...group.permissions];
    editingGroupId = group.id;
  }

  // Delete a user group
  function deleteUserGroup(groupId: string) {
    if (confirm("Are you sure you want to delete this user group?")) {
      userGroups = userGroups.filter((group) => group.id !== groupId);
      showOkToast("User group deleted successfully");
    }
  }
</script>

<Form
  fields={userFields}
  bind:formState
  {submitForm}
  {onOpenForm}
  {onCloseForm}
/>

<main class="max-w-7xl mx-auto py-6 px-4">
  <form onsubmit={onSubmit}>
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
            Assign Permissions
          </h3>
          <div class="relative permission-dropdown">
            <button
              type="button"
              class="flex justify-between items-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-left focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              onclick={() => togglePermissionDropdown()}
            >
              <span>{selectedPermissions.length} permissions selected</span>
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

            {#if showPermissionDropdown}
              <div
                class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto"
              >
                <div class="p-2">
                  <div class="mb-2 px-2">
                    <input
                      type="text"
                      class="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Search permissions..."
                      bind:value={permissionSearchQuery}
                    />
                  </div>
                  <div class="space-y-2">
                    {#each filteredPermissions as permission}
                      <div
                        class="flex items-center px-2 py-1 hover:bg-gray-100 rounded-md"
                      >
                        <input
                          id={`perm_${permission.id}`}
                          type="checkbox"
                          class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          checked={selectedPermissions.includes(permission.id)}
                          onchange={() => togglePermission(permission.id)}
                        />
                        <label
                          for={`perm_${permission.id}`}
                          class="ml-2 flex flex-col cursor-pointer"
                        >
                          <span class="text-sm font-medium text-gray-700"
                            >{permission.name}</span
                          >
                          <span class="text-xs text-gray-500"
                            >{permission.description}</span
                          >
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
                      {group.name}
                    </p>
                    <p class="mt-1 truncate text-sm text-gray-500">
                      {group.permissions.length} permissions assigned
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
                      onclick={() => deleteUserGroup(group.id)}
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

    <Table
      title="User Profiles"
      columns={columnsUser}
      data={users}
      redirectParam={""}
      tableType=""
      {onEditClick}
    />

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
