<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import type { FormField, FormInputMap } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import Table from "$lib/components/Table.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { User, UserRole } from "$lib/typesAuth";
  import { SvelteMap } from "svelte/reactivity";

  let { roles = $bindable() }: { roles: UserRole[] } = $props();

  let editData: FormInputMap = $state(new SvelteMap());
  let formState = $state(false);
  let selectedIndex = $state(-1);

  const columnsRoles = [
    { header: "ID", accessor: "roleId", hidden: true },
    { header: "Name", accessor: "roleName" },
    { header: "Viewable Page", accessor: "viewablePage" },
    {
      header: "Có thể chính sửa",
      accessor: "canEdit",
      accessFunction: (data: UserRole) => (data.canEdit ? "Có" : "Không"),
    },
  ];
  const roleFields: FormField[] = [
    {
      label: "Name",
      propertyName: "roleName",
      type: "input",
      valueType: "string",
    },
    {
      label: "Viewable Page",
      propertyName: "viewablePage",
      type: "input",
      valueType: "string",
    },
    {
      label: "Có thể chính sửa",
      propertyName: "canEdit",
      type: "select",
      valueType: "number",
      options: [
        { optionName: "Không", optionValue: 0 },
        { optionName: "Có", optionValue: 1 },
      ],
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

  const onEditClick = async (data: UserRole, index: number) => {
    if (data satisfies UserRole) {
      editData.clear();
      editData.set("roleId", data.roleId);
      editData.set("roleName", data.roleName);
      editData.set("viewablePage", data.viewablePage);
      editData.set("canEdit", Number(data.canEdit));
      // editData.set("isAdmin", Number(data.isAdmin));
      formState = true;
      selectedIndex = index;
    } else {
      console.error("Data không thỏa mãn");
      selectedIndex = -1;
    }
  };

  const submitForm = async (e: Event, data: UserRole) => {
    e.preventDefault();

    if (data.roleName.trim() === "" || data.viewablePage.trim() === "") {
      showErrorToast("roleName/viewablePage không thể trống");
      return;
    }

    try {
      const response = await fetch("api/role", {
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
      if (selectedIndex === -1) roles.push(responseData);
      else roles[selectedIndex] = responseData;

      showOkToast("Cập nhật thành công");
      formState = false;
    } catch (err) {
      if (err instanceof Error) showErrorToast(err.message);
    }
  };

  const onDeleteClick = async (data: UserRole, index: number) => {
    try {
      const response = await fetch(`/api/role?roleId=${data.roleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Lỗi xóa user role" }));
        throw new Error(errorData.message || "Lỗi xóa user role");
      }

      roles.splice(index, 1);

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Xóa UserRole thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };
</script>

<Table
  title="Roles"
  columns={columnsRoles}
  data={roles}
  redirectParam={""}
  tableType=""
  {onEditClick}
  {onDeleteClick}
/>

<div class="flex mb-8 mt-4 justify-center">
  <ButtonPrimary text="Tạo vai trò mới" onclick={() => (formState = true)} />
</div>

<Form
  fields={roleFields}
  bind:formState
  {submitForm}
  {onOpenForm}
  {onCloseForm}
/>
