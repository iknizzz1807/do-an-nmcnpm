<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { DoiBong, SanNha } from "$lib/typesDatabase";
  import Form, {
    type FieldOption,
    type FormField,
    type FormInputMap,
  } from "$lib/components/Form.svelte";
  import { SvelteMap } from "svelte/reactivity";
  let { data }: PageProps = $props();

  let danhSachDoiBong: DoiBong[] = $state(data.danhSachDoiBong);
  let danhSachSanNha: SanNha[] = $state(data.danhSachSanNha);
  const isEditable = $state(data.isEditable);

  for (const doiBong of danhSachDoiBong) {
    const sanNha = danhSachSanNha.find(
      (val) => val.maSan === doiBong.maSan
    );
    doiBong.tenSan = sanNha?.tenSan ?? "";
    doiBong.diaChi = sanNha?.diaChi ?? "";
    doiBong.ketQua5TranGanNhat = doiBong.ketQua5TranGanNhat;
  }

  const sanNhaOption: FieldOption[] = danhSachSanNha.map((val) => ({
    optionValue: val.maSan ?? 0,
    optionName: val.tenSan,
  }));

  const columns = [
    { header: "", accessor: "maDoi", hidden: true },
    { header: "Tên đội", accessor: "tenDoi" },
    { header: "Sân nhà", accessor: "tenSan" },
    {
      header: "5 trận gần nhất",
      accessor: "ketQua5TranGanNhat",
      accessFunction: (data: DoiBong) => {
        return data.ketQua5TranGanNhat?.join(",") || "";
      },
    },
  ];

  const formFields: FormField[] = [
    {
      label: "Tên đội",
      propertyName: "tenDoi",
      type: "input",
      valueType: "string",
    },
    {
      label: "Tên sân nhà",
      propertyName: "tenSan",
      type: "input",
      valueType: "string",
    },
    {
      label: "Địa chỉ sân nhà",
      propertyName: "diaChi",
      type: "input",
      valueType: "string",
    },
    {
      label: "Logo đội bóng",
      propertyName: "imageURL",
      type: "input",
      valueType: "string",
    }
  ];
  let selectedIndex: number = $state(-1);
  let maDoi: number = $state(0);

  let formState: boolean = $state(false);
  let editData: FormInputMap = $state(new SvelteMap());

  const onOpenForm = (): FormInputMap | null => {
    if (editData.size > 0) return editData;
    return new SvelteMap();
  };

  const onCloseForm = () => {
    editData.clear();
    selectedIndex = -1;
    formState = false;
  };
  $inspect(selectedIndex, "selectedIndex");

  const onEditClick = (data: DoiBong, index: number) => {
    if (data satisfies DoiBong) {
      editData.clear();
      editData.set("maDoi", data.maDoi ?? null);
      editData.set("tenDoi", data.tenDoi);
      editData.set("maSan", data.maSan ?? null);
      editData.set("tenSan", data.tenSan!!);
      editData.set("diaChi", data.diaChi!!);
      editData.set("imageURL", data.imageURL ?? "");
      selectedIndex = index;
      formState = true;
    } else {
      console.error("Data không thỏa mãn");
      selectedIndex = -1;
    }
  };

  const onDeleteClick = async (data: any, index: number) => {
    if (data satisfies DoiBong) {
      selectedIndex = index;
      maDoi = data.maDoi;
      await deleteDoiBong();
      selectedIndex = -1;
    } else {
      console.error("Data không thỏa mãn");
    }
  };

  $inspect(selectedIndex, "selectedIndex");
  const addDoiBong = async (e: Event, data: DoiBong) => {
    e.preventDefault();
    if (data.tenDoi.trim() === "") return;

    try {
      console.log("Submitting data:", data);
      const response = await fetch("/api/doibong", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      let result = await response.json();
      // result.tenSan =
      //   danhSachSanNha.find((val) => val.maSan === result.maSan)?.tenSan ?? "";

      // Cập nhật danh sách đội bóng nếu cần thiết
      if (selectedIndex === -1) danhSachDoiBong.push(result);
      else {
        result.imageURL = danhSachDoiBong[selectedIndex].imageURL;
        result.ketQua5TranGanNhat =
          danhSachDoiBong[selectedIndex].ketQua5TranGanNhat;
        danhSachDoiBong[selectedIndex] = result;
      }

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Tạo mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };

  const deleteDoiBong = async () => {
    try {
      const response = await fetch("/api/doibong", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maDoi: maDoi }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      danhSachDoiBong.splice(selectedIndex, 1);

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Xóa thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };
</script>

<svelte:head>
  <title>Các đội bóng</title>
</svelte:head>

{#if isEditable}
  <div class="flex justify-center gap-4">
    <ButtonPrimary text="Tạo đội mới" onclick={() => (formState = true)} />
    <div class="flex justify-center">
      <a
        class="bg-green-600 mb-4 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md cursor-pointer text-base font-semibold transition-all duration-200 transform hover:-translate-y-0.5"
        href={"/doi/lichsu"}
      >
        Lịch sử cập nhật
      </a>
    </div>
  </div>
{/if}

<Table
  title="Danh sách các đội bóng"
  {columns}
  data={danhSachDoiBong}
  redirectParam={"maDoi"}
  tableType="doi"
  {onEditClick}
  {onDeleteClick}
  {isEditable}
  showTeamLogo={true}
>
  {#snippet customRender(row, column)}
    {#if column.accessor === "ketQua5TranGanNhat"}
      <div class="flex gap-1">
        {#each row.ketQua5TranGanNhat || [] as ketQua}
          {#if ketQua === "win"}
            <div
              class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          {:else if ketQua === "lose"}
            <div
              class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          {:else if ketQua === "draw"}
            <div
              class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          {/if}
        {/each}
      </div>
    {:else if column.accessFunction}
      <div
        class="max-w-md overflow-hidden text-ellipsis whitespace-normal break-words"
      >
        {column.accessFunction(row)}
      </div>
    {:else}
      <div
        class="max-w-md overflow-hidden text-ellipsis whitespace-normal break-words"
      >
        {row[column.accessor]}
      </div>
    {/if}
  {/snippet}
</Table>

<Form
  bind:formState
  fields={formFields}
  submitForm={addDoiBong}
  {onCloseForm}
  {onOpenForm}
/>
