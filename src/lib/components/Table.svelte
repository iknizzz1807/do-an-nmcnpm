<script lang="ts">
  import { goto } from "$app/navigation";

  type TableProps<T> = {
    title: string;
    columns: {
      header: string;
      accessor: keyof T;
      hidden?: boolean | undefined;
    }[];
    data: T[];
    tableType: string;
    redirectParam: string;
  };
  let { title, columns, data, redirectParam, tableType }: TableProps<any> =
    $props();
  const isNumber =  (num : any) => {
    if (typeof num === 'number') {
      return num - num === 0;
    }
    if (typeof num === 'string' && num.trim() !== '') {
      return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
    }
    return false;
  };
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
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each data as row}
              <!-- Click vào để vào giao diện xem chi tiết và chỉnh sửa đội bóng -->
              <tr
                onclick={() => {
                  let redirect = "";
                  if (isNumber(row[redirectParam]))
                    redirect = String(row[redirectParam]).trim().toLowerCase();
                  else
                    redirect = row[redirectParam].trim().toLowerCase();
                  // console.log(row[redirectParam].trim().toLowerCase());
                  console.log(`/${tableType}/` + redirect);
                  goto(
                    `/${tableType}/` + redirect
                  );
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
              </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</main>
