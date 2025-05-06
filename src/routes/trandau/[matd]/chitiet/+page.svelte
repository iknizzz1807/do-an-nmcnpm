<script lang="ts">
  import { SvelteSet } from "svelte/reactivity";
  import { onMount } from "svelte";
  import Table from "$lib/components/Table.svelte";
  import type {
    TableColumnSpecifier,
    TableProps,
  } from "$lib/components/Table.svelte";
  import type { CauThu, LichThiDau } from "$lib/typesDatabase";
  import type { PageData, PageProps } from "./$types";

  let { data } : PageProps = $props();

  const cauThuDoiMot = $state(data.cauThuDoiMot);
  const cauThuDoiHai = $state(data.cauThuDoiHai);
  const maDoiMot = $state(data.maDoiMot);
  const maDoiHai = $state(data.maDoiHai);
  const tenDoiMot = $state(data.tenDoiMot);
  const tenDoiHai = $state(data.tenDoiHai);
  // Type for players participating in the match with selected position
  type ParticipatingPlayer = {
    player: CauThu;
    position: string;
  };

  const positions = $state(["Thủ môn", "Hậu vệ", "Tiền vệ", "Tiền đạo"]);
  const defaultPosition = $state("Tiền đạo"); // Default position when adding

  let activeTab: "team1" | "team2" = $state("team1");
  // Store arrays of ParticipatingPlayer objects
  let participatingTeam1Players = $state<ParticipatingPlayer[]>([]);
  let participatingTeam2Players = $state<ParticipatingPlayer[]>([]);

  // State for available players (still Player[])
  let availablePlayersState = $state<CauThu[]>([]);

  // Effect to calculate available players
  $effect(() => {
    const currentTeamId =
      activeTab === "team1" ? maDoiMot : maDoiHai;
    const participatingPlayers =
      activeTab === "team1"
        ? participatingTeam1Players
        : participatingTeam2Players;
    const participatingIds = new Set(
      participatingPlayers.map((p) => p.player.maCT)
    );

    // Lmao ahh ternary
    availablePlayersState = (activeTab === "team1" ? cauThuDoiMot : cauThuDoiHai).filter(
      (p) => p.maDoi === currentTeamId && !participatingIds.has(p.maCT)
    );
  });

  // Function to add a player (passed from Available Table)
  function addPlayerFromTable(playerToAdd: CauThu, index: number) {
    const newParticipant: ParticipatingPlayer = {
      player: playerToAdd,
      position: defaultPosition, // Assign default position
    };
    if (activeTab === "team1") {
      // Create new array to trigger reactivity
      participatingTeam1Players = [
        ...participatingTeam1Players,
        newParticipant,
      ];
    } else {
      participatingTeam2Players = [
        ...participatingTeam2Players,
        newParticipant,
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
        (p) => p.player.maCT !== participantToRemove.player.maCT
      );
    } else {
      participatingTeam2Players = participatingTeam2Players.filter(
        (p) => p.player.maCT !== participantToRemove.player.maCT
      );
    }
  }

  function saveSelection() {
    console.log("Saving selection...");
    // You might want to validate positions or counts here before saving
    console.log("Team 1 Participating Players:", participatingTeam1Players);
    console.log("Team 2 Participating Players:", participatingTeam2Players);
    // Replace console logs with actual API call to save the data
    alert("Selection saved! (Check console for details)");
  }

  // Columns for AVAILABLE players table (no position)
  const availableColumns: TableColumnSpecifier[] = [
    { header: "Tên cầu thủ", accessor: "tenCT" },
  ];

  // Columns for PARTICIPATING players table
  const participatingColumns: TableColumnSpecifier[] = [
    { header: "Tên cầu thủ", accessor: "tenCT", accessFunction: (data : ParticipatingPlayer) => {
      console.log(data);
      return data.player.tenCT;
     } }, // Unique accessor for the slot
    { header: "Vị trí", accessor: "position" }, // Accessor for the position slot/dropdown
  ];

  // Optional: Load initial data
  onMount(() => {
    // Example of loading initial data if needed
    // const initialPlayer1 = matchDetails.allPlayers.find(p => p.id === 'p1');
    // const initialPlayer8 = matchDetails.allPlayers.find(p => p.id === 'p8');
    // if (initialPlayer1) {
    //   participatingTeam1Players = [{ player: initialPlayer1, position: 'Tiền đạo' }];
    // }
    // if (initialPlayer8) {
    //   participatingTeam2Players = [{ player: initialPlayer8, position: 'Thủ môn' }];
    // }
  });
</script>

<svelte:head>
  <title>Danh sách cầu thủ thi đấu</title>
</svelte:head>

<main class="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- Left Column: Player Selection -->
  <div>
    <h1 class="text-2xl font-bold mb-4">
      Chọn cầu thủ thi đấu: {tenDoiMot} vs {tenDoiHai}
    </h1>

    <!-- Tabs -->
    <div class="mb-4 border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          class="{activeTab === 'team1'
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          onclick={() => (activeTab = "team1")}
        >
          {tenDoiMot}
        </button>
        <button
          class="{activeTab === 'team2'
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          onclick={() => (activeTab = "team2")}
        >
          {tenDoiHai}
        </button>
      </nav>
    </div>

    <!-- Available Players Table -->
    <div>
      <Table
        title={`Cầu thủ có sẵn (${activeTab === "team1" ? tenDoiMot : tenDoiHai})`}
        columns={availableColumns}
        data={availablePlayersState}
        isEditable={true}
        tableType=""
        redirectParam=""
        onAddClick={addPlayerFromTable}
        onEditClick={undefined}
        onDeleteClick={undefined}
        onItemClick={undefined}
      >
        <!-- Default rendering in Table.svelte handles this -->
      </Table>
      {#if availablePlayersState.length === 0}
        <p class="text-gray-500 italic mt-4 text-center">
          Không còn cầu thủ nào để thêm.
        </p>
      {/if}
    </div>
  </div>

  <!-- Right Column: Participating Players Table -->
  <div>
    {#snippet customTableRender(row: any, column: any)}
      <!-- Conditionally render based on column.accessor -->
      {#if column.accessor === "tenCT"}
        {row.player.tenCT}
      {:else if column.accessor === "position"}
        {@const participant = row as ParticipatingPlayer}
        <select
          bind:value={participant.position}
          class="border rounded px-2 py-1 bg-white text-sm w-full"
        >
          {#each positions as pos (pos)}
            <option value={pos}>{pos}</option>
          {/each}
        </select>
      {:else}
        <!-- Fallback for other columns if any (using default rendering from Table.svelte) -->
        {@html row[column.accessor] ?? ""}
      {/if}
    {/snippet}
    <Table
      title={`Cầu thủ thi đấu (${activeTab === "team1" ? tenDoiMot : tenDoiHai})`}
      columns={participatingColumns}
      data={activeTab === "team1"
        ? participatingTeam1Players
        : participatingTeam2Players}
      isEditable={true}
      tableType=""
      redirectParam=""
      onDeleteClick={removePlayerFromTable}
      onEditClick={undefined}
      onItemClick={undefined}
      onAddClick={undefined}
      customRender={customTableRender}
    />

    {#if (activeTab === "team1" ? participatingTeam1Players.length : participatingTeam2Players.length) === 0}
      <p class="text-gray-500 italic mt-4 text-center">
        Chưa chọn cầu thủ nào cho đội này.
      </p>
    {/if}

    <!-- Save Button -->
    <div class="mt-6 flex justify-end">
      <button
        class="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onclick={saveSelection}
      >
        Lưu danh sách
      </button>
    </div>
  </div>
</main>
