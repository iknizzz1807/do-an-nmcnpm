<script lang="ts">
  import { SvelteSet } from "svelte/reactivity";
  import { onMount } from "svelte";
  import Table from "$lib/components/Table.svelte";
  import type {
    TableColumnSpecifier,
    TableProps,
  } from "$lib/components/Table.svelte";
  import type {
    CauThu,
    LichThiDau,
    ThamGiaTD,
    ViTri,
  } from "$lib/typesDatabase";
  import type { PageData, PageProps } from "./$types";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import { page } from "$app/state";

  let { data }: PageProps = $props();

  const maTD = $state(data.maTD);
  const cauThuDoiMot = $state(data.cauThuDoiMot);
  const cauThuDoiHai = $state(data.cauThuDoiHai);
  const cauThuThamGiaDoiMot = $state(data.cauThuThamGiaDoiMot);
  const cauThuThamGiaDoiHai = $state(data.cauThuThamGiaDoiHai);
  const maDoiMot = $state(data.maDoiMot);
  const maDoiHai = $state(data.maDoiHai);
  const tenDoiMot = $state(data.tenDoiMot);
  const tenDoiHai = $state(data.tenDoiHai);
  const viTri = $state(data.viTri);
  // Type for players participating in the match with selected position
  type ParticipatingPlayer = {
    cauThu: CauThu;
    viTri: ViTri;
  };

  // Columns for AVAILABLE players table (no position)
  const availableColumns: TableColumnSpecifier[] = [
    // { header: "Mã cầu thủ", accessor: "maCT", accessFunction: (data : CauThu) => (data.maCT!!.toString()) },
    { header: "Tên cầu thủ", accessor: "tenCT" },
  ];

  // Columns for PARTICIPATING players table
  const participatingColumns: TableColumnSpecifier[] = [
    // { header: "Mã cầu thủ", accessor: "maCT", accessFunction: (data : ParticipatingPlayer) => (data.cauThu.maCT!!.toString()) },
    {
      header: "Tên cầu thủ",
      accessor: "tenCT",
      accessFunction: (data: ParticipatingPlayer) => data.cauThu.tenCT,
    }, // Unique accessor for the slot
    { header: "Vị trí", accessor: "position" }, // Accessor for the position slot/dropdown
  ];

  let activeTab: "team1" | "team2" = $state("team1");
  // Store arrays of ParticipatingPlayer objects
  let participatingTeam1Players =
    $state<ParticipatingPlayer[]>(cauThuThamGiaDoiMot);
  let participatingTeam2Players =
    $state<ParticipatingPlayer[]>(cauThuThamGiaDoiHai);

  // State for available players (still Player[])
  let availablePlayersState = $state<CauThu[]>([]);

  // Effect to calculate available players
  $effect(() => {
    const currentTeamId = activeTab === "team1" ? maDoiMot : maDoiHai;
    const participatingPlayers =
      activeTab === "team1"
        ? participatingTeam1Players
        : participatingTeam2Players;
    const participatingIds = new Set(
      participatingPlayers.map((p) => p.cauThu.maCT)
    );

    // Lmao ahh ternary
    availablePlayersState = (
      activeTab === "team1" ? cauThuDoiMot : cauThuDoiHai
    )
      .filter(
        (p) =>
          p.cauThu.maDoi === currentTeamId &&
          !participatingIds.has(p.cauThu.maCT)
      )
      .map((value) => value.cauThu);
  });

  // Function to add a player (passed from Available Table)
  function addPlayerFromTable(playerToAdd: CauThu, index: number) {
    const newParticipant: ParticipatingPlayer = {
      cauThu: playerToAdd,
      viTri: viTri[0], // Assign default position
    };
    console.log(newParticipant);
    if (activeTab === "team1") {
      // Create new array to trigger reactivity
      participatingTeam1Players = [
        newParticipant,
        ...participatingTeam1Players,
      ];
    } else {
      participatingTeam2Players = [
        newParticipant,
        ...participatingTeam2Players,
      ];
    }
  }

  // Function to remove a player (passed from Participating Table)
  function removePlayerFromTable(
    participantToRemove: ParticipatingPlayer,
    index: number
  ) {
    if (activeTab === "team1") {
      participatingTeam1Players = participatingTeam1Players.filter(
        (p) => p.cauThu.maCT !== participantToRemove.cauThu.maCT
      );
    } else {
      participatingTeam2Players = participatingTeam2Players.filter(
        (p) => p.cauThu.maCT !== participantToRemove.cauThu.maCT
      );
    }
  }

  async function saveSelection() {
    try {
      let data = [...participatingTeam1Players, ...participatingTeam2Players];
      const body = data.map(
        (value) =>
          ({
            maTD: maTD!!,
            maCT: value.cauThu.maCT!!,
            maDoi: value.cauThu.maDoi,
            maVT: value.viTri.maVT!!,
          }) satisfies ThamGiaTD
      );
      const response = await fetch("/api/thamgiatd/" + maTD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("wtf");

      showOkToast("Cập nhật thành công");
    } catch (e) {
      showErrorToast(String(e));
    }
  }
</script>

<svelte:head>
  <title>Danh sách cầu thủ thi đấu</title>
</svelte:head>

<main class="container mx-auto px-4 pb-8">
  <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
    <!-- Left Column: Player Selection (7 columns on xl screens) -->
    <div class="xl:col-span-5">
      <div
        class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <!-- Enhanced Tab Header -->
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">
            Chọn cầu thủ tham gia
          </h2>

          <!-- Modern Tab Navigation -->
          <div class="relative">
            <nav
              class="flex space-x-1 bg-gray-100 p-1 rounded-lg"
              aria-label="Tabs"
            >
              <button
                class="relative flex-1 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 {activeTab ===
                'team1'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}"
                onclick={() => (activeTab = "team1")}
              >
                <div class="flex items-center justify-center space-x-2">
                  <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span class="font-semibold">{tenDoiMot}</span>
                  <span
                    class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold"
                  >
                    {participatingTeam1Players.length}
                  </span>
                </div>
              </button>

              <button
                class="relative flex-1 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 {activeTab ===
                'team2'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}"
                onclick={() => (activeTab = "team2")}
              >
                <div class="flex items-center justify-center space-x-2">
                  <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span class="font-semibold">{tenDoiHai}</span>
                  <span
                    class="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-bold"
                  >
                    {participatingTeam2Players.length}
                  </span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        <!-- Available Players Table -->
        <div class="p-6">
          <Table
            title={`Cầu thủ có sẵn - ${activeTab === "team1" ? tenDoiMot : tenDoiHai}`}
            columns={availableColumns}
            data={availablePlayersState}
            isEditable={true}
            tableType=""
            redirectParam=""
            onAddClick={addPlayerFromTable}
            onEditClick={undefined}
            onDeleteClick={undefined}
            onItemClick={undefined}
            showExportCSV={false}
          />

          {#if availablePlayersState.length === 0}
            <div class="text-center py-12">
              <div
                class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4"
              >
                <svg
                  class="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-800 mb-2">
                Không còn cầu thủ
              </h3>
              <p class="text-gray-500">
                Tất cả cầu thủ của đội này đã được chọn hoặc đội không có cầu
                thủ nào.
              </p>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Right Column: Selected Players & Actions (5 columns on xl screens) -->
    <div class="xl:col-span-7">
      <div
        class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-fit sticky top-4"
      >
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200"
        >
          <h2 class="text-xl font-semibold text-gray-800 mb-2">
            Đội hình thi đấu
          </h2>
          <p class="text-sm text-gray-600">
            Cầu thủ đã chọn cho {activeTab === "team1" ? tenDoiMot : tenDoiHai}
          </p>
        </div>

        <!-- Participating Players Table -->
        <div class="p-6">
          {#snippet customTableRender(row: any, column: any)}
            {@const participant = row as ParticipatingPlayer}
            {#if column.accessor === "tenCT"}
              <div class="flex items-center space-x-3">
                <div
                  class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                >
                  <span class="text-white font-bold text-sm">
                    {participant.cauThu.tenCT.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span class="font-medium text-gray-800"
                  >{participant.cauThu.tenCT}</span
                >
              </div>
            {:else if column.accessor === "maCT"}
              {participant.cauThu.maCT}
            {:else if column.accessor === "position"}
              <select
                bind:value={participant.viTri.maVT}
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                {#each viTri as pos}
                  <option value={pos.maVT}>{pos.tenVT}</option>
                {/each}
              </select>
            {:else}
              {@html row[column.accessor] ?? ""}
            {/if}
          {/snippet}

          <Table
            title=""
            columns={participatingColumns}
            data={activeTab === "team1"
              ? participatingTeam1Players
              : participatingTeam2Players}
            isEditable={true}
            tableType=""
            redirectParam=""
            onDeleteClick={removePlayerFromTable}
            customRender={customTableRender}
            showExportCSV={false}
          />

          {#if (activeTab === "team1" ? participatingTeam1Players.length : participatingTeam2Players.length) === 0}
            <div class="text-center py-12">
              <div
                class="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"
              >
                <svg
                  class="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-800 mb-2">
                Chưa chọn cầu thủ
              </h3>
              <p class="text-gray-500 text-sm">
                Chọn cầu thủ từ danh sách bên trái để thêm vào đội hình.
              </p>
            </div>
          {/if}
        </div>

        <!-- Action Panel -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="space-y-4">
            <!-- Team Summary -->
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="bg-white p-3 rounded-lg border shadow-sm">
                <div
                  class="text-gray-600 mb-1 text-xs font-medium uppercase tracking-wide"
                >
                  Đội {tenDoiMot}
                </div>
                <div class="text-2xl font-bold text-blue-600">
                  {participatingTeam1Players.length}
                </div>
                <div class="text-xs text-gray-500">cầu thủ được chọn</div>
              </div>
              <div class="bg-white p-3 rounded-lg border shadow-sm">
                <div
                  class="text-gray-600 mb-1 text-xs font-medium uppercase tracking-wide"
                >
                  Đội {tenDoiHai}
                </div>
                <div class="text-2xl font-bold text-purple-600">
                  {participatingTeam2Players.length}
                </div>
                <div class="text-xs text-gray-500">cầu thủ được chọn</div>
              </div>
            </div>

            <!-- Save Button -->
            <button
              class="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
              onclick={saveSelection}
            >
              <div class="flex items-center justify-center space-x-2">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Lưu đội hình thi đấu</span>
              </div>
            </button>

            <!-- Quick Actions -->
            <div class="flex space-x-2">
              <button
                class="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                onclick={() => {
                  if (activeTab === "team1") {
                    participatingTeam1Players = [];
                  } else {
                    participatingTeam2Players = [];
                  }
                }}
              >
                <div class="flex items-center justify-center space-x-1">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Xóa tất cả</span>
                </div>
              </button>
              <button
                class="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                onclick={() =>
                  (activeTab = activeTab === "team1" ? "team2" : "team1")}
              >
                <div class="flex items-center justify-center space-x-1">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  <span>Chuyển đội</span>
                </div>
              </button>
            </div>

            <!-- Additional Info -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div class="flex items-start space-x-2">
                <svg
                  class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div class="text-sm">
                  <p class="text-blue-800 font-medium mb-1">Lưu ý:</p>
                  <p class="text-blue-700">
                    Nhấn "Lưu đội hình" để cập nhật danh sách cầu thủ thi đấu
                    cho cả hai đội.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
