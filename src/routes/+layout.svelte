<script lang="ts">
  import "../app.css";
  import Nav from "$lib/components/Nav.svelte";
  import { page } from "$app/state";
  let { children, data } = $props();
</script>

{#if !page.url.pathname.startsWith("/login") && !page.url.pathname.startsWith("/signup") && !page.url.pathname.startsWith("/forgot")}
  <div class="app-layout flex w-full min-h-screen">
    <Nav dsMuaGiai={data.dsMuaGiai} selectedMuaGiai={data.selectedMuaGiai} />
    <div
      class="main-wrapper flex-grow flex flex-col bg-white pl-[260px] pb-[60px]"
    >
      <main
        id="content-area"
        class="content-area flex-grow p-[30px] overflow-y-auto bg-[#f9f9f9]"
        style="min-height:0;"
      >
        {@render children()}
      </main>
    </div>
  </div>
{:else}
  <main class="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
    {@render children()}
  </main>
{/if}

<footer
  class="footer fixed bottom-0 left-0 w-full pl-[260px] py-[15px] px-[30px] bg-white border-t border-[#e0e0e0] text-center text-[#888] text-[13px] z-20"
  style="display: {page.url.pathname.startsWith('/login') ||
  page.url.pathname.startsWith('/signup') ||
  page.url.pathname.startsWith('/forgot')
    ? 'none'
    : 'block'}"
>
  &copy; {new Date().getFullYear()} Onesport Application. Mọi quyền được bảo lưu.
</footer>
