<script lang="ts">
  let { text, onclick }: { text: string; onclick: Function } = $props();

  const hanldeClick = () => {
    onclick();
  };
</script>

<button
  type="submit"
  class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer"
  onclick={hanldeClick}
>
  {text}
</button>
