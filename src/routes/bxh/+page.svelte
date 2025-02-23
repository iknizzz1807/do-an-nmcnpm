<script lang="ts">
  import LeagueTable from "$lib/components/LeagueTable.svelte";
</script>

<svelte:head>
  <title>Bảng xếp hạng</title>
</svelte:head>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Danh sách mùa giải</h1>
  <div class="mb-4">
    <select
      name="season"
      id="season"
      class="block p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
    >
      <option value="2024">2024</option>
      <option value="2025">2025</option>
    </select>
  </div>
  <LeagueTable />
</div>
