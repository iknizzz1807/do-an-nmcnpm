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
  class="bg-green-600 mb-4 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md cursor-pointer text-base font-semibold transition-all duration-200 transform hover:-translate-y-0.5"
  onclick={hanldeClick}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseExit}
>
  {text}
</button>
