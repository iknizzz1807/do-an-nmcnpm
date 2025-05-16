<script lang="ts">
  import "../app.css";
  import Nav from "$lib/components/Nav.svelte";
  let { children, data } = $props();
</script>

<div class="app-layout flex w-full min-h-screen bg-gray-100">
  <Nav dsMuaGiai={data.dsMuaGiai} selectedMuaGiai={data.selectedMuaGiai} />

  <div class="main-wrapper flex-grow flex flex-col bg-white">
    <header
      class="header h-16 flex items-center bg-white border-b border-gray-200 px-6 shadow-sm flex-shrink-0 z-10"
    >
      <!-- Simplified Header Content -->
      <div class="flex items-center">
        <!-- You can add a smaller logo or title here if needed -->
        <!-- <img src={appLogoUrl} class="h-8 w-auto mr-3" alt="App Logo"> -->
        <h1 class="text-xl font-semibold text-gray-700">League Manager</h1>
      </div>
      <div class="ml-auto flex items-center space-x-4">
        <!-- Placeholder for user profile/actions if you add them later -->
        <!-- <img src="/path-to-avatar.jpg" class="w-9 h-9 rounded-full object-cover" alt="User Avatar"> -->
      </div>
    </header>

    <main
      id="content-area"
      class="content-area flex-grow p-6 md:p-8 overflow-y-auto bg-gray-50"
    >
      {@render children()}
    </main>

    <footer
      class="footer py-4 px-6 bg-white border-t border-gray-200 text-center text-gray-500 text-xs flex-shrink-0"
    >
      &copy; {new Date().getFullYear()} Onesport Application. Mọi quyền được bảo
      lưu.
    </footer>
  </div>
</div>
