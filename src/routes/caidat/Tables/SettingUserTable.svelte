<script lang="ts">
  import type { FormField, FormInputMap } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import Table, {
    type TableColumnSpecifier,
  } from "$lib/components/Table.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { User, UserRole } from "$lib/typesAuth";
  import type { UserGroupRoles } from "$lib/typesResponse";
  import { SvelteMap } from "svelte/reactivity";

  let {
    dataUser,
    groups = $bindable(),
  }: { dataUser: User[]; groups: UserGroupRoles[] } = $props();

  let users: User[] = $state(dataUser);
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
      options: groups.map((value) => ({
        optionName: value.groupName,
        optionValue: value.groupId,
      })),
    },
    {
      label: "Password",
      propertyName: "editedPassword",
      type: "input",
      valueType: "string",
    },
  ];
  const columnsUser: TableColumnSpecifier[] = [
    { header: "ID", accessor: "id", hidden: true },
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    {
      header: "User Group",
      accessor: "groupId",
      accessFunction: (data: User) =>
        groups.find((value) => data.groupId == value.groupId)?.groupName ?? "",
    },
  ];
  const onOpenForm = (): FormInputMap | null => {
    if (editData.size > -1) return editData;
    return new SvelteMap();
  };

  const onCloseForm = () => {
    editData.clear();
    selectedIndex = -1;
    formState = false;
  };

  const onEditClick = async (data: User, index: number) => {
    if (data satisfies User) {
      editData.clear();
      editData.set("id", data.id);
      editData.set("username", data.username);
      editData.set("email", data.email);
      editData.set("groupId", data.groupId);
      if (data.editedPassword ?? null)
        editData.set("editedPassword", data.editedPassword!!);
      // editData.set("isAdmin", Number(data.isAdmin));
      formState = true;
      selectedIndex = index;
    } else {
      console.error("Data không thỏa mãn");
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
      if (selectedIndex === -1) users.push(responseData);
      else users[selectedIndex] = responseData;

      showOkToast("Cập nhật thành công");
      formState = false;
    } catch (err) {
      if (err instanceof Error) showErrorToast(err.message);
    }
  };

  const onDeleteClick = async (data: User, index: number) => {
    try {
      const response = await fetch(`/api/user?userId=${data.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Lỗi xóa user" }));
        throw new Error(errorData.message || "Lỗi xóa user");
      }

      users.splice(index, 1);

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Xóa User thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };
</script>

<Table
  title="Thông tin người dùng"
  columns={columnsUser}
  data={users}
  redirectParam={""}
  tableType=""
  {onEditClick}
  {onDeleteClick}
/>

<Form
  fields={userFields}
  bind:formState
  {submitForm}
  {onOpenForm}
  {onCloseForm}
/>
