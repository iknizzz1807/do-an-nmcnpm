<script lang="ts">
  let { children, sectionName }: { children: any; sectionName: string } =
    $props();
</script>

<div class="mb-8">
  <h2 class="text-xl font-semibold text-gray-700 mb-4">{sectionName}</h2>
  <div
    class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-md border border-gray-200"
  >
    {@render children()}
  </div>
</div>
