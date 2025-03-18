<script lang="ts">
  let { children, sectionName } : { children: any, sectionName: string} = $props();
</script>

<h1 class="text-3xl font-bold text-gray-800 mb-6">{sectionName}</h1>
<div class="bg-white rounded-lg shadow-md p-6 mb-8">
  {@render children()}
</div>