                <script lang="ts">
  import { SvelteSet } from "svelte/reactivity";
  import { onMount } from "svelte";
  import Table from "$lib/components/Table.svelte";
  import type {
    TableColumnSpecifier,
    TableProps,
  } from "$lib/components/Table.svelte";
  import type { CauThu, LichThiDau, ThamGiaTD, ViTri } from "$lib/typesDatabase";
  import type { PageData, PageProps } from "./$types";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import { page } from "$app/state";

  let { data } : PageProps = $props();

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
    { header: "Tên cầu thủ", accessor: "tenCT", accessFunction: (data : ParticipatingPlayer) => (data.cauThu.tenCT) }, // Unique accessor for the slot
    { header: "Vị trí", accessor: "position" }, // Accessor for the position slot/dropdown
  ];

  let activeTab: "team1" | "team2" = $state("team1");
  // Store arrays of ParticipatingPlayer objects
  let participatingTeam1Players = $state<ParticipatingPlayer[]>(cauThuThamGiaDoiMot);
  let participatingTeam2Players = $state<ParticipatingPlayer[]>(cauThuThamGiaDoiHai);

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
      participatingPlayers.map((p) => p.cauThu.maCT)
    );

    // Lmao ahh ternary
    availablePlayersState = (activeTab === "team1" ? cauThuDoiMot : cauThuDoiHai).filter(
      (p) => p.maDoi === currentTeamId && !participatingIds.has(p.maCT)
    );
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
    try 
    {
      let data = [...participatingTeam1Players, ...participatingTeam2Players];
      const body = data.map((value) => ({
        maTD: maTD!!,
        maCT: value.cauThu.maCT!!,
        maDoi: value.cauThu.maDoi,
        maVT: value.viTri.maVT!!,
      }) satisfies ThamGiaTD);
      const response = await fetch("/api/thamgiatd/" + maTD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok)
        throw new Error("wtf");
      
      showOkToast("Cập nhật thành công");
    }
    catch (e)
    {
      showErrorToast(String(e));
    }
  }
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
      {@const participant = row as ParticipatingPlayer}
      <!-- Conditionally render based on column.accessor -->
      {#if column.accessor === "tenCT"}
        {participant.cauThu.tenCT}
      {:else if column.accessor === "maCT"}
        {participant.cauThu.maCT}
      {:else if column.accessor === "position"}
        <select
          bind:value={participant.viTri.maVT}
          class="border rounded px-2 py-1 bg-white text-sm w-full"
        >
          {#each viTri as pos}
            <option value={pos.maVT}>{pos.tenVT}</option>
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
