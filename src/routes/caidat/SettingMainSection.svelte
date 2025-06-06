<script lang="ts">
  let { children, sectionName }: { children: any; sectionName: string } =
    $props();
</script>

<section class="mb-10">
  <h1 class="content-subtitle text-2xl font-semibold text-gray-800 mb-2">
    {sectionName}
  </h1>
  <div class="title-underline w-32 h-0.5 bg-green-500 mb-6"></div>
  <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    {@render children()}
  </div>
</section>
