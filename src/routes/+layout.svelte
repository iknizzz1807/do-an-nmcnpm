<script lang="ts">
  import "../app.css";
  import Nav from "$lib/components/Nav.svelte";
  let { children, data } = $props();
</script>

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

  <footer
    class="footer fixed bottom-0 left-0 w-full pl-[260px] py-[15px] px-[30px] bg-white border-t border-[#e0e0e0] text-center text-[#888] text-[13px] z-20"
  >
    &copy; {new Date().getFullYear()} Onesport Application. Mọi quyền được bảo lưu.
  </footer>
</div>
