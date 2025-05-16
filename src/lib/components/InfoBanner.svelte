<script lang="ts">
  let { text, num }: { text: string; num: number } = $props();
</script>

<main>
  <div class="bg-white p-5 rounded-lg shadow-md border border-gray-200">
    <h3 class="text-base font-medium text-gray-700">{text}</h3>
    <p class="text-3xl font-bold text-purple-600 mt-1.5">{num}</p>
  </div>
</main>
