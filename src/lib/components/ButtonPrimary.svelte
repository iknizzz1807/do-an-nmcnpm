<script lang="ts">
  let {
    text,
    onclick,
    onmouseenter,
    onmouseexit,
  }: {
    text: string;
    onclick: Function;
    onmouseenter?: Function;
    onmouseexit?: Function;
  } = $props();

  const hanldeClick = () => {
    onclick();
  };

  const handleMouseEnter = () => {
    onmouseenter?.();
  };
  const handleMouseExit = () => {
    onmouseenter?.();
  };
</script>

<button
  type="submit"
  class="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-sm cursor-pointer text-sm font-medium"
  onclick={hanldeClick}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseExit}
>
  {text}
</button>
