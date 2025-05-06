<script lang="ts">
  import { SvelteSet } from "svelte/reactivity";
  import { onMount } from "svelte";
  import Table from "$lib/components/Table.svelte";
  import type {
    TableColumnSpecifier,
    TableProps,
  } from "$lib/components/Table.svelte";
  import type { CauThu, DoiBong, LichThiDau, ThamGiaTD, ViTri } from "$lib/typesDatabase";
  import type { PageData, PageProps } from "./$types";
  import { showErrorToast, showOkToast } from "$lib/components/Toast";
  import { page } from "$app/state";
  import { redirect } from "@sveltejs/kit";

  let { data } : PageProps = $props();
  const danhSachDoi = $state(data.danhSachDoi);

  const availableColumns: TableColumnSpecifier[] = [
    { header: "Tên đội", accessor: "tenDoi" },
  ];

  const participatingColumns: TableColumnSpecifier[] = [
    { header: "Tên đội", accessor: "tenDoi" }
  ];

  let participatingTeams = $state<DoiBong[]>([]);
  let availableTeams = $state<DoiBong[]>([]);

  $effect(() => {
    const participatingIds = new Set(
      participatingTeams.map((p) => p.maDoi)
    );

    availableTeams = danhSachDoi.filter(
      (p) => !participatingIds.has(p.maDoi)
    );
  });

  function addTeamToTable(playerToAdd: DoiBong, index: number) {
    const newParticipant: DoiBong = playerToAdd
    participatingTeams = [
      newParticipant,
      ...participatingTeams,
    ];
  }

  function removeTeamFromTable(
    participantToRemove: DoiBong,
    index: number
  ) {
    participatingTeams = participatingTeams.filter(
      (p) => p.maDoi !== participantToRemove.maDoi
    );
  }

  async function saveSelection() {
    try 
    {
      const body = [...participatingTeams];
      const response = await fetch("/api/sapxeplich", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok)
        throw new Error("wtf");
      showOkToast("Cập nhật thành công");

      setTimeout(() => {
        window.location.href = '/trandau';
      }, 1000)
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
    <!-- <h1 class="text-2xl font-bold mb-4">
      Sắp xếp lịch thi đáu
    </h1> -->

    <!-- Available Players Table -->
    <div>
      <Table
        title={`Đội bóng có sẵn`}
        columns={availableColumns}
        data={availableTeams}
        isEditable={true}
        tableType=""
        redirectParam=""
        onAddClick={addTeamToTable}
        onEditClick={undefined}
        onDeleteClick={undefined}
        onItemClick={undefined}
      >
        <!-- Default rendering in Table.svelte handles this -->
      </Table>
      {#if availableTeams.length === 0}
        <p class="text-gray-500 italic mt-4 text-center">
          Không còn cầu thủ nào để thêm.
        </p>
      {/if}
    </div>
  </div>

  <!-- Right Column: Participating Players Table -->
  <div>
    <Table
      title={`Đội bóng tham gia`}
      columns={participatingColumns}
      data={participatingTeams}
      isEditable={true}
      tableType=""
      redirectParam=""
      onDeleteClick={removeTeamFromTable}
    />

    {#if participatingTeams.length === 0}
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
