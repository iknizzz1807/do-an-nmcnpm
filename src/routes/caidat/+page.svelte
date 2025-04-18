<script lang="ts">
  import SettingNumberInput from "./SettingNumberInput.svelte";
  import type { Settings, User } from "$lib/typesAuth";
  import type { PageProps } from "./$types";
  import SettingSection from "./SettingSection.svelte";
  import SettingMainSection from "./SettingMainSection.svelte";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import Table from "$lib/components/Table.svelte";
  import Form, { type FormField, type FormInputMap } from "$lib/components/Form.svelte";
  import { SvelteMap } from "svelte/reactivity";

  const { data } : PageProps = $props();
  let setting : Settings = $state(data.setting);
  let users : User[] = $state(data.users);
  let editData : FormInputMap = $state(new SvelteMap());

  let formState = $state(false);
  let selectedIndex = $state(-1);

  const userFields : FormField[] = [
    { label: "Username", propertyName: "username", type: "input", valueType: "string" },
    { label: "Email", propertyName: "email", type: "input", valueType: "string" },
    { label: "User Type", propertyName: "isAdmin", type: "select", valueType: "number", 
      options: [ { optionName: "User", optionValue: 0 }, { optionName: "Admin", optionValue: 1 } ] },
  ]

  const columnsUser = [
    { header: "ID", accessor: "id", hidden: true },
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "User Type", accessor: "isAdmin", accessFunction: (data: User) => data.isAdmin ? "Admin" : "User" },
  ];

  const onOpenForm = () : FormInputMap | null => {
    if (editData.size > -1)
      return editData;
    return new SvelteMap();
  }

  const onCloseForm = () => {
    editData.clear();
    formState = false;
  }

  const onEditClick = async(data: User, index: number) => {
    if (data satisfies User) {
      editData.clear();
      editData.set("id", data.id);
      editData.set("username", data.username);
      editData.set("email", data.email);
      editData.set("isAdmin", Number(data.isAdmin));
      formState = true;
      selectedIndex = index;
    }
    else {
      console.error("Data không thỏa mãn LichThiDau");
      selectedIndex = -1;
    }
  }

  const submitForm = async (e: Event, data: User) => {
    e.preventDefault();
    
    if (data.username.trim() === "" || data.email.trim() === "") {
      showErrorToast("Username/Email không thể trống"); 
      return;
    }

    try {
      const response = await fetch("api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status !== 500)
          throw new Error(error.message);
        throw new Error("Không thể update");
      }

      const responseData = await response.json();

      console.log(responseData);
      users[selectedIndex] = responseData;

      showOkToast("Cập nhật thành công");
      formState = false;
      
    } catch(err) {
      if (err instanceof Error)
        showErrorToast(err.message);
    }
  }

  const onSubmit = async (e: Event) => {
    e.preventDefault();

    try {
      const response = await fetch("api/caidat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(setting)
      });

      if (!response.ok)
        throw new Error("Không thể cập nhật. Có lỗi xảy ra");
      showOkToast("Thành công");
    } catch(err) {
      showErrorToast(String(err));
    }
  }
</script>

<Form
  fields={userFields}
  bind:formState={formState}
  submitForm={submitForm}
  onOpenForm={onOpenForm}
  onCloseForm={onCloseForm}
/>

