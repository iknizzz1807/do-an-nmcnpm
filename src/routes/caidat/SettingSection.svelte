<script lang="ts">
  let { children, sectionName } : { children: any, sectionName: string } = $props();
</script>

<div class="mb-8">
  <h2 class="text-2xl font-bold text-gray-800 mb-4">{sectionName}</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {@render children()}
  </div>
</div>