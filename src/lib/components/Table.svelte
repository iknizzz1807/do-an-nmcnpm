<script lang="ts">
  import { goto } from "$app/navigation";
  import { isNumber } from "$lib";
  import ButtonPrimary from "./ButtonPrimary.svelte";

  type TableProps<T> = {
    title: string;
    columns: {
      header: string;
      accessor: keyof T;
      hidden?: boolean | undefined;
      accessFunction?: ((data: T) => string) | undefined;
    }[];
    data: T[];
    tableType: string;
    redirectParam: string;
    onItemClick?: ((data: T, index : number) => void) | undefined;
    deleteButton?: boolean;
    onDeleteClick?: ((data: T, index : number) => void) | undefined;
  };
  let mouseHover = $state(false);
  let { title, columns, data, redirectParam, tableType, onItemClick, deleteButton, onDeleteClick }: TableProps<any> =
    $props();
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
            {#if deleteButton ?? null}
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
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
                  {#if !column.hidden}
                  <td class="px-6 py-4 whitespace-nowrap">
                    {row[column.accessor]}
                  </td>
                  {/if}
                {/each}
                {#if deleteButton ?? null}
                  <td>
                    <ButtonPrimary text="Delete" 
                    onclick={() => {
                      if ((onDeleteClick ?? null) !== null) {
                        onDeleteClick!!(row, index);
                      }
                    }}
                    onmouseenter={() => {
                      mouseHover = true;
                    }}
                    onmouseexit={() => {
                      mouseHover = false;
                    }}
                    ></ButtonPrimary>
                  </td>
                {/if}
              </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</main>
