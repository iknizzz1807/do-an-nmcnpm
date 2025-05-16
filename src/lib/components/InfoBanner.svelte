<script lang="ts">
  let { text, num }: { text: string; num: number } = $props();
</script>

<main>
  <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <h3 class="text-lg font-medium text-gray-700">{text}</h3>
    <p class="text-4xl font-bold text-purple-600 mt-1">{num}</p>
  </div>
</main>
