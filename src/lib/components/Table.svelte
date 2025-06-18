<script module lang="ts">
  export type TableColumnSpecifier = {
    header: string;
    accessor: string;
    hidden?: boolean | undefined;
    accessFunction?: ((data: any) => string | number | Date) | undefined;
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
    showExportCSV?: boolean;
    showTeamLogo?: boolean;
    error?: boolean;
  };
</script>

<script lang="ts">
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
    showExportCSV = true,
    showTeamLogo = false,
    error = false,
  }: TableProps = $props();
  const deleteButton = $state((onDeleteClick ?? null) !== null);
  const editButton = $state((onEditClick ?? null) !== null);
  const addButton = $state((onAddClick ?? null) !== null);

  // Trạng thái cho tính năng sắp xếp
  let sortedColumn = $state<string | null>(null);
  let sortDirection = $state<"asc" | "desc">("asc");
  let sortedData = $state([...data]);

  // Cập nhật dữ liệu khi props thay đổi
  $effect(() => {
    sortedData = [...data];
  });

  /**
   * Phân tích chuỗi ngày tháng linh hoạt. Hỗ trợ 2 định dạng:
   * 1. 'hh:mm:ss dd/mm/yyyy'
   * 2. 'dd/mm/yyyy'
   * Trả về đối tượng Date hoặc null nếu không hợp lệ.
   */
  function parseFlexibleDateString(value: any): Date | null {
    if (typeof value !== "string") return null;

    // Regex cho định dạng: hh:mm:ss dd/mm/yyyy
    const dateTimeRegex =
      /^(\d{1,2}):(\d{1,2}):(\d{1,2})\s+(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    let parts = value.match(dateTimeRegex);
    if (parts) {
      const hour = parseInt(parts[1], 10);
      const minute = parseInt(parts[2], 10);
      const second = parseInt(parts[3], 10);
      const day = parseInt(parts[4], 10);
      const month = parseInt(parts[5], 10) - 1; // Tháng trong JS là 0-indexed
      const year = parseInt(parts[6], 10);

      const date = new Date(year, month, day, hour, minute, second);
      if (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      ) {
        return date;
      }
    }

    // Regex cho định dạng: dd/mm/yyyy
    const dateOnlyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    parts = value.match(dateOnlyRegex);
    if (parts) {
      const day = parseInt(parts[1], 10);
      const month = parseInt(parts[2], 10) - 1;
      const year = parseInt(parts[3], 10);

      const date = new Date(year, month, day);
      if (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      ) {
        return date;
      }
    }

    return null;
  }

  // Hàm xử lý sắp xếp
  function sortByColumn(columnAccessor: string) {
    if (sortedColumn === columnAccessor) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortedColumn = columnAccessor;
      sortDirection = "asc";
    }

    sortedData = [...data].sort((a, b) => {
      // Lấy giá trị từ đối tượng
      const column = columns.find((col) => col.accessor === columnAccessor);
      const valueA = column?.accessFunction
        ? column.accessFunction(a)
        : a[columnAccessor];
      const valueB = column?.accessFunction
        ? column.accessFunction(b)
        : b[columnAccessor];

      // Xử lý null/undefined
      if (valueA === null || valueA === undefined)
        return sortDirection === "asc" ? -1 : 1;
      if (valueB === null || valueB === undefined)
        return sortDirection === "asc" ? 1 : -1;

      // --- LOGIC SẮP XẾP ĐA KIỂU DỮ LIỆU ---

      // 1. Thử phân tích chuỗi thành Date
      const dateA = parseFlexibleDateString(valueA);
      const dateB = parseFlexibleDateString(valueB);

      if (dateA && dateB) {
        return sortDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      // 2. Kiểm tra nếu là đối tượng Date gốc
      if (valueA instanceof Date && valueB instanceof Date) {
        return sortDirection === "asc"
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      }

      // 3. Kiểm tra nếu là số
      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }

      // 4. Mặc định: sắp xếp như chuỗi
      const strA = String(valueA).toLowerCase();
      const strB = String(valueB).toLowerCase();
      return sortDirection === "asc"
        ? strA.localeCompare(strB, "vi")
        : strB.localeCompare(strA, "vi");
    });
  }

  function exportToCSV() {
    const visibleColumns = columns.filter((col) => !col.hidden);
    const headers = visibleColumns.map((col) => `"${col.header}"`).join(",");
    const csvRows = data
      .map((row) => {
        return visibleColumns
          .map((col) => {
            let cellValue;
            if (col.accessFunction) {
              cellValue = col.accessFunction(row);
            } else {
              cellValue = row[col.accessor];
            }

            if (cellValue === null || cellValue === undefined) {
              return '""';
            }

            if (cellValue instanceof Date) {
              const day = cellValue.getDate().toString().padStart(2, "0");
              const month = (cellValue.getMonth() + 1)
                .toString()
                .padStart(2, "0");
              const year = cellValue.getFullYear();
              return `"'${day}/${month}/${year}'"`;
            }

            const dateStr = String(cellValue);
            // Cải thiện regex để bắt cả định dạng dd/mm/yyyy
            if (
              /^\d{1,4}[-/\.]\d{1,2}[-/\.]\d{1,4}/.test(dateStr) ||
              /^\d{1,2}\/\d{1,2}\/\d{4}/.test(dateStr) ||
              /^\d{1,2}:\d{1,2}:\d{1,2}\s+\d{1,2}\/\d{1,2}\/\d{4}/.test(dateStr)
            ) {
              return `"'${dateStr}'"`; // Luôn thêm dấu ' để Excel hiểu là text
            }

            if (/^\s*\d+\s*-\s*\d+\s*$/.test(dateStr)) {
              // Định dạng thành công thức ="..." để ép Excel hiểu là chuỗi
              return `="${dateStr}"`;
            }

            const stringValue = String(cellValue).replace(/"/g, '""');
            return `"${stringValue}"`;
          })
          .join(",");
      })
      .join("\n");

    const csvContent = "\uFEFF" + `${headers}\n${csvRows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${title.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<main class="flex justify-center items-start w-full">
  <div
    id="table-container"
    class="bg-white rounded-lg shadow-md p-5 w-full border transition-all duration-300"
    class:border-gray-200={!error}
    class:border-red-500={error}
    class:shadow-red-100={error}
  >
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-xl font-semibold text-gray-800">{title}</h2>

      {#if showExportCSV && data.length > 0}
        <button
          onclick={exportToCSV}
          class="bg-green-600 cursor-pointer hover:bg-green-700 text-white text-sm font-medium py-1.5 px-3 rounded flex items-center gap-1 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Xuất ra CSV
        </button>
      {/if}
    </div>

    <div class="max-h-150 overflow-auto border border-gray-200 rounded-lg">
      <table class="min-w-full">
        <!-- Header cố định -->
        <thead class="bg-slate-100 sticky top-0 z-10">
          <tr>
            {#if showTeamLogo}
              <th
                class="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300 whitespace-nowrap"
              >
                Logo
              </th>
            {/if}

            {#each columns as column}
              {#if !column.hidden}
                <th
                  class="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300 cursor-pointer select-none whitespace-nowrap"
                  onclick={() => sortByColumn(column.accessor)}
                >
                  <div class="flex items-center justify-between">
                    <span>{column.header}</span>
                    {#if sortedColumn === column.accessor}
                      <span class="ml-1">
                        {#if sortDirection === "asc"}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        {:else}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        {/if}
                      </span>
                    {/if}
                  </div>
                </th>
              {/if}
            {/each}
            {#if (deleteButton || editButton || addButton) && isEditable}
              <th
                class="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300 whitespace-nowrap"
              >
                Hành động
              </th>
            {/if}
          </tr>
        </thead>
        <tbody class="bg-white">
          {#each sortedData as row, index}
            <tr
              onclick={() => {
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
              class="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-200 last:border-b-0"
            >
              {#if showTeamLogo}
                <td class="px-4 py-2.5 text-sm text-gray-800 align-top">
                  {#if row.imageURL}
                    <img
                      src={row.imageURL}
                      alt="Logo"
                      class="w-16 h-16 rounded-full object-cover"
                    />
                  {:else}
                    <div
                      class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      <span class="text-xs font-bold text-gray-500"
                        >{row.tenDoi?.charAt(0) || "?"}</span
                      >
                    </div>
                  {/if}
                </td>
              {/if}

              {#each columns as column (column.accessor)}
                {#if !column.hidden}
                  <td class="px-4 py-2.5 text-sm text-gray-800 align-top">
                    {#if customRender}
                      {@render customRender(row, column)}
                    {:else if (column.accessFunction ?? null) !== null}
                      <div
                        class="max-w-md overflow-hidden text-ellipsis whitespace-normal break-words"
                      >
                        {column.accessFunction!!(row)}
                      </div>
                    {:else if !column.hidden}
                      <div
                        class="max-w-md overflow-hidden text-ellipsis whitespace-normal break-words"
                      >
                        {row[column.accessor]}
                      </div>
                    {/if}
                  </td>
                {/if}
              {/each}

              {#if (deleteButton || editButton || addButton) && isEditable}
                <td
                  class="px-4 py-2.5 text-sm space-x-2 whitespace-nowrap align-top"
                >
                  {#if addButton}
                    <button
                      class="text-blue-600 hover:text-blue-800 font-medium"
                      onclick={(e) => {
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
                      onclick={(e) => {
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
                      onclick={(e) => {
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
