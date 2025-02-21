<script lang="ts">
  let { text, num }: { text: string; num: number } = $props();
</script>

<main>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-lg font-semibold text-gray-800">{text}</h3>
    <p class="text-3xl font-bold text-green-600">{num}</p>
  </div>
</main>
