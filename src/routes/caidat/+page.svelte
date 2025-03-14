<script lang="ts">
</script>

<main class="max-w-7xl mx-auto py-6 px-4">
  <h1 class="text-3xl font-bold text-gray-800 mb-6">System Settings</h1>

  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Player Settings</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Minimum Player Age</label
          >
          <div class="flex items-center">
            <input
              type="number"
              value="16"
              min="5"
              max="40"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
            <span class="ml-2 text-gray-500">years</span>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Maximum Player Age</label
          >
          <div class="flex items-center">
            <input
              type="number"
              value="40"
              min="16"
              max="60"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
            <span class="ml-2 text-gray-500">years</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Team Settings</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Minimum Players per Team</label
          >
          <input
            type="number"
            value="15"
            min="11"
            max="30"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Maximum Players per Team</label
          >
          <input
            type="number"
            value="25"
            min="15"
            max="40"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Maximum Foreign Players per Team</label
          >
          <input
            type="number"
            value="5"
            min="0"
            max="20"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Match Settings</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
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
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Maximum Time for Goal Scoring</label
          >
          <div class="flex items-center">
            <input
              type="number"
              value="90"
              min="45"
              max="120"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
            <span class="ml-2 text-gray-500">minutes</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Point System</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Points for Win</label
          >
          <input
            type="number"
            value="3"
            min="1"
            max="10"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Points for Draw</label
          >
          <input
            type="number"
            value="1"
            min="0"
            max="5"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Points for Loss</label
          >
          <input
            type="number"
            value="0"
            min="0"
            max="2"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>
      <p class="text-sm text-gray-500 mt-2">
        Note: Points for a win must be greater than points for a draw, which
        must be greater than points for a loss.
      </p>
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Ranking Priority</h2>
      <div class="space-y-4">
        <div
          class="flex items-center bg-gray-50 p-4 rounded-md border border-gray-200"
        >
          <span
            class="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center mr-3"
            >1</span
          >
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
            >2</span
          >
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
    </div>
  </div>

  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">User Management</h2>

    <div class="mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">User Types</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User Type
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap font-medium">
                Administrator
              </td>
              <td class="px-6 py-4">
                Full system access with all permissions
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-green-600 hover:text-green-900 mr-3">
                  Edit
                </button>
                <button class="text-red-600 hover:text-red-900" disabled>
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap font-medium"> Manager </td>
              <td class="px-6 py-4">
                Can manage teams, players, and view reports
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-green-600 hover:text-green-900 mr-3">
                  Edit
                </button>
                <button class="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap font-medium">
                Team Coach
              </td>
              <td class="px-6 py-4">
                Can manage only their team and players
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-green-600 hover:text-green-900 mr-3">
                  Edit
                </button>
                <button class="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap font-medium"> Referee </td>
              <td class="px-6 py-4">Can record match results and events</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-green-600 hover:text-green-900 mr-3">
                  Edit
                </button>
                <button class="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-4">
        <button
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add New User Type
        </button>
      </div>
    </div>

    <div>
      <h3 class="text-xl font-semibold text-gray-800 mb-4">User Profiles</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Username
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Full Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User Type
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">admin123</td>
              <td class="px-6 py-4 whitespace-nowrap">
                System Administrator
              </td>
              <td class="px-6 py-4 whitespace-nowrap">Administrator</td>
              <td class="px-6 py-4 whitespace-nowrap">
                admin@footballchamp.com
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                >
                  Active
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-green-600 hover:text-green-900 mr-3">
                  Edit
                </button>
                <button class="text-red-600 hover:text-red-900" disabled>
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">coach_eagles</td>
              <td class="px-6 py-4 whitespace-nowrap">John Smith</td>
              <td class="px-6 py-4 whitespace-nowrap">Team Coach</td>
              <td class="px-6 py-4 whitespace-nowrap">
                john.smith@eagles.com
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                >
                  Active
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-green-600 hover:text-green-900 mr-3">
                  Edit
                </button>
                <button class="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">ref_johnson</td>
              <td class="px-6 py-4 whitespace-nowrap">Michael Johnson</td>
              <td class="px-6 py-4 whitespace-nowrap">Referee</td>
              <td class="px-6 py-4 whitespace-nowrap">
                m.johnson@referees.org
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
                >
                  Pending
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-green-600 hover:text-green-900 mr-3">
                  Edit
                </button>
                <button class="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-4">
        <button
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add New User
        </button>
      </div>
    </div>
  </div>

  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">System Preferences</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
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
        <label class="block text-sm font-medium text-gray-700 mb-2"
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
        <label class="block text-sm font-medium text-gray-700 mb-2"
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
        <label class="block text-sm font-medium text-gray-700 mb-2"
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
      <label class="block text-sm font-medium text-gray-700 mb-2"
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
      class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
    >
      Save Changes
    </button>
  </div>
</main>
