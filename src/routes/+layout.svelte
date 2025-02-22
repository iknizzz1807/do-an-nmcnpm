<script lang="ts">
  import "../app.css";
  import Nav from "$lib/components/Nav.svelte";
  let { children } = $props();
</script>

<Nav />
<div style="padding-left: 10%; padding-right: 10%;">
  {@render children()}
</div>
