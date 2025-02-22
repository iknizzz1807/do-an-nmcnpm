<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";

  type DoiBong = {
    tenDoi: string;
    sanNha: string;
  };

  const taoDoiBong = () => {
    // Gửi post request đến /api/taodoibong
  };
</script>

<ButtonPrimary text="Tạo đội bóng mới" onclick={taoDoiBong} />
