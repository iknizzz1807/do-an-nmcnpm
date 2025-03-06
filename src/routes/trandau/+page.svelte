<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import type { DoiBong, DSMuaGiai, LichThiDau } from "$lib/types";
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  let { data }: PageProps = $props();

  let danhSachLTD: LichThiDau[] = $state(data.danhSachLTD);
  const danhSachDoi : DoiBong[] = $state(data.danhSachDoi);
  const danhSachMuaGiai : DSMuaGiai[] = $state(data.danhSachMuaGiai);
  // for (const lich of danhSachLTD) {
  //   lich.tenDoiMot = danhSachDoi.find((value) => value.maDoi === lich.doiMot)?.tenDoi;
  //   lich.tenDoiHai = danhSachDoi.find((value) => value.maDoi === lich.doiHai)?.tenDoi;
  //   const doiThang = danhSachDoi.find((value) => value.maDoi === lich.doiThang);
  //   lich.tenDoiThang = (doiThang ?? null) !== null ? doiThang?.tenDoi : "Hòa";
  //   lich.tenMG = danhSachMuaGiai.find((value) => value.maMG === lich.maMG)?.tenMG;
  // }

  const columns = [
    { header: "Đội Một", accessor: "tenDoiMot" },
    { header: "Đội Hai", accessor: "tenDoiHai" },
    { header: "Vòng thi đấu", accessor: "vongThiDau" },
    { header: "Mã mùa giải", accessor: "tenMG" },
    { header: "Đội thắng", accessor: "tenDoiThang" },
    { header: "Ngày giờ", accessor: "ngayGio" },
  ];
  let maTD: number = $state(0);
  let doiMotInput: number = $state(0);
  let doiHaiInput: number = $state(0);
  let vongThiDauInput: number = $state(0);
  let maMGInput: number = $state(0);
  let ngayGioInput: string = $state(new Date().toISOString().split("T")[0]);
  
  let formState: boolean = $state(false);
  let selectedIndex : number = $state(0);


  const openForm = () => {
    formState = true;
  };

  const resetInput = () => {
    doiMotInput = 0;
    doiHaiInput = 0;
    vongThiDauInput = 0;
    maMGInput = 0;
    ngayGioInput = new Date().toISOString().split("T")[0];
    selectedIndex = 0;
    maTD = 0;
  };

  const closeForm = () => {
    formState = false;
    resetInput();
  };

  const onItemClick = (data: any, index: number) => {
    if (data satisfies LichThiDau) {
      openForm();
      selectedIndex = index;
      maTD = data.maTD;
      doiMotInput = data.doiMot;
      doiHaiInput = data.doiHai;
      vongThiDauInput = data.vongThiDauInput;
      maMGInput = data.maMG;
      ngayGioInput = data.ngayGio;
    }
    else {
      console.error("Data không thỏa mãn LichThiDau");
    }
  }

  const submitForm = async (e: Event) => {
    e.preventDefault();
    if (doiMotInput === 0 || doiHaiInput === 0 ||
        vongThiDauInput === 0 || maMGInput === 0 ||
        ngayGioInput.trim() === ""
    ) return;

    // if (
    //   danhSachLTD.some(
    //     (ltd) =>
    //       ltd.doiMot.trim().toLowerCase() ===
    //       inputTenDoi.trim().toLowerCase()
    //   )
    // ) {
    //   showErrorToast("Tên đội bóng đã tồn tại");
    //   return;
    // }
    const data : LichThiDau = { 
      maTD: maTD === 0 ? undefined : maTD,
      doiMot: doiMotInput, 
      doiHai: doiHaiInput,
      vongThiDau: vongThiDauInput,
      maMG: maMGInput,
      ngayGio: ngayGioInput,
    };
    console.log(data);

    try {
      const response = await fetch("/api/lichthidau", {
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
      danhSachLTD.push(result);

      // Đóng form và hiện toast thành công sau khi thành công
      closeForm();
      showOkToast("Tạo đội bóng mới thành công");
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(String(error));
    }
  };
</script>

<svelte:head>
  <title>Các trận đấu</title>
</svelte:head>

<Table
  title="Danh sách các trận đấu"
  {columns}
  data={danhSachLTD}
  redirectParam={"tenCT"}
  tableType="cauThu"
  onItemClick={onItemClick}
/>

<div class="flex justify-center">
  <ButtonPrimary text={"Thêm trận đấu mới"} onclick={openForm} />
</div>

<!-- Form bao gồm: 
 - Đội 1 đội 2 là được select từ danh sách các đội hiện có
 - Vòng thi đấu là select có 2 options là 1 và 2 vì chỉ thi đấu hai vòng
 - Mã mùa giải (sửa thành chọn mùa giải) là select từ danh sách các mùa giải hiện có
 - Đội thắng là select với hai options là hai đội đội một và đội hai sau khi đã chọn đủ hai đội này
 - Ngày giờ tiếp tục chọn date and time dưới dạng input
  -->

{#if formState}
<div
  class="fixed inset-0 flex items-center justify-center backdrop-blur-[1px] bg-white/30"
>
  <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
    <h2 class="text-xl font-bold mb-4">Tạo Lịch thi đấu</h2>
    <form onsubmit={submitForm}>
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="doiMot"
        >
          Đội một
        </label>
        <select
          id="doiMot"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          bind:value={doiMotInput}
        >
          {#each danhSachDoi as doi }
            <option value={doi.maDoi}>{doi.tenDoi}</option>
          {/each}
        </select>
      </div>

      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="doiHai"
        >
          Đội Hai
        </label>
        <select
          id="doiHai"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          bind:value={doiHaiInput}
        >
          {#each danhSachDoi as doi}
            <option value={doi.maDoi}>{doi.tenDoi}</option>
          {/each}
        </select>
      </div>

      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="vongThiDau"
        >
          Vòng thi đấu
        </label>
        <select
          id="vongThiDau"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          bind:value={vongThiDauInput}
        >
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>

      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="maMG"
        >
          Mùa giải
        </label>
        <select
          id="maMG"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          bind:value={maMGInput}
        >
          {#each danhSachMuaGiai as muaGiai }
            <option value={muaGiai.maMG}>{muaGiai.tenMG}</option>
          {/each}
        </select>
      </div>

      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="ngayGio"
        >
          Ngày giờ
        </label>
        <input
          id="ngayGio"
          type="datetime-local"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          bind:value={ngayGioInput}
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
          Cập nhật
        </button>
      </div>
    </form>
  </div>
</div>
{/if}