<script lang="ts">
  import ButtonPrimary from "$lib/components/ButtonPrimary.svelte";

  const handleClickBtn = () => {
    alert("You clicked me nigga!");
  };
</script>

<svelte:head>
  <title>Trang chủ</title>
</svelte:head>

<div class="page-content">
  <h1 class="content-title text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
  <div class="title-underline w-36 h-1 bg-purple-600 mb-8"></div>

  <p class="text-gray-600 mb-6">Chào mừng đến với trang quản lý giải đấu.</p>

  <ButtonPrimary text={"Thao tác mẫu"} onclick={handleClickBtn} />

  <!-- You can add more dashboard elements here, styled accordingly -->
  <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 class="text-xl font-semibold text-gray-700 mb-3">Thông tin nhanh</h2>
      <p class="text-gray-600">Hiện tại chưa có dữ liệu thống kê.</p>
    </div>
    <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 class="text-xl font-semibold text-gray-700 mb-3">
        Hoạt động gần đây
      </h2>
      <p class="text-gray-600">Không có hoạt động nào được ghi nhận.</p>
    </div>
  </div>
</div>
