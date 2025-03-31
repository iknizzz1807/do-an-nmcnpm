<script module lang="ts">
  export let test = $state(0);
  export const muaGiai = writable<DSMuaGiai | null>(null);
</script>

<script lang="ts">
  import type { DSMuaGiai } from "$lib/typesDatabase";
  import { onMount } from "svelte";
  import { showErrorToast } from "./Toast";
  import { writable } from "svelte/store";
  import dateFormat from "dateformat";

  let { dsMuaGiai, selectedMuaGiai } : { dsMuaGiai: DSMuaGiai[], selectedMuaGiai: DSMuaGiai | null } = $props();
  let selectedValue = $state(selectedMuaGiai?.maMG ?? 0);
  let form : HTMLFormElement;

  $effect(() => {
    if (selectedValue - 1 >= 0 && selectedValue - 1 < dsMuaGiai.length) {
      selectedMuaGiai = dsMuaGiai[selectedValue - 1];
      muaGiai.set(selectedMuaGiai);
    }
    else {
      muaGiai.set(null);
    }
  })

  onMount(async () => {
    try {
      const response = await fetch("/api/muagiai", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      console.log(response);
      if (!response.ok) {
        throw new Error("Không thể fetch data mùa giải");
      }

      dsMuaGiai = await response.json() satisfies DSMuaGiai[];
    } catch (err) {
      console.error(err);
    }
  });

  const onSubmit = async (e : Event) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/selectmuagiai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedMuaGiai)
      });
      if (!response.ok) {
        selectedValue = 0;
        throw new Error("Không thể thay đổi mùa giải");
      }
      // invalidateAll();
      window.location.reload();
    } catch(err) {
      showErrorToast(String(err));
    }
  }
</script>

<nav class="bg-green-800 text-white shadow-lg mb-6">
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex justify-between h-16 items-center">
      <div class="flex items-center">
        <span class="text-xl font-bold">Football Championship</span>
      </div>

      <form bind:this={form} onsubmit={onSubmit}>
        <select
          onchange={() => form.requestSubmit()}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          bind:value={selectedValue}
          >
          <option value={0} selected>Choose a year</option>
          {#each dsMuaGiai as muaGiai}
            <option value={muaGiai.maMG}>{ muaGiai.tenMG }</option>
          {/each}
        </select>
      </form>

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
          href={ "/bxh/" + dateFormat(new Date(), "isoDate") }
          class="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
          >Bảng xếp hạng</a
        >
        <a
          href="/muagiai"
          class="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
          >Danh sách mùa giải</a
        >
        <a
          href="/caidat"
          class="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
          >Cài đặt</a
        >
      </div>
    </div>
  </div>
</nav>
