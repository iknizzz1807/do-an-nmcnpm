<script module lang="ts">
  // ... (Type definitions remain the same) ...
  export type TableColumnSpecifier = {
    header: string;
    accessor: string;
    hidden?: boolean | undefined;
    accessFunction?: ((data: any) => string) | undefined;
  };

  export type TableProps = {
    customRender?: Snippet<[any, any]>;
    title: string;
    columns: TableColumnSpecifier[];
    data: any[];
    tableType: string;
    redirectParam: string;
    isEditable?: boolean;
    onItemClick?: ((data: any, index: number) => void) | undefined;
    onDeleteClick?: ((data: any, index: number) => void) | undefined;
    onEditClick?: ((data: any, index: number) => void) | undefined;
    onAddClick?: ((data: any, index: number) => void) | undefined;
  };
</script>

<script lang="ts">
  // ... (Imports and state remain the same) ...
  import { goto } from "$app/navigation";
  import { isNumber } from "$lib";
  import type { Snippet } from "svelte";

  let mouseHover = $state(false);
  let {
    customRender,
    title,
    columns,
    data,
    redirectParam,
    tableType,
    isEditable = true,
    onItemClick,
    onDeleteClick,
    onEditClick,
    onAddClick,
  }: TableProps = $props();
  const deleteButton = $state((onDeleteClick ?? null) !== null);
  const editButton = $state((onEditClick ?? null) !== null);
  const addButton = $state((onAddClick ?? null) !== null);
</script>

<main class="flex justify-center items-start w-full">
  <div
    id="table-container"
    class="bg-white rounded-lg shadow-lg p-6 mb-8 w-full border border-gray-200"
  >
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">{title}</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            {#each columns as column}
              {#if !column.hidden}
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              {/if}
            {/each}
            {#if (deleteButton || editButton || addButton) && isEditable}
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Hành động
              </th>
            {/if}
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each data as row, index}
            <tr
              onclick={() => {
                // ... (onclick logic remains the same) ...
                if (
                  mouseHover ||
                  (onItemClick === null && redirectParam === "")
                )
                  return;
                if ((onItemClick ?? null) !== null) {
                  onItemClick!!(row, index);
                } else {
                  if (redirectParam === "") return;
                  let redirect = "";
                  // @ts-ignore
                  if (isNumber(row[redirectParam]))
                    // @ts-ignore
                    redirect = String(row[redirectParam]).trim().toLowerCase();
                  // @ts-ignore
                  else redirect = row[redirectParam].trim().toLowerCase();
                  console.log(`/${tableType}/` + redirect);
                  goto(`/${tableType}/` + redirect);
                }
              }}
              class:cursor-pointer={onItemClick !== null ||
                redirectParam !== ""}
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              {#each columns as column (column.accessor)}
                {#if !column.hidden}
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {#if customRender}
                      {@render customRender(row, column)}
                    {:else if (column.accessFunction ?? null) !== null}
                      {column.accessFunction!!(row)}
                    {:else if !column.hidden}
                      {row[column.accessor]}
                    {/if}
                  </td>
                {/if}
              {/each}

              {#if (deleteButton || editButton || addButton) && isEditable}
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  {#if addButton}
                    <button
                      class="text-blue-600 hover:text-blue-800 font-medium"
                      onclick={(e: Event) => {
                        e.stopPropagation();
                        if ((onAddClick ?? null) !== null)
                          onAddClick!!(row, index);
                      }}
                      onmouseenter={() => (mouseHover = true)}
                      onmouseleave={() => (mouseHover = false)}
                    >
                      Thêm
                    </button>
                  {/if}
                  {#if editButton}
                    <button
                      class="text-green-600 hover:text-green-800 font-medium"
                      onclick={(e: Event) => {
                        e.stopPropagation();
                        if ((onEditClick ?? null) !== null)
                          onEditClick!!(row, index);
                      }}
                      onmouseenter={() => (mouseHover = true)}
                      onmouseleave={() => (mouseHover = false)}
                    >
                      Sửa
                    </button>
                  {/if}
                  {#if deleteButton}
                    <button
                      class="text-red-600 hover:text-red-800 font-medium"
                      onclick={(e: Event) => {
                        e.stopPropagation();
                        if ((onDeleteClick ?? null) !== null)
                          onDeleteClick!!(row, index);
                      }}
                      onmouseenter={() => (mouseHover = true)}
                      onmouseleave={() => (mouseHover = false)}
                    >
                      Xóa
                    </button>
                  {/if}
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</main>
