<script lang="ts">
  let { text, onclick, onmouseenter, onmouseexit }: 
    { text: string; onclick: Function, onmouseenter?: Function, onmouseexit?: Function } = $props();

  const hanldeClick = () => {
    onclick();
  };

  const handleMouseEnter = () => {
    onmouseenter?.();
  }
  const handleMouseExit = () => {
    onmouseenter?.();
  }
</script>

<button
  type="submit"
  class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer"
  onclick={hanldeClick}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseExit}
>
  {text}
</button>
