<script module lang="ts">
  export let test = $state(0);
  export const currentMuaGiai = writable<MuaGiai | null>(null);
</script>

<script lang="ts">
  import type { MuaGiai } from "$lib/typesDatabase";
  import { onMount } from "svelte";
  import { showErrorToast, showOkToast } from "./Toast";
  import { writable } from "svelte/store";
  import dateFormat from "dateformat";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import type { UserGroupUserRoles } from "$lib/typesResponse";

  let {
    dsMuaGiai,
    selectedMuaGiai,
    isAdmin,
    userRoles
  }: {
    dsMuaGiai: MuaGiai[];
    selectedMuaGiai: MuaGiai | null;
    isAdmin: boolean;
    userRoles: UserGroupUserRoles
  } = $props();

  let selectedValue = $state(selectedMuaGiai?.maMG ?? 0);
  let form: HTMLFormElement;

  $inspect(userRoles);

  $effect(() => {
    const muaGiai =
      dsMuaGiai.find((value) => selectedValue == value.maMG) ?? null;
    if (muaGiai !== null) selectedMuaGiai = muaGiai;
    currentMuaGiai.set(selectedMuaGiai);
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
        throw new Error("Không thể thay đổi mùa giải");
      }
      // invalidateAll();
      setTimeout(() => {
        window.location.reload();
      }, 500);
      showOkToast("Chọn mùa giải thành công");
    } catch (err) {
      showErrorToast(String(err));
    }
  };

  // Xử lý logout
  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (e) {
      // ignore error, vẫn chuyển hướng
    }
    goto("/login");
  }
</script>

<aside
  class="fixed top-0 left-0 h-screen z-30 w-[260px] bg-slate-900 text-slate-300 flex flex-col transition-width duration-300"
>
  <div class="flex items-center px-6 pt-6 pb-8">
    <img src="/favicon.png" class="w-10 h-6 mr-3 object-contain" alt="Icon" />
    <span class="text-xl font-bold text-white tracking-wider">Onesport</span>
  </div>

  <div class="px-6 mb-8">
    <form bind:this={form} onsubmit={onSubmit}>
      <label
        for="muagiai-select"
        class="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider"
        >Mùa Giải</label
      >
      <select
        id="muagiai-select"
        onchange={() => form.requestSubmit()}
        class="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-md focus:ring-purple-500 focus:border-purple-500 block p-2.5 shadow-sm"
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
    class="text-slate-500 text-xs font-semibold mb-3 px-6 uppercase tracking-wider"
    >Menu</span
  >
  <nav class="flex-grow overflow-y-auto">
    <ul class="space-y-1.5 px-4">
      <!-- REPLACED: Emojis with more professional SVG icons. -->
      <li>
        <a href="/" class="nav-link" class:active={page.url.pathname === "/"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="nav-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
            />
          </svg>
          <span>Trang chủ</span>
        </a>
      </li>
      {#if userRoles.roles.filter((value) => "/cauthu".match(value.viewablePage)).length > 0}
        <li>
          <a
            href="/cauthu"
            class="nav-link"
            class:active={page.url.pathname.startsWith("/cauthu")}
            >
              <svg
              xmlns="http://www.w3.org/2000/svg"
              class="nav-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
              >
                <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
                />
              </svg>
            <span>Cầu thủ</span>
          </a>
        </li>
      {/if}
      {#if userRoles.roles.filter((value) => "/doi".match(value.viewablePage)).length > 0}
      <li>
        <a
          href="/doi"
          class="nav-link"
          class:active={page.url.pathname.startsWith("/doi")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="nav-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fill-rule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Đội</span>
        </a>
      </li>
      {/if}
      {#if userRoles.roles.filter((value) => "/trandau".match(value.viewablePage)).length > 0}
      <li>
        <a
          href="/trandau"
          class="nav-link"
          class:active={page.url.pathname.startsWith("/trandau")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="nav-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1 2a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H6a1 1 0 01-1-1V4zm4 0a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1V4zm4 0a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1V4zm-8 4a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H6a1 1 0 01-1-1V8zm4 0a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1V8zm4 0a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1V8zm-8 4a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1zm4 0a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1zm4 0a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Trận đấu</span>
        </a>
      </li>
      {/if}
      {#if userRoles.roles.filter((value) => "/bxh".match(value.viewablePage)).length > 0}
      <li>
        <a
          href={"/bxh"}
          class="nav-link"
          class:active={page.url.pathname.startsWith("/bxh")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="nav-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"
            />
          </svg>
          <span>Bảng xếp hạng</span>
        </a>
      </li>
      {/if}
      {#if userRoles.roles.filter((value) => "/muagiai".match(value.viewablePage)).length > 0}
      <li>
        <a
          href="/muagiai"
          class="nav-link"
          class:active={page.url.pathname === "/muagiai"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="nav-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Mùa giải</span>
        </a>
      </li>
      {/if}
      {#if userRoles.roles.filter((value) => "/caidat".match(value.viewablePage)).length > 0}
        <li>
          <a
            href="/caidat"
            class="nav-link"
            class:active={page.url.pathname === "/caidat"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="nav-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Cài đặt</span>
          </a>
        </li>
      {/if}
    </ul>
  </nav>

  <!-- Logout Button -->
  <div class="mt-auto p-4">
    <button
      class="w-full cursor-pointer flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
      onclick={logout}
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 pt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span class="font-medium pr-8">Đăng xuất</span>
    </button>
  </div>
</aside>

<!-- ADDED: New styles for the redesigned sidebar -->
<style>
  .nav-link {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    border-radius: 8px;
    text-decoration: none;
    color: #cbd5e1; /* slate-300 */
    font-size: 15px;
    font-weight: 500;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
  }
  .nav-link:hover {
    background-color: #334155; /* slate-700 */
    color: #ffffff; /* white */
  }
  .nav-link.active {
    background-color: #7c3aed; /* purple-600 */
    color: #ffffff;
    font-weight: 600;
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
  .nav-icon {
    width: 20px;
    height: 20px;
    margin-right: 14px;
  }
</style>
