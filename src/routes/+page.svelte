<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";

  const handleClickBtn = () => {
    alert("You clicked me nigga!");
  };
</script>

<svelte:head>
  <title>Trang chủ</title>
</svelte:head>

<h1>This is dashboard</h1>
<ButtonPrimary text={"Click me daddy"} onclick={handleClickBtn} />
