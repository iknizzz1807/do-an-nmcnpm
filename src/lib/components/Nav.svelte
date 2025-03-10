<script lang="ts">
  import type { DSMuaGiai } from "$lib/types";
  import { getContext, hasContext, onMount, setContext } from "svelte";

  let dsMuaGiai : DSMuaGiai[] = $state([]);
  let selectedValue = $state(0);

  $effect(() => {
    const item = localStorage.getItem('maMGSelected');
    if (item) selectedValue = parseInt(item);
  })

  $effect(() => {
    if (selectedValue - 1 >= 0 && selectedValue - 1 < dsMuaGiai.length) {
      localStorage.setItem('maMGSelected', selectedValue.toString());
      console.log($state.snapshot(dsMuaGiai[selectedValue - 1]));
    }
  })

  onMount(async () => {
    try {
      const data = await fetch("/api/muagiai", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (!data.ok) {
        throw new Error("Không thể fetch data mùa giải");
      }

      dsMuaGiai = await data.json() satisfies DSMuaGiai[];

    } catch (err) {
      console.error(err);
    }
  });
</script>

<nav class="bg-green-800 text-white shadow-lg mb-6">
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex justify-between h-16 items-center">
      <div class="flex items-center">
        <span class="text-xl font-bold">Football Championship</span>
      </div>

      <select
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        bind:value={selectedValue}
        >
        <option value={0} selected>Choose a year</option>
        {#each dsMuaGiai as muaGiai}
          <option value={muaGiai.maMG}>{ muaGiai.tenMG }</option>
        {/each}
      </select>

      <div class="flex items-center space-x-4">
        <a
          href="/"
          class="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
          >Trang chủ</a
        >
        <a
          href="/cauthu"
          class="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
          >Cầu thủ</a
        >
        <a
          href="/doi"
          class="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
          >Đội</a
        >
        <a
          href="/trandau"
          class="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
          >Trận đấu</a
        >
        <a
          href="/bxh"
          class="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
          >Bảng xếp hạng</a
        >
      </div>
    </div>
  </div>
</nav>
