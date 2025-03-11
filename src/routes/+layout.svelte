<script lang="ts">
  import "../app.css";
  import Nav from "$lib/components/Nav.svelte";
  let { children, data } = $props();
</script>

<Nav dsMuaGiai={data.dsMuaGiai} selectedMuaGiai={data.selectedMuaGiai} />
<div style="padding-left: 10%; padding-right: 10%;">
  {@render children()}
</div>
