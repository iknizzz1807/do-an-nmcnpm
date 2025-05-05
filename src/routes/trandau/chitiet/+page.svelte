<script lang="ts">
  import { SvelteSet } from "svelte/reactivity";
  import { onMount } from "svelte";
  import Table from "$lib/components/Table.svelte";
  import type {
    TableColumnSpecifier,
    TableProps,
  } from "$lib/components/Table.svelte";
  import type { LichThiDau } from "$lib/typesDatabase";

  // Player type without position
  type Player = {
    id: string;
    name: string;
    // position: string; // Removed
    teamId: string;
  };

  // Type for players participating in the match with selected position
  type ParticipatingPlayer = {
    player: Player;
    position: string;
  };

  const positions = $state(["Thủ môn", "Hậu vệ", "Tiền vệ", "Tiền đạo"]);
  const defaultPosition = $state("Tiền đạo"); // Default position when adding

  // Mock Data (without position)
  const matchDetails = $state({
    matchId: "match123",
    team1: { id: "teamA", name: "Dragon Warriors" },
    team2: { id: "teamB", name: "Phoenix Knights" },
    allPlayers: [
      { id: "p1", name: "Nguyễn Văn A", teamId: "teamA" },
      { id: "p2", name: "Trần Thị B", teamId: "teamA" },
      { id: "p3", name: "Lê Văn C", teamId: "teamA" },
      { id: "p4", name: "Phạm Thị D", teamId: "teamA" },
      { id: "p5", name: "Hoàng Văn E", teamId: "teamA" },
      { id: "p6", name: "Vũ Thị F", teamId: "teamA" },
      { id: "p7", name: "Đặng Văn G", teamId: "teamA" },
      { id: "p8", name: "Bùi Văn H", teamId: "teamB" },
      { id: "p9", name: "Dương Thị I", teamId: "teamB" },
      { id: "p10", name: "Ngô Văn K", teamId: "teamB" },
      { id: "p11", name: "Mai Thị L", teamId: "teamB" },
      { id: "p12", name: "Lý Văn M", teamId: "teamB" },
      { id: "p13", name: "Trịnh Thị N", teamId: "teamB" },
      { id: "p14", name: "Hồ Văn P", teamId: "teamB" },
    ] as Player[],
  });

  let activeTab: "team1" | "team2" = $state("team1");
  // Store arrays of ParticipatingPlayer objects
  let participatingTeam1Players = $state<ParticipatingPlayer[]>([]);
  let participatingTeam2Players = $state<ParticipatingPlayer[]>([]);

  // State for available players (still Player[])
  let availablePlayersState = $state<Player[]>([]);

  // Effect to calculate available players
  $effect(() => {
    const currentTeamId =
      activeTab === "team1" ? matchDetails.team1.id : matchDetails.team2.id;
    const participatingPlayers =
      activeTab === "team1"
        ? participatingTeam1Players
        : participatingTeam2Players;
    const participatingIds = new Set(
      participatingPlayers.map((p) => p.player.id)
    );

    availablePlayersState = matchDetails.allPlayers.filter(
      (p) => p.teamId === currentTeamId && !participatingIds.has(p.id)
    );
  });

  // Function to add a player (passed from Available Table)
  function addPlayerFromTable(playerToAdd: Player, index: number) {
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
        (p) => p.player.id !== participantToRemove.player.id
      );
    } else {
      participatingTeam2Players = participatingTeam2Players.filter(
        (p) => p.player.id !== participantToRemove.player.id
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
    { header: "Tên cầu thủ", accessor: "name" },
  ];

  // Columns for PARTICIPATING players table
  const participatingColumns: TableColumnSpecifier[] = [
    { header: "Tên cầu thủ", accessor: "playerName" }, // Unique accessor for the slot
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
      Chọn cầu thủ thi đấu: {matchDetails.team1.name} vs {matchDetails.team2
        .name}
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
          {matchDetails.team1.name}
        </button>
        <button
          class="{activeTab === 'team2'
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          onclick={() => (activeTab = "team2")}
        >
          {matchDetails.team2.name}
        </button>
      </nav>
    </div>

    <!-- Available Players Table -->
    <div>
      <Table
        title={`Cầu thủ có sẵn (${activeTab === "team1" ? matchDetails.team1.name : matchDetails.team2.name})`}
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
    <Table
      title={`Cầu thủ thi đấu (${activeTab === "team1" ? matchDetails.team1.name : matchDetails.team2.name})`}
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
      let:row
      let:column
      let:index
    >
      <!-- Conditionally render based on column.accessor -->
      {#if column.accessor === "playerName"}
        {row.player.name}
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
    </Table>

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
