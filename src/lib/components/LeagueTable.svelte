<script lang="ts">
  import { goto } from "$app/navigation";

  type TableProps<T> = {
    title: string;
    columns: {
      header: string;
      accessor: keyof T;
    }[];
    data: T[];
    tableType: string;
    redirectParam: string;
  };

  let { title, columns, data, redirectParam, tableType }: TableProps<any> =
    $props();
</script>

<div
  id="standings"
  class="bg-white rounded-lg shadow-md p-5 border border-gray-200"
>
  <h2 class="text-xl font-semibold text-gray-800 mb-5">{title}</h2>
  <div class="overflow-x-auto">
    <table class="min-w-full">
      <thead class="bg-slate-100">
        <tr>
          {#each columns as column}
            <th
              class="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200"
            >
              {column.header}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody class="bg-white">
        {#each data as row}
          <tr
            onclick={() => {
              goto(`/${tableType}/` + row[redirectParam].trim().toLowerCase());
            }}
            class="cursor-pointer hover:bg-gray-50 transition-colors duration-150 border-b border-gray-200 last:border-b-0"
          >
            {#each columns as column}
              <td class="px-4 py-2.5 text-sm text-gray-800">
                {row[column.accessor]}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