<main class="max-w-7xl mx-auto py-6 px-4">
  <form onsubmit={onSubmit}>
    <SettingMainSection sectionName="System Settings">
      <SettingSection sectionName="Player Settings">
        <SettingNumberInput min={16} max={40} forValue="tuoiMin" 
          bind:bindValue={setting.tuoiMin} label="Minimum Player Age" unit="years"/>

        <SettingNumberInput min={16} max={60} forValue="tuoiMax"
          bind:bindValue={setting.tuoiMax} label="Maximum Player Age" unit="years"/>
      </SettingSection>
        
      <SettingSection sectionName="Team Settings">
        <SettingNumberInput min={11} max={30} forValue="soCauThuMin" 
          bind:bindValue={setting.soCauThuMin} label="Minimum Players per Team" unit=""/>

        <SettingNumberInput min={15} max={40} forValue="soCauThuMax"
          bind:bindValue={setting.soCauThuMax} label="Maximum Players per Team" unit=""/>

        <SettingNumberInput min={0} max={20} forValue="soCauThuNuocNgoaiToiDa"
          bind:bindValue={setting.soCauThuNuocNgoaiToiDa} label="Maximum Foreign Players per Team" unit=""/>
      </SettingSection>

      
      <SettingSection sectionName="Match Settings">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2" for="something"
            >Number of Goal Types</label
          >
          <select
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="1">1 (Standard)</option>
            <option value="2">2 (Standard + Penalty)</option>
            <option value="3">3 (Standard + Penalty + Own Goal)</option>
            <option value="4">
              4 (Standard + Penalty + Own Goal + Free Kick)
            </option>
          </select>
        </div>
        
        <SettingNumberInput min={45} max={120} forValue="thoiDiemGhiBanToiDa"
          bind:bindValue={setting.thoiDiemGhiBanToiDa} label="Maximum Time for Goal Scoring" unit="minutes"/>
      </SettingSection>

      <SettingSection sectionName="Point System">
        <SettingNumberInput min={1} max={10} forValue="diemThang"
          bind:bindValue={setting.diemThang} label="Points for Win" unit=""/>
        <SettingNumberInput min={0} max={5} forValue="diemHoa"
          bind:bindValue={setting.diemHoa} label="Points for Draw" unit=""/>
        <SettingNumberInput min={-10} max={10} forValue="diemThua"
          bind:bindValue={setting.diemThua} label="Points for Loss" unit=""/>
        <p class="text-sm text-gray-500 mt-2">
          Note: Points for a win must be greater than points for a draw, which
          must be greater than points for a loss.
        </p>
      </SettingSection>

      <div class="space-y-4">
        <div class="flex items-center bg-gray-50 p-4 rounded-md border border-gray-200">
          <span class="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center mr-3">1</span>
          <span class="text-gray-700">Points</span>
          <div class="ml-auto flex space-x-2">
            <button
              class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
              disabled
            >
              ↑
            </button>
            <button class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
              ↓
            </button>
          </div>
        </div>
        <div
          class="flex items-center bg-gray-50 p-4 rounded-md border border-gray-200"
        >
          <span
            class="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center mr-3"
            >2</span>
          <span class="text-gray-700">Goal Difference</span>
          <div class="ml-auto flex space-x-2">
            <button class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
              ↑
            </button>
            <button class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
              ↓
            </button>
          </div>
        </div>
        <div
          class="flex items-center bg-gray-50 p-4 rounded-md border border-gray-200"
        >
          <span
            class="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center mr-3"
            >3</span
          >
          <span class="text-gray-700">Goals For</span>
          <div class="ml-auto flex space-x-2">
            <button class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
              ↑
            </button>
            <button class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
              ↓
            </button>
          </div>
        </div>
        <div
          class="flex items-center bg-gray-50 p-4 rounded-md border border-gray-200"
        >
          <span
            class="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center mr-3"
            >4</span
          >
          <span class="text-gray-700">Head-to-head Results</span>
          <div class="ml-auto flex space-x-2">
            <button class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
              ↑
            </button>
            <button
              class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled
            >
              ↓
            </button>
          </div>
        </div>
      </div>
    </SettingMainSection>
        

    <Table
      title="User Profiles"
      columns={columnsUser}
      data={users}
      redirectParam={""}
      tableType=""
      onEditClick={onEditClick}
    />

    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">System Preferences</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2" for="nothing"
            >Default Language</label
          >
          <select
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="en">English</option>
            <option value="vi">Vietnamese</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2" for="nothing"
            >Default Time Zone</label
          >
          <select
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="UTC+0700">Hanoi, Vietnam (UTC+07:00)</option>
            <option value="UTC+0000">London, UK (UTC+00:00)</option>
            <option value="UTC-0500">New York, USA (UTC-05:00)</option>
            <option value="UTC+0100">Paris, France (UTC+01:00)</option>
            <option value="UTC+0900">Tokyo, Japan (UTC+09:00)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2" for="nothing"
            >Data Export Format</label
          >
          <select
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="csv">CSV</option>
            <option value="xlsx">Excel (XLSX)</option>
            <option value="pdf">PDF</option>
            <option value="json">JSON</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2" for="nothing"
            >System Notifications</label
          >
          <div class="space-y-2">
            <div class="flex items-center">
              <input
                id="email_notifications"
                name="email_notifications"
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
                name="browser_notifications"
                type="checkbox"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                checked
              />
              <label
                for="browser_notifications"
                class="ml-2 block text-sm text-gray-700"
                >Browser Notifications</label
              >
            </div>
            <div class="flex items-center">
              <input
                id="sms_notifications"
                name="sms_notifications"
                type="checkbox"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                for="sms_notifications"
                class="ml-2 block text-sm text-gray-700">SMS Notifications</label
              >
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <label class="block text-sm font-medium text-gray-700 mb-2" for="nothing"
          >Automatic Data Backup</label
        >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-center">
            <input
              id="backup_daily"
              name="backup_frequency"
              type="radio"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              checked
            />
            <label for="backup_daily" class="ml-2 block text-sm text-gray-700"
              >Daily</label
            >
          </div>
          <div class="flex items-center">
            <input
              id="backup_weekly"
              name="backup_frequency"
              type="radio"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <label for="backup_weekly" class="ml-2 block text-sm text-gray-700"
              >Weekly</label
            >
          </div>
          <div class="flex items-center">
            <input
              id="backup_monthly"
              name="backup_frequency"
              type="radio"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <label for="backup_monthly" class="ml-2 block text-sm text-gray-700"
              >Monthly</label
            >
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-end space-x-4">
      <button
        class="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
      >
        Save Changes
      </button>
    </div>
    
  </form>
</main>
