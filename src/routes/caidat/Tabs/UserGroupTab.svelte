<script lang="ts">
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { User, UserRole } from "$lib/typesAuth";
  import type { UserGroupRoles } from "$lib/typesResponse";
  import { onMount } from "svelte";
  import type { PageProps } from "../$types";
  import SettingMainSection from "../SettingMainSection.svelte";
  import SettingSection from "../SettingSection.svelte";
  import SettingUserTable from "../Tables/SettingUserTable.svelte";

  let {
    userGroup = $bindable(),
    roles = $bindable(),
    users = $bindable(),
  }: {
    userGroup: UserGroupRoles[];
    roles: UserRole[];
    users: User[];
  } = $props();

  onMount(() => {
    document.addEventListener("click", closeRolesDropdown);
    return () => {
      document.removeEventListener("click", closeRolesDropdown);
    };
  });

  // For roles dropdown (used in User Group Management)
  let showRolesDropdown = $state(false);
  let rolesSearchQuery = $state("");

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
  let userGroups = $state(userGroup);

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
        (role: UserRole) =>
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
          (group: UserGroupRoles) => group.groupId === editingGroupId
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
        userGroups = userGroups.filter(
          (group: UserGroupRoles) => group.groupId !== groupId
        );
        showOkToast("User group deleted successfully");
      } catch (err) {
        showErrorToast(String(err));
      }
    }
  }
</script>

<SettingUserTable dataUser={users} bind:groups={userGroups} />
<div class="mb-4"></div>
<SettingMainSection sectionName="Cài đặt nhóm người dùng">
  <SettingSection sectionName="Tạo hoặc chỉnh sửa nhóm và quyền người dùng">
    <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <!-- Form Header -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-1">
          {editingGroupId !== -1
            ? "Chỉnh sửa nhóm người dùng"
            : "Tạo nhóm người dùng"}
        </h3>
        <p class="text-sm text-gray-600">
          {editingGroupId !== -1
            ? "Điều chỉnh cài đặt nhóm người dùng có sẵn ở bên dưới."
            : "Định nghĩa nhóm người dùng mới với quyền và vai trò riêng"}
        </p>
      </div>

      <!-- Group Name Input -->
      <div class="mb-6">
        <label
          class="block text-sm font-medium text-gray-700 mb-2"
          for="groupName"
        >
          Tên nhóm người dùng <span class="text-red-500">*</span>
        </label>
        <input
          id="groupName"
          type="text"
          class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200"
          placeholder="Tên nhóm người dùng (e.g. Team Manager, League Admin)"
          bind:value={groupName}
        />
        {#if groupName.trim()}
          <p class="mt-1 text-sm text-green-600">
            ✓ Tên nhóm người dùng hợp lệ
          </p>
        {/if}
      </div>

      <!-- Role Assignment Section -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <label class="text-sm font-medium text-gray-700">
            Đã gán <span class="text-red-500">*</span>
          </label>
          {#if selectedroles.length > 0}
            <span class="text-sm text-green-600 font-medium">
              {selectedroles.length} vai trò{selectedroles.length === 1
                ? ""
                : "s"}
              đã chọn
            </span>
          {/if}
        </div>

        <!-- Custom Dropdown -->
        <div class="relative roles-dropdown">
          <button
            type="button"
            class="flex justify-between items-center w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
            onclick={toggleRolesDropdown}
          >
            <div class="flex items-center">
              <svg
                class="w-5 h-5 text-gray-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <span class="text-gray-700">
                {#if selectedroles.length === 0}
                  Chọn những vai trò cho nhóm này
                {:else}
                  {selectedroles.length} role{selectedroles.length === 1
                    ? ""
                    : "s"} đã chọn
                {/if}
              </span>
            </div>
            <svg
              class="w-5 h-5 text-gray-400 transition-transform duration-200 {showRolesDropdown
                ? 'rotate-180'
                : ''}"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          {#if showRolesDropdown}
            <div
              class="absolute z-20 mt-2 w-full bg-white shadow-xl rounded-lg border border-gray-200 max-h-64 overflow-hidden"
            >
              <!-- Search Input -->
              <div class="p-3 bg-gray-50 border-b border-gray-200">
                <div class="relative">
                  <svg
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Tìm kiếm vai trò..."
                    bind:value={rolesSearchQuery}
                    onclick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              <!-- Roles List -->
              <div class="max-h-48 overflow-y-auto">
                {#each filteredrolesForDropdown as roleItem (roleItem.roleId)}
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="flex items-start px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                    onclick={() => toggleRoles(roleItem.roleId)}
                  >
                    <input
                      id={`perm_${roleItem.roleId}`}
                      type="checkbox"
                      class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded pointer-events-none mt-0.5"
                      checked={selectedroles.includes(roleItem.roleId)}
                      tabindex="-1"
                    />
                    <div class="ml-3 flex-1">
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-900"
                          >{roleItem.roleName}</span
                        >
                        {#if roleItem.canEdit}
                          <span
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            Can Edit
                          </span>
                        {/if}
                      </div>
                      <p class="text-xs text-gray-500 mt-0.5">
                        {roleItem.viewablePage}
                      </p>
                    </div>
                  </div>
                {:else}
                  <div class="px-4 py-8 text-center">
                    <svg
                      class="mx-auto h-12 w-12 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1"
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20c-2.21 0-4.21-.895-5.657-2.343L3.515 20.485"
                      />
                    </svg>
                    <p class="mt-2 text-sm text-gray-500">No roles found</p>
                    <p class="text-xs text-gray-400">
                      Try adjusting your search terms
                    </p>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <!-- Selected Roles Preview -->
        {#if selectedroles.length > 0}
          <div class="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-sm font-medium text-blue-800 mb-2">
              Selected Roles:
            </p>
            <div class="flex flex-wrap gap-2">
              {#each selectedroles as roleId}
                {@const roleDetails = roles.find((r) => r.roleId === roleId)}
                {#if roleDetails}
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {roleDetails.roleName}
                    <button
                      type="button"
                      class="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-blue-200 transition-colors"
                      onclick={() => toggleRoles(roleId)}
                    >
                      <svg
                        class="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                {/if}
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          class="px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
          onclick={resetForm}
        >
          <div class="flex items-center">
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {editingGroupId !== -1 ? "Huỷ chỉnh sửa" : "Làm mới bảng"}
          </div>
        </button>
        <button
          type="button"
          class="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onclick={saveUserGroup}
          disabled={!groupName.trim() || selectedroles.length === 0}
        >
          <div class="flex items-center">
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {editingGroupId !== -1 ? "Cập nhật nhóm" : "Tạo nhóm"}
          </div>
        </button>
      </div>
    </div>
  </SettingSection>

  <SettingSection sectionName="Những nhóm người dùng sẵn có">
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
                      {group.roles.length} vai trò{group.roles.length === 1
                        ? ""
                        : "s"} được gán
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
                            class=" h-6 w-6 rounded-full ring-2 ring-white bg-gray-200 text-gray-700 flex items-center justify-center text-xs"
                          >
                            {roleDetails.roleName.substring(0, 1)}
                          </span>
                        {/if}
                      {/each}
                      {#if group.roles.length > 5}
                        <span
                          class="h-6 w-6 rounded-full ring-2 ring-white bg-gray-300 text-gray-800 flex items-center justify-center text-xs"
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
                    Chỉnh
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-2 text-sm font-medium leading-4 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    onclick={() => deleteUserGroup(group.groupId)}
                  >
                    Xoá
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
