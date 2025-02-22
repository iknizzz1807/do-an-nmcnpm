<script lang="ts">
  let { title, col, data }: { title: string; col: string[]; data: string[] } =
    $props();
</script>

<main class="flex justify-center items-center h-full">
  <div id="teams" class="bg-white rounded-lg shadow-md p-6 mb-8 w-full">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            {#each col as c}
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {c}
              </th>
            {/each}
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr>
            <!-- Cái này thiếu kiểu dữ liệu, khi có kiểu dữ liệu, tiến hành xử lý tách các
            thành phần trong props ra và tiến hành xử lý -->

            <!-- export let data: any[]; // Dữ liệu là một mảng các đối tượng bất kỳ
            // Lấy danh sách các trường từ đối tượng đầu tiên trong mảng data
            let col: string[] = data.length > 0 ? Object.keys(data[0]) : []; -->

            <!-- Ví dụ, khi truyền vào một mảng các đối tượng student như sau:
            <Table title="Student List" data={[{ age: 20, name: "John", class: "A" }, { age: 22, name: "Jane", class: "B" }]} /> -->
            <td class="px-6 py-4 whitespace-nowrap">Team Eagles</td>
            <td class="px-6 py-4 whitespace-nowrap">23</td>
            <td class="px-6 py-4 whitespace-nowrap">John Smith</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</main>
