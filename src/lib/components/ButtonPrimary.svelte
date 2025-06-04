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
  class="bg-purple-600 mb-4 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-md cursor-pointer text-base font-semibold"
  onclick={hanldeClick}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseExit}
>
  {text}
</button>
