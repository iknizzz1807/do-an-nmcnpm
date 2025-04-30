<script lang="ts">
  import type { FormField, FormInputMap } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import Table, { type TableColumnSpecifier } from "$lib/components/Table.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { User, UserRole } from "$lib/typesAuth";
  import type { UserGroupRoles } from "$lib/typesResponse";
  import { SvelteMap } from "svelte/reactivity";

  let { users, groups = $bindable() } : { users: User[], groups: UserGroupRoles[] } = $props();

  let editData: FormInputMap = $state(new SvelteMap());
  let formState = $state(false);
  let selectedIndex = $state(-1);
  
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
      propertyName: "groupId",
      type: "select",
      valueType: "number",
      options: groups.map(value => ({ optionName: value.groupName, optionValue: value.groupId }))
    },
  ];
  const columnsUser : TableColumnSpecifier[] = [
    { header: "ID", accessor: "id", hidden: true },
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "User Group", accessor: "groupId", 
      accessFunction: (data: User) => groups.find(value => data.groupId == value.groupId)?.groupName ?? "" },
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
      editData.set("groupId", data.groupId);
      // editData.set("isAdmin", Number(data.isAdmin));
      formState = true;
      selectedIndex = index;
    } else {
      console.error("Data không thỏa mãn User");
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

</script>


<Table
title="User Profiles"
columns={columnsUser}
data={users}
redirectParam={""}
tableType=""
{onEditClick}
/>

<Form
  fields={userFields}
  bind:formState
  {submitForm}
  {onOpenForm}
  {onCloseForm}
/>