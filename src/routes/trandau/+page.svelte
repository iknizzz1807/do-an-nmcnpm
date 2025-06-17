<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import type { PageProps } from "./$types";
  import { goto } from "$app/navigation";
  import type {
    DoiBong,
    MuaGiai,
    LichThiDau,
    VongTD,
    SanNha,
  } from "$lib/typesDatabase";
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import {
    type FieldOption,
    type FormField,
    type FormInputMap,
  } from "$lib/components/Form.svelte";
  import Form from "$lib/components/Form.svelte";
  import { SvelteMap } from "svelte/reactivity";
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import dateFormat from "dateformat";

  let { data }: PageProps = $props();

  let danhSachLTD: LichThiDau[] = $state(data.danhSachLTD);
  const danhSachDoi: DoiBong[] = $state(data.danhSachDoi);
  const danhSachMuaGiai: MuaGiai[] = $state(data.danhSachMuaGiai);
  const danhSachVTD: VongTD[] = $state(data.danhSachVTD);
  const danhSachSan: SanNha[] = $state(data.danhSachSan);
  const minDate: Date = $state(data.minDate);
  minDate.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00
  const maxDate: Date = $state(data.maxDate);
  maxDate.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00
  const isEditable = $state(data.isEditable);

  onMount(() => {
    for (const ltd of danhSachLTD) {
      let tenDoiThang =
        danhSachDoi.find((value) => value.maDoi == ltd.doiThang)?.tenDoi ??
        null;
      if (tenDoiThang === null) tenDoiThang = "Hòa";
      ltd.tenDoiThang = tenDoiThang;
      ltd.tenVTD =
        danhSachVTD.find((value) => value.maVTD === ltd.maVTD)?.tenVTD ?? "";
      ltd.tenSan =
        danhSachSan.find((value) => value.maSan === ltd.maSan)?.tenSan ?? "";
      ltd.tenDoiMot =
        danhSachDoi.find((value) => value.maDoi == ltd.doiMot)?.tenDoi ?? "";
      ltd.tenDoiHai =
        danhSachDoi.find((value) => value.maDoi == ltd.doiHai)?.tenDoi ?? "";
    }
  });

  const doiOption: FieldOption[] = danhSachDoi
    .filter((val) => val.maDoi ?? null)
    .map((value) => {
      return {
        optionValue: value.maDoi!!,
        optionName: value.tenDoi,
      } satisfies FieldOption;
    });

  const muaGiaiOption: FieldOption[] = danhSachMuaGiai
    .filter((val) => val.maMG ?? null)
    .map((value) => {
      return {
        optionValue: value.maMG!!,
        optionName: value.tenMG,
      } satisfies FieldOption;
    });

  const formFields: FormField[] = [
    {
      label: "Đội một",
      propertyName: "doiMot",
      type: "select",
      valueType: "number",
      options: doiOption,
    },
    {
      label: "Đội hai",
      propertyName: "doiHai",
      type: "select",
      valueType: "number",
      options: doiOption,
    },
    {
      label: "Vòng thi đấu",
      propertyName: "maVTD",
      type: "select",
      valueType: "number",
      options: [
        { optionValue: 1, optionName: "1" },
        { optionValue: 2, optionName: "2" },
      ],
    },
    {
      label: "Đội thắng",
      propertyName: "doiThang",
      type: "select",
      valueType: "number",
      options: (data: FormInputMap) => {
        return [
          { optionValue: null, optionName: "Hòa" },
          doiOption.find((val) => data.get("doiMot") === val.optionValue) ?? {
            optionValue: "",
            optionName: "",
          },
          doiOption.find((val) => data.get("doiHai") === val.optionValue) ?? {
            optionValue: "",
            optionName: "",
          },
        ] satisfies FieldOption[];
      },
    },
    {
      label: "Ngày giờ dự kiến",
      propertyName: "ngayGioDuKien",
      type: "Date",
      valueType: "DateTime",
      min: dateFormat(minDate, "yyyy-mm-dd'T'HH:MM"),
      max: dateFormat(maxDate, "yyyy-mm-dd'T'HH:MM"),
    },
    {
      label: "Ngày giờ thực tế",
      propertyName: "ngayGioThucTe",
      type: "Date",
      valueType: "DateTime",
      min: dateFormat(minDate, "yyyy-mm-dd'T'HH:MM"),
      max: dateFormat(maxDate, "yyyy-mm-dd'T'HH:MM"),
    },
  ];

  const columns = [
    { header: "Đội Một", accessor: "tenDoiMot" },
    {
      header: "Tỷ số",
      accessor: "tyso",
      accessFunction: (data: LichThiDau) => {
        return (
          (data.tiSoDoiMot ?? 0).toString() +
          " - " +
          (data.tiSoDoiHai ?? 0).toString()
        ); // Chưa có kết quả
      },
    },
    { header: "Đội Hai", accessor: "tenDoiHai" },
    { header: "Vòng thi đấu", accessor: "tenVTD" },
    // { header: "Mã mùa giải", accessor: "tenMG" },
    { header: "Đội thắng", accessor: "tenDoiThang" },
    { header: "Sân", accessor: "tenSan" },
    {
      header: "Ngày giờ dự kiến",
      accessor: "ngayGioDuKien",
      accessFunction: (data: LichThiDau) => {
        return new Date(data.ngayGioDuKien!!).toLocaleString("vi-VN");
      },
    },
    {
      header: "Ngày giờ thực tế",
      accessor: "ngayGioThucTe",
      accessFunction: (data: LichThiDau) => {
        return new Date(data.ngayGioThucTe!!).toLocaleString("vi-VN");
      },
    },
  ];

  let selectedIndex: number = $state(0);

  let formState: boolean = $state(false);
  let editData: FormInputMap = $state(new SvelteMap());

  const onOpenForm = (): FormInputMap | null => {
    if (editData.size > 0) return editData;
    return new SvelteMap();
  };

  const onCloseForm = () => {
    editData.clear();
    selectedIndex = -1;
    formState = false;
  };

  const onEditClick = (data: LichThiDau, index: number) => {
    if (data satisfies LichThiDau) {
      editData.clear();
      editData.set("maTD", data.maTD ?? null);
      editData.set("doiMot", data.doiMot);
      editData.set("doiHai", data.doiHai);
      editData.set("maVTD", data.maVTD!!);
      editData.set("doiThang", data.doiThang ?? null);
      editData.set("maMG", data.maMG);
      editData.set("ngayGioDuKien", new Date(data.ngayGioDuKien ?? ""));
      editData.set("ngayGioThucTe", new Date(data.ngayGioThucTe ?? ""));
      selectedIndex = index;
      formState = true;
    } else {
      selectedIndex = -1;
      console.error("Data không thỏa mãn LichThiDau");
    }
  };

  const onDeleteClick = async (data: LichThiDau, index: number) => {
    if (data satisfies LichThiDau) {
      selectedIndex = index;
      await deleteTranDau(data);
      selectedIndex = -1;
    } else {
      console.error("Data không thỏa mãn");
    }
  };

  const deleteTranDau = async (data: LichThiDau) => {
    if (!(data satisfies LichThiDau)) {
      console.error("Không nhập đúng dữ liệu");
      return;
    }

    if (
      data.doiMot === 0 ||
      data.doiHai === 0 ||
      data.maVTD === 0 ||
      data.maMG === 0
    ) {
      showErrorToast("Vui lòng chọn đủ thông tin");
      return;
    }

    try {
      const response = await fetch("/api/lichthidau", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Lỗi xóa lịch thi đấu");
      }

      danhSachLTD.splice(selectedIndex, 1);

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Xóa lịch thi đấu thành công");
    } catch (error) {
      if (error instanceof Error) {
        showErrorToast(error.message);
      } else {
        console.error("Error:", error);
      }
    }
  };

  const submitForm = async (e: Event, data: LichThiDau) => {
    e.preventDefault();
    if (!(data satisfies LichThiDau)) {
      console.error("Không nhập đúng dữ liệu");
      return;
    }

    if (
      data.doiMot === 0 ||
      data.doiHai === 0 ||
      data.maVTD === 0 ||
      data.maMG === 0
    ) {
      showErrorToast("Vui lòng chọn đủ thông tin");
      return;
    }
    if (
      (data.ngayGioDuKien ?? null) === null ||
      (data.ngayGioThucTe ?? null) === null
    ) {
      showErrorToast("Vui lòng nhập ngày giờ dự kiến và thực tế");
      return;
    }
    if (data.ngayGioDuKien!! > data.ngayGioThucTe!!) {
      showErrorToast("Ngày giờ thực tế không thể trước ngày giờ dự kiến");
      return;
    }
    if (data.doiMot === data.doiHai) {
      showErrorToast("Đội một và đội hai không thể giống nhau");
      return;
    }
    if (
      data.doiThang !== null &&
      data.doiThang !== data.doiMot &&
      data.doiThang !== data.doiHai
    ) {
      showErrorToast("Đội thắng phải là một trong hai đội thi đấu");
      return;
    }
    const ngayGioDuKien = new Date(data.ngayGioDuKien!!);
    ngayGioDuKien.setHours(0, 0, 0, 0);
    const ngayGioThucTe = new Date(data.ngayGioThucTe!!);
    ngayGioThucTe.setHours(0, 0, 0, 0);
    if (ngayGioDuKien < minDate || ngayGioThucTe > maxDate) {
      showErrorToast(
        "Ngày giờ phải trong khoảng từ " +
          dateFormat(minDate, "dd/mm/yyyy") +
          " đến " +
          dateFormat(maxDate, "dd/mm/yyyy")
      );
      return;
    }

    console.log(editData);
    try {
      const response = await fetch("/api/lichthidau", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Lỗi tạo lịch thi đấu");
      }

      const result = await response.json();

      result.tenDoiMot =
        danhSachDoi.find((value) => value.maDoi == result.doiMot)?.tenDoi ?? "";
      result.tenDoiHai =
        danhSachDoi.find((value) => value.maDoi == result.doiHai)?.tenDoi ?? "";
      result.tenDoiThang =
        danhSachDoi.find((value) => value.maDoi == result.doiThang)?.tenDoi ??
        null;
      result.tenVTD =
        danhSachVTD.find((value) => value.maVTD === result.maVTD)?.tenVTD ?? "";
      result.tenSan =
        danhSachSan.find((value) => value.maSan === result.maSan)?.tenSan ?? "";
      // result.tenMG =
      //   danhSachMuaGiai.find((value) => value.maMG == result.maMG)?.tenMG ?? "";
      if (result.tenDoiThang === null) result.tenDoiThang = "Hòa";

      if (selectedIndex === -1) danhSachLTD.push(result);
      else danhSachLTD[selectedIndex] = result;

      // Đóng form và hiện toast thành công sau khi thành công
      formState = false;
      showOkToast("Tạo lịch thi đấu mới thành công");
    } catch (error) {
      if (error instanceof Error) {
        showErrorToast(error.message);
      } else {
        console.error("Error:", error);
      }
    }
  };

  type TabId = "matches" | "referees";
  let activeTabId: TabId = $state("matches");

  // --- MOCK DATA CHO TAB TRỌNG TÀI  ---
  let mockReferees = $state([
    { id: 1, name: "Nguyễn Văn A" },
    { id: 2, name: "Trần Thị B" },
    { id: 3, name: "Lê Hoàng C" },
    { id: 4, name: "Phạm Minh D" },
  ]);

  let mockMatchesForAssignment = $state([
    {
      id: 101,
      team1: "Hà Nội FC",
      team2: "Hoàng Anh Gia Lai",
      date: "2024-10-26",
      round: "Vòng 1",
      refereeId: null as number | null,
    },
    {
      id: 102,
      team1: "Viettel FC",
      team2: "Sông Lam Nghệ An",
      date: "2024-10-26",
      round: "Vòng 1",
      refereeId: 2 as number | null,
    },
    {
      id: 103,
      team1: "Bình Định FC",
      team2: "Hải Phòng FC",
      date: "2024-10-27",
      round: "Vòng 1",
      refereeId: null as number | null,
    },
    {
      id: 104,
      team1: "Thanh Hóa FC",
      team2: "Công An Hà Nội",
      date: "2024-10-27",
      round: "Vòng 1",
      refereeId: 1 as number | null,
    },
  ]);

  function saveRefereeAssignments() {
    console.log("Saving referee assignments:", mockMatchesForAssignment);
    showOkToast("Đã lưu phân công trọng tài thành công! (Mock)");
  }
