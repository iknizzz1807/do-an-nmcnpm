<script module lang="ts">
  export let test = $state(0);
  export const currentMuaGiai = writable<MuaGiai | null>(null);
</script>

<script lang="ts">
  import type { MuaGiai } from "$lib/typesDatabase";
  import { onMount } from "svelte";
  import { showErrorToast } from "./Toast";
  import { writable } from "svelte/store";
  import dateFormat from "dateformat";
  import { page } from "$app/state";

  let {
    dsMuaGiai,
    selectedMuaGiai,
  }: { dsMuaGiai: MuaGiai[]; selectedMuaGiai: MuaGiai | null } = $props();
  let selectedValue = $state(selectedMuaGiai?.maMG ?? 0);
  let form: HTMLFormElement;

  $effect(() => {
    if (selectedValue - 1 >= 0 && selectedValue - 1 < dsMuaGiai.length) {
      selectedMuaGiai = dsMuaGiai[selectedValue - 1];
      currentMuaGiai.set(selectedMuaGiai);
    } else {
      currentMuaGiai.set(null);
    }
  });

  onMount(async () => {
    try {
      const response = await fetch("/api/muagiai", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Không thể fetch data mùa giải");
      }

      dsMuaGiai = (await response.json()) satisfies MuaGiai[];
    } catch (err) {
      console.error(err);
    }
  });

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/selectmuagiai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedMuaGiai),
      });
      if (!response.ok) {
        selectedValue = 0;
        throw new Error("Không thể thay đổi mùa giải");
      }
      // invalidateAll();
      window.location.reload();
    } catch (err) {
      showErrorToast(String(err));
    }
  };
</script>

<aside
  class="sidebar w-64 bg-stone-100 border-r border-gray-300 flex flex-col py-6 flex-shrink-0 transition-width duration-300"
>
  <div class="sidebar__brand flex items-center px-6 mb-10">
    <!-- Placeholder for an icon, if you have one -->
    <!-- <img src="/path-to-your-icon.png" class="sidebar__brand-icon w-8 h-8 mr-3 object-contain" alt="Icon"> -->
    <span class="sidebar__brand-name text-2xl font-bold text-gray-800"
      >Onesport</span
    >
  </div>

  <div class="px-6 mb-4">
    <form bind:this={form} onsubmit={onSubmit} class="mb-6">
      <label
        for="muagiai-select"
        class="block text-sm font-medium text-gray-600 mb-1"
        >Chọn Mùa Giải</label
      >
      <select
        id="muagiai-select"
        onchange={() => form.requestSubmit()}
        class="w-full bg-white border border-gray-300 text-gray-800 text-sm rounded-md focus:ring-purple-500 focus:border-purple-500 block p-2.5 shadow-sm"
        bind:value={selectedValue}
      >
        <option value={0} selected>Năm hiện tại</option>
        {#each dsMuaGiai as muaGiai}
          <option value={muaGiai.maMG}>{muaGiai.tenMG}</option>
        {/each}
      </select>
    </form>
  </div>

  <span
    class="sidebar__menu-label text-gray-500 text-xs font-medium mb-3 px-6 uppercase tracking-wider"
    >Menu</span
  >
  <nav class="flex-grow">
    <ul class="sidebar__nav-list space-y-1">
      <li class="sidebar__nav-item">
        <a
          href="/"
          class="sidebar__nav-link flex items-center py-3 px-6 text-gray-600 hover:bg-purple-100 hover:text-purple-700 border-l-4 border-transparent hover:border-purple-600 transition-colors duration-150"
          class:active={page.url.pathname === "/"}
        >
          <!-- Icon placeholder (e.g., Home icon) -->
          <span class="sidebar__menu-icon w-5 h-5 mr-4 opacity-80">🏠</span>
          <span>Trang chủ</span>
        </a>
      </li>
      <li class="sidebar__nav-item">
        <a
          href="/cauthu"
          class="sidebar__nav-link flex items-center py-3 px-6 text-gray-600 hover:bg-purple-100 hover:text-purple-700 border-l-4 border-transparent hover:border-purple-600 transition-colors duration-150"
          class:active={page.url.pathname.startsWith("/cauthu")}
        >
          <span class="sidebar__menu-icon w-5 h-5 mr-4 opacity-80">🏃</span>
          <span>Cầu thủ</span>
        </a>
      </li>
      <li class="sidebar__nav-item">
        <a
          href="/doi"
          class="sidebar__nav-link flex items-center py-3 px-6 text-gray-600 hover:bg-purple-100 hover:text-purple-700 border-l-4 border-transparent hover:border-purple-600 transition-colors duration-150"
          class:active={page.url.pathname.startsWith("/doi")}
        >
          <span class="sidebar__menu-icon w-5 h-5 mr-4 opacity-80">🛡️</span>
          <span>Đội</span>
        </a>
      </li>
      <li class="sidebar__nav-item">
        <a
          href="/trandau"
          class="sidebar__nav-link flex items-center py-3 px-6 text-gray-600 hover:bg-purple-100 hover:text-purple-700 border-l-4 border-transparent hover:border-purple-600 transition-colors duration-150"
          class:active={page.url.pathname.startsWith("/trandau")}
        >
          <span class="sidebar__menu-icon w-5 h-5 mr-4 opacity-80">🏟️</span>
          <span>Trận đấu</span>
        </a>
      </li>
      <li class="sidebar__nav-item">
        <a
          href={"/bxh/" + dateFormat(new Date(), "isoDate")}
          class="sidebar__nav-link flex items-center py-3 px-6 text-gray-600 hover:bg-purple-100 hover:text-purple-700 border-l-4 border-transparent hover:border-purple-600 transition-colors duration-150"
          class:active={page.url.pathname.startsWith("/bxh")}
        >
          <span class="sidebar__menu-icon w-5 h-5 mr-4 opacity-80">📊</span>
          <span>Bảng xếp hạng</span>
        </a>
      </li>
      <li class="sidebar__nav-item">
        <a
          href="/muagiai"
          class="sidebar__nav-link flex items-center py-3 px-6 text-gray-600 hover:bg-purple-100 hover:text-purple-700 border-l-4 border-transparent hover:border-purple-600 transition-colors duration-150"
          class:active={page.url.pathname === "/muagiai"}
        >
          <span class="sidebar__menu-icon w-5 h-5 mr-4 opacity-80">🗓️</span>
          <span>Mùa giải</span>
        </a>
      </li>
      <li class="sidebar__nav-item">
        <a
          href="/caidat"
          class="sidebar__nav-link flex items-center py-3 px-6 text-gray-600 hover:bg-purple-100 hover:text-purple-700 border-l-4 border-transparent hover:border-purple-600 transition-colors duration-150"
          class:active={page.url.pathname === "/caidat"}
        >
          <span class="sidebar__menu-icon w-5 h-5 mr-4 opacity-80">⚙️</span>
          <span>Cài đặt</span>
        </a>
      </li>
    </ul>
  </nav>
</aside>

<style>
  /* Styling for active link based on UI.txt example */
  .sidebar__nav-link.active {
    color: #5642a9; /* purple-700 */
    font-weight: 600;
    background-color: #e8e6f1; /* A light purple, adjust as needed */
    border-left-color: #5642a9; /* purple-600 */
  }
  .sidebar__nav-link.active .sidebar__menu-icon {
    opacity: 1;
    filter: none; /* Remove grayscale if applied by default */
  }
</style>
