<script lang="ts">
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import type { Settings } from "$lib/typesAuth";
  import SettingMainSection from "../SettingMainSection.svelte";
  import SettingNumberInput from "../SettingNumberInput.svelte";
  import SettingSection from "../SettingSection.svelte";

  let { setting } : { setting: Settings } = $props();

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

</script>

<form onsubmit={onSettingSubmit}>
  <SettingMainSection sectionName="System Settings">
    <SettingSection sectionName="Player Settings">
      <SettingNumberInput
        min={16}
        max={40}
        forValue="tuoiMin"
        bind:bindValue={setting.tuoiMin}
        label="Minimum Player Age"
        unit="years"
      />
      <SettingNumberInput
        min={16}
        max={60}
        forValue="tuoiMax"
        bind:bindValue={setting.tuoiMax}
        label="Maximum Player Age"
        unit="years"
      />
    </SettingSection>

    <SettingSection sectionName="Team Settings">
      <SettingNumberInput
        min={11}
        max={30}
        forValue="soCauThuMin"
        bind:bindValue={setting.soCauThuMin}
        label="Minimum Players per Team"
        unit=""
      />
      <SettingNumberInput
        min={15}
        max={40}
        forValue="soCauThuMax"
        bind:bindValue={setting.soCauThuMax}
        label="Maximum Players per Team"
        unit=""
      />
    </SettingSection>

    <SettingSection sectionName="Match Settings">
      <SettingNumberInput
        min={45}
        max={120}
        forValue="thoiDiemGhiBanToiDa"
        bind:bindValue={setting.thoiDiemGhiBanToiDa}
        label="Maximum Time for Goal Scoring"
        unit="minutes"
      />
    </SettingSection>

    <!-- Ranking Priority Section (Placeholder for now) -->
    <SettingSection sectionName="Ranking Priority (Tiebreakers)">
      <p class="text-sm text-gray-600 mb-4">
        Define the order of criteria used to rank teams if they have the
        same number of points. Drag to reorder (functionality not yet
        implemented).
      </p>
      <div class="space-y-2">
        <div
          class="flex items-center bg-gray-100 p-3 rounded-md border border-gray-200"
        >
          <span
            class="w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-3 text-xs"
            >1</span
          >
          <span class="text-gray-700 text-sm">Goal Difference</span>
        </div>
        <div
          class="flex items-center bg-gray-100 p-3 rounded-md border border-gray-200"
        >
          <span
            class="w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-3 text-xs"
            >2</span
          >
          <span class="text-gray-700 text-sm">Goals For</span>
        </div>
        <div
          class="flex items-center bg-gray-100 p-3 rounded-md border border-gray-200"
        >
          <span
            class="w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-3 text-xs"
            >3</span
          >
          <span class="text-gray-700 text-sm">Head-to-head Results</span>
        </div>
      </div>
    </SettingSection>
  </SettingMainSection>

  <div class="bg-white rounded-lg shadow-md p-6 mt-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">
      System Preferences
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label
          class="block text-sm font-medium text-gray-700 mb-1"
          for="defaultLanguage">Default Language</label
        >
        <select
          id="defaultLanguage"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
        >
          <option value="en">English</option>
          <option value="vi">Vietnamese</option>
        </select>
      </div>
      <div>
        <label
          class="block text-sm font-medium text-gray-700 mb-1"
          for="defaultTimeZone">Default Time Zone</label
        >
        <select
          id="defaultTimeZone"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
        >
          <option value="UTC+0700">Hanoi, Vietnam (UTC+07:00)</option>
          <option value="UTC+0000">London, UK (UTC+00:00)</option>
        </select>
      </div>
      <div>
        <label
          class="block text-sm font-medium text-gray-700 mb-1"
          for="dataExportFormat">Data Export Format</label
        >
        <select
          id="dataExportFormat"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
        >
          <option value="csv">CSV</option>
          <option value="xlsx">Excel (XLSX)</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >System Notifications</label
        >
        <div class="space-y-2">
          <div class="flex items-center">
            <input
              id="email_notifications"
              type="checkbox"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              checked
            />
            <label
              for="email_notifications"
              class="ml-2 block text-sm text-gray-700"
              >Email Notifications</label
            >
          </div>
          <div class="flex items-center">
            <input
              id="browser_notifications"
              type="checkbox"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label
              for="browser_notifications"
              class="ml-2 block text-sm text-gray-700"
              >Browser Notifications</label
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-8 flex justify-end space-x-4">
    <button
      type="button"
      class="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Cancel
    </button>
    <button
      type="submit"
      class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
    >
      Save System Settings
    </button>
  </div>
</form>