<script lang="ts">
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { Settings } from "$lib/typesAuth";
  import SettingMainSection from "../SettingMainSection.svelte";
  import SettingNumberInput from "../SettingNumberInput.svelte";
  import SettingSection from "../SettingSection.svelte";

  let { setting }: { setting: Settings } = $props();

  const onSettingSubmit = async (e: Event) => {
    e.preventDefault();

    try {
      const response = await fetch("api/caidat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(setting),
      });

      if (!response.ok) throw new Error("Không thể cập nhật. Có lỗi xảy ra");
      showOkToast("Thành công");
    } catch (err) {
      showErrorToast(String(err));
    }
  };

  const handleBackup = async () => {
    try {
      const response = await fetch("/api/caidat/backup", {
        method: "POST",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Sao lưu thất bại.");
      }

      showOkToast("Đã sao lưu thành công.");
    } catch (err) {
      if (err instanceof Error) {
        showErrorToast(err.message);
      } else {
        showErrorToast("Đã xảy ra lỗi không xác định.");
      }
    }
  };
</script>

<form onsubmit={onSettingSubmit}>
  <SettingMainSection sectionName="Cài đặt hệ thống">
    <SettingSection sectionName="Cài đặt cầu thủ">
      <SettingNumberInput
        min={16}
        max={40}
        forValue="tuoiMin"
        bind:bindValue={setting.tuoiMin}
        label="Số tuổi cầu thủ nhỏ nhất"
        unit="years"
      />
      <SettingNumberInput
        min={16}
        max={60}
        forValue="tuoiMax"
        bind:bindValue={setting.tuoiMax}
        label="Số tuổi cầu thủ lớn nhất"
        unit="years"
      />
    </SettingSection>

    <SettingSection sectionName="Cài đặt đội">
      <SettingNumberInput
        min={11}
        max={30}
        forValue="soCauThuMin"
        bind:bindValue={setting.soCauThuMin}
        label="Số cầu thủ tối thiểu mỗi đội"
        unit=""
      />
      <SettingNumberInput
        min={15}
        max={40}
        forValue="soCauThuMax"
        bind:bindValue={setting.soCauThuMax}
        label="Số cầu thủ tối đa mỗi đội"
        unit=""
      />
      <SettingNumberInput
        min={5}
        max={40}
        forValue="soCauThuTGTDMin"
        bind:bindValue={setting.soCauThuTGTDMin}
        label="Số cầu thủ tham gia thi đấu tối thiểu"
        unit=""
      />
      <SettingNumberInput
        min={5}
        max={40}
        forValue="soCauThuTGTDMax"
        bind:bindValue={setting.soCauThuTGTDMax}
        label="Số cầu thủ tham gia thi đấu tối đa"
        unit=""
      />
    </SettingSection>

    <SettingSection sectionName="Cài đặt trận đấu">
      <SettingNumberInput
        min={45}
        max={120}
        forValue="thoiDiemGhiBanToiDa"
        bind:bindValue={setting.thoiDiemGhiBanToiDa}
        label="Thởi điểm ghi bàn tối đa"
        unit="minutes"
      />

      <!-- <SettingNumberInput
        min={1}
        max={2}
        forValue="thoiDiemGhiBanToiDa"
        bind:bindValue={setting.thoiDiemGhiBanToiDa}
        label="Đội sân nhà"
        unit="minutes"
      /> -->
      <div>
        <label
          class="block text-sm mb-1 font-medium text-gray-700"
          for="doiSanNha">Đội sân nhà</label
        >
        <div class="flex items-center">
          <select
            id="doiSanNha"
            name="doiSanNha"
            class="block w-full px-1 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-sm bg-white transition-colors duration-200"
            bind:value={setting.doiDaTrenSanNha}
          >
            <option value={1}>Đội một</option>
            <option value={2}>Đội hai</option>
          </select>
        </div>
      </div>
    </SettingSection>
  </SettingMainSection>

  <div class="mt-4"></div>
  <SettingMainSection sectionName="Quản lý  dữ liệu">
    <div class="p-4 bg-gray-50 rounded-md border border-gray-200">
      <h3 class="text-lg font-medium text-gray-800">Sao lưu dữ liệu</h3>
      <p class="mt-1 text-sm text-gray-600">
        Tạo một bản sao lưu an toàn cho toàn bộ cơ sở dữ liệu.
      </p>
      <div class="mt-4">
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onclick={handleBackup}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
            <path
              fill-rule="evenodd"
              d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          Sao lưu ngay
        </button>
      </div>
    </div>
  </SettingMainSection>

  <div class="mt-8 mb-12 flex justify-end space-x-4">
    <button
      type="button"
      class="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Huỷ
    </button>
    <button
      type="submit"
      class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
    >
      Lưu cài đặt hệ thống
    </button>
  </div>
</form>
