<script lang="ts">
  import { goto } from "$app/navigation";

  type TableProps<T> = {
    title: string;
    columns: {
      header: string;
      accessor: keyof T;
    }[];
    data: T[];
  };

  let { title, columns, data }: TableProps<any> = $props();
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
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            {/each}
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each data as row}
            <!-- Click vào để vào giao diện xem chi tiết và chỉnh sửa đội bóng -->
            <tr onclick={() => {}} class="cursor-pointer hover:bg-gray-100">
              {#each columns as column}
                <td class="px-6 py-4 whitespace-nowrap">
                  {row[column.accessor]}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</main>
