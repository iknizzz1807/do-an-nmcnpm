<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  let { data }: PageProps = $props();

  type DoiBong = {
    tenDoi: string;
    sanNha: string;
  };

  let danhSachDoiBong: DoiBong[] = $state(data.danhSachDoiBong);

  // let danhSachDoiBong: DoiBong[] = $state([
  //   { tenDoi: "Man United", sanNha: "Old Trafford" },
  //   { tenDoi: "Man City", sanNha: "Etihad" },
  // ]);

  const columns = [
    { header: "Tên đội", accessor: "tenDoi" },
    { header: "Sân nhà", accessor: "sanNha" },
  ];

  let inputTenDoi: string = $state("");
  let inputSanNha: string = $state("");

  let formState: boolean = $state(false);

  const openForm = () => {
    formState = true;
  };

  const closeForm = () => {
    formState = false;
  };

  const submitForm = async (e: Event) => {
    e.preventDefault();

    if (inputTenDoi.trim() === "" || inputSanNha.trim() === "") return;

    const data = { tenDoi: inputTenDoi, sanNha: inputSanNha };

    try {
      const response = await fetch("/api/doibong", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Lỗi tạo đội bóng");
      }

      const result = await response.json();

      // Cập nhật danh sách đội bóng nếu cần thiết
      danhSachDoiBong.push(result);

      // Đóng form sau khi thành công
      closeForm();
    } catch (error) {
      console.error("Error:", error);
    }
  };
</script>

<svelte:head>
  <title>Các đội bóng</title>
</svelte:head>

<Table title="Danh sách các đội bóng" {columns} data={danhSachDoiBong} />
<div class="flex justify-center">
  <ButtonPrimary text="Tạo đội mới" onclick={openForm} />
</div>

{#if formState}
  <div
    class="fixed inset-0 flex items-center justify-center backdrop-blur-[1px] bg-white/30"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Tạo đội bóng mới</h2>
      <form onsubmit={submitForm}>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="tenDoi"
          >
            Tên đội
          </label>
          <input
            id="tenDoi"
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            bind:value={inputTenDoi}
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="sanNha"
          >
            Sân nhà
          </label>
          <input
            id="sanNha"
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            bind:value={inputSanNha}
          />
        </div>
        <div class="flex justify-end">
          <button
            type="button"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            onclick={closeForm}
          >
            Hủy
          </button>
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onclick={submitForm}
          >
            Tạo
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
