<script lang="ts">
  let { children, sectionName }: { children: any; sectionName: string } =
    $props();
</script>

<section
  class="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200"
>
  <h1 class="text-2xl font-bold text-gray-800 mb-2">
    {sectionName}
  </h1>
  <div class="title-underline w-32 h-1 bg-green-500 mb-6"></div>

  <div class="space-y-8">
    {@render children()}
  </div>
</section>