</script>

<svelte:head>
  <title>Các trận đấu</title>
</svelte:head>

<div class="mb-6 border-b border-gray-300">
  <nav class="-mb-px flex space-x-6 overflow-x-auto pb-px" aria-label="Tabs">
    <button
      class="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-base transition-colors duration-150
        {activeTabId === 'matches'
        ? 'border-green-600 text-green-700'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-400'}"
      onclick={() => (activeTabId = "matches")}
    >
      Trận đấu
    </button>
    <button
      class="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-base transition-colors duration-150
        {activeTabId === 'referees'
        ? 'border-green-600 text-green-700'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-400'}"
      onclick={() => (activeTabId = "referees")}
    >
      Trọng tài
    </button>
  </nav>
</div>

{#if activeTabId === "matches"}
  {#if isEditable}
    <div class="flex justify-center gap-4">
      <ButtonPrimary
        text={"Thêm trận đấu mới"}
        onclick={() => (formState = true)}
      />
      <ButtonPrimary
        text={"Sắp xếp lịch"}
        onclick={() => goto("/sapxeptrandau")}
      />
      <ButtonPrimary
        text={"Lịch sử cập nhật"}
        onclick={() => goto("/trandau/lichsu")}
      />
    </div>
  {/if}

  <Table
    title="Danh sách các trận đấu"
    {columns}
    data={danhSachLTD}
    redirectParam={"maTD"}
    tableType="trandau"
    {isEditable}
    {onEditClick}
    {onDeleteClick}
  />

  <Form
    {onOpenForm}
    {onCloseForm}
    {submitForm}
    fields={formFields}
    bind:formState
  />
{:else if activeTabId === "referees"}
  <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">Phân công Trọng tài</h2>
      {#if isEditable}
        <button
          class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          onclick={saveRefereeAssignments}
        >
          Lưu thay đổi
        </button>
      {/if}
    </div>

    <div class="overflow-x-auto border border-gray-200 rounded-lg">
      <table class="min-w-full">
        <thead class="bg-slate-100">
          <tr>
            <th
              class="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >Ngày</th
            >
            <th
              class="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >Vòng đấu</th
            >
            <th
              class="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >Trận đấu</th
            >
            <th
              class="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider w-1/3"
              >Trọng tài</th
            >
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each mockMatchesForAssignment as match (match.id)}
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap"
                >{match.date}</td
              >
              <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap"
                >{match.round}</td
              >
              <td class="px-4 py-3 text-sm text-gray-800 font-medium"
                >{match.team1} vs {match.team2}</td
              >
              <td class="px-4 py-3">
                <select
                  class="w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  bind:value={match.refereeId}
                  disabled={!isEditable}
                >
                  <option value={null}>-- Chưa phân công --</option>
                  {#each mockReferees as referee}
                    <option value={referee.id}>{referee.name}</option>
                  {/each}
                </select>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}
