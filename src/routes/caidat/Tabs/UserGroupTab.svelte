<script lang="ts">
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { User, UserRole } from "$lib/typesAuth";
  import type { UserGroupRoles } from "$lib/typesResponse";
  import { onMount } from "svelte";
  import type { PageProps } from "../$types";
  import SettingMainSection from "../SettingMainSection.svelte";
  import SettingSection from "../SettingSection.svelte";
  import SettingUserTable from "../Tables/SettingUserTable.svelte";

  let { userGroup = $bindable(),  roles = $bindable(), users = $bindable() } : 
    { 
      userGroup : UserGroupRoles[],
      roles : UserRole[],
      users: User[]
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
      filteredrolesForDropdown = roles.filter( ( role : UserRole ) =>
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
        userGroups = userGroups.filter((group : UserGroupRoles) => group.groupId !== groupId);
        showOkToast("User group deleted successfully");
      } catch (err) {
        showErrorToast(String(err));
      }
    }
  }
</script>

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
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
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
                          (r : UserRole) => r.roleId === roleId
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