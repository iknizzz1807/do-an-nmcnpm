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
  <h1 class="content-title text-[24px] font-semibold text-[#0F0F0F] mb-6">
    Dashboard
  </h1>
  <div class="title-underline w-[154px] h-[4px] bg-[#5642A9] mb-5"></div>

  <p class="text-gray-700 mb-6 text-base">
    Chào mừng đến với trang quản lý giải đấu.
  </p>

  <ButtonPrimary text={"Thao tác mẫu"} onclick={handleClickBtn} />

  <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 class="text-lg font-semibold text-gray-700 mb-3">Thông tin nhanh</h2>
      <p class="text-gray-600">Hiện tại chưa có dữ liệu thống kê.</p>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 class="text-lg font-semibold text-gray-700 mb-3">
        Hoạt động gần đây
      </h2>
      <p class="text-gray-600">Không có hoạt động nào được ghi nhận.</p>
    </div>
  </div>
</div>
