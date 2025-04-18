<script lang="ts">
  import { goto } from "$app/navigation";
  import { isNumber } from "$lib";
  import ButtonPrimary from "./ButtonPrimary.svelte";

  type TableProps<T> = {
    title: string;
    columns: { // Data specifier
      header: string;
      accessor: keyof T;
      hidden?: boolean | undefined;
      accessFunction?: ((data: T) => string) | undefined;
    }[];
    data: T[]; // Data holder
    tableType: string; // It's like current page. Used to redirect
    redirectParam: string; // Redirect to
    onItemClick?: ((data: T, index : number) => void) | undefined;
    onDeleteClick?: ((data: T, index : number) => void) | undefined;
    onEditClick?: ((data: T, index : number) => void) | undefined;
  };
  let mouseHover = $state(false);
  let { title, columns, data, redirectParam, tableType, onItemClick, onDeleteClick, onEditClick }: TableProps<any> =
    $props();
  const deleteButton = $state((onDeleteClick ?? null) !== null);
  const editButton = $state((onEditClick ?? null) !== null);
</script>

<main class="flex justify-center items-center">
  <div
    id="table-container"
    class="bg-white rounded-lg shadow-md p-6 mb-8 w-full"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            {#each columns as column}
              {#if !column.hidden}
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                    {column.header}
                </th>
              {/if}
            {/each}
            {#if deleteButton || editButton}
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            {/if}
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each data as row, index}
              <!-- Click vào để vào giao diện xem chi tiết và chỉnh sửa đội bóng -->
              <tr
                onclick={() => {
                  if (mouseHover)
                    return;
                  if ((onItemClick ?? null) !== null) {
                    onItemClick!!(row, index);
                  }
                  else {
                    if (redirectParam === "")
                      return;
                    let redirect = "";
                    if (isNumber(row[redirectParam]))
                      redirect = String(row[redirectParam]).trim().toLowerCase();
                    else
                      redirect = row[redirectParam].trim().toLowerCase();
                    console.log(`/${tableType}/` + redirect);
                    goto(
                      `/${tableType}/` + redirect
                    );
                  }
                }}
                class="cursor-pointer hover:bg-gray-100"
              >
                {#each columns as column}
                  {#if column.accessFunction ?? null}
                    <td class="px-6 py-4 whitespace-nowrap">
                      {column.accessFunction!!(row)}
                    </td>
                  {:else if !column.hidden}
                    <td class="px-6 py-4 whitespace-nowrap">
                      {row[column.accessor]}
                    </td>
                  {/if}
                {/each}

                <!-- Delete/Edit -->
                {#if deleteButton || editButton}
                  <td class="px-6 py-4 whitespace-nowrap">
                    {#if editButton}
                      <button class="text-green-600 hover:text-green-900 mr-3" 
                        onclick={(e: Event) => {e.preventDefault(); if ((onEditClick ?? null) !== null) onEditClick!!(row, index)}}
                        onmouseenter={()=> mouseHover = true}
                        onmouseleave={()=> mouseHover = false}>
                        Edit
                      </button>
                    {/if}
                    {#if deleteButton}
                      <button class="text-red-600 hover:text-red-900"
                        onclick={(e: Event) => { e.preventDefault();  if ((onDeleteClick ?? null) !== null) onDeleteClick!!(row, index); }}
                        onmouseenter={()=> mouseHover = true}
                        onmouseleave={()=> mouseHover = false}>
                        Delete
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
