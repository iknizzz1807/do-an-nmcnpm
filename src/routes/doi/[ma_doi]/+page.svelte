<script lang="ts">
  import type { PageProps } from "./$types";
  import Table from "$lib/components/Table.svelte";
  let { data }: PageProps = $props();
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import type { CauThu } from "$lib/types";
  import { showOkToast, showErrorToast } from "$lib/components/Toast";

  let danhSachCauThu: CauThu[] = $state(data.danhSachCauThu);
  const ma_doi = data.ma_doi;

  const columns = [
    { header: "Mã cầu thủ", accessor: "maCT", hidden: true },
    { header: "Tên cầu thủ", accessor: "tenCT" },
    { header: "Ngày sinh", accessor: "ngaySinh" },
    { header: "Loại cầu thủ", accessor: "loaiCT" },
    { header: "Ghi chú", accessor: "ghiChu" },
  ];

  let tenCTInput: string = $state("");
  let loaiCTInput: number = $state(0);
  let ghiChuInput: string = $state("");
  let nuocNgoaiInput: boolean = $state(false);
  let ngaySinhInput: string = $state(new Date().toISOString().split("T")[0]);

  let formState: boolean = $state(false);
  let updateIndex: number = $state(-1);
  let maCT: number = $state(0);

  const resetInput = () => {
    tenCTInput = "";
    loaiCTInput = 0;
    ghiChuInput = "";
    nuocNgoaiInput = false;
    ngaySinhInput = new Date().toISOString().split("T")[0];
    updateIndex = -1;
  };

  const openForm = () => {
    formState = true;
  };

  const closeForm = () => {
    formState = false;
    resetInput();
  };

  const onItemClick = (data: any, index: number) => {
    if (data satisfies CauThu) {
      updateIndex = index;
      maCT = data.maCT;
      tenCTInput = data.tenCT;
      loaiCTInput = parseInt(data.loaiCT);
      ghiChuInput = data.ghiChu;
      nuocNgoaiInput = Boolean(parseInt(data.nuocNgoai));
      ngaySinhInput = data.ngaySinh;
      openForm();
    }
  };

  const addPlayer = async (e: Event) => {
    e.preventDefault();

    if (tenCTInput.trim() === "" || ghiChuInput.trim() === "") {
      showErrorToast("Vui lòng điền đầy đủ form");
      return;
    }

    const dataInput: CauThu = {
      tenCT: tenCTInput,
      loaiCT: loaiCTInput,
      ghiChu: ghiChuInput,
      nuocNgoai: nuocNgoaiInput,
      ngaySinh: ngaySinhInput,
    };

    try {
      // console.log(dataInput);
      const response = await fetch("/api/cauthu/" + ma_doi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataInput),
      });

      if (!response.ok) {
        showErrorToast("Lỗi tạo cầu thủ");
        throw new Error("Lỗi tạo cầu thủ");
      }

      const result = await response.json();

      danhSachCauThu.push(result);

      // Đóng form và hiện toast thành công sau khi thành công
      closeForm();
      showOkToast("Tạo cầu thủ mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };

  const updatePlayer = async (e: Event) => {
    e.preventDefault();

    if (tenCTInput.trim() === "" || ghiChuInput.trim() === "") {
      showErrorToast("Vui lòng điền đầy đủ form");
      return;
    }

    const dataInput: CauThu = {
      maCT: maCT,
      tenCT: tenCTInput,
      loaiCT: loaiCTInput,
      ghiChu: ghiChuInput,
      nuocNgoai: nuocNgoaiInput,
      ngaySinh: ngaySinhInput,
    };

    try {
      console.log(dataInput);
      const response = await fetch("/api/cauthu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataInput),
      });

      if (!response.ok) {
        showErrorToast("Lỗi cập nhật cầu thủ");
        throw new Error("Lỗi cập nhật cầu thủ");
      }

      const result = await response.json();

      danhSachCauThu[updateIndex] = result satisfies CauThu;

      // Đóng form và hiện toast thành công sau khi thành công
      closeForm();
      showOkToast("Cập nhật cầu thủ mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };
</script>

<Table
  title={"Danh sách các cầu thủ"}
  {columns}
  data={danhSachCauThu}
  redirectParam={""}
  tableType={"cauthu"}
  {onItemClick}
/>

<div class="flex justify-center">
  <ButtonPrimary text={"Thêm cầu thủ"} onclick={openForm} />
</div>

{#if formState}
  <div
    class="fixed inset-0 flex items-center justify-center backdrop-blur-[1px] bg-white/30"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Cập nhật cầu thủ</h2>
      <form onsubmit={updateIndex >= 0 ? addPlayer : updatePlayer}>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="tenDoi"
          >
            Tên cầu thủ
          </label>
          <input
            id="tenDoi"
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            bind:value={tenCTInput}
          />
        </div>

        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="loaiCT"
          >
            Loại cầu thủ
          </label>
          <select
            id="loaiCT"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            bind:value={loaiCTInput}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="tenDoi"
          >
            Ghi chú
          </label>
          <input
            id="tenDoi"
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            bind:value={ghiChuInput}
          />
        </div>

        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="loaiCT"
          >
            Nước ngoài?
          </label>
          <select
            id="loaiCT"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            bind:value={nuocNgoaiInput}
          >
            <option value="1">Không</option>
            <option value="2">Có</option>
          </select>
        </div>

        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="ngaySinh"
          >
            Ngày sinh
          </label>
          <input
            id="ngaySinh"
            type="date"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            bind:value={ngaySinhInput}
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
          {#if updateIndex != -1}
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onclick={updatePlayer}
            >
              Cập nhật
            </button>
          {:else}
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onclick={addPlayer}
            >
              Tạo
            </button>
          {/if}
        </div>
      </form>
    </div>
  </div>
{/if}
