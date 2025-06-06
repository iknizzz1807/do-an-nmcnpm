<script lang="ts">
  import { fly } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import dateFormat from "dateformat";

  // --- Dữ liệu Giả lập cho Dashboard ---
  // Bạn sẽ thay thế phần này bằng dữ liệu thật từ `let { data } = $props()`
  let user = {
    username: "Adminstrator", // Lấy từ data.user.username
    role: "Admin", // Lấy từ data.user.role
  };

  // Lối tắt truy cập nhanh
  const quickAccessLinks = [
    {
      title: "Quản lý Đội bóng",
      description: "Thêm, sửa, xóa và xem thông tin các đội tham gia.",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z" clip-rule="evenodd" /></svg>`,
      path: "/doi",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Lịch thi đấu",
      description: "Xem, tạo và cập nhật lịch thi đấu cho mùa giải.",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg>`,
      path: "/trandau",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Bảng xếp hạng",
      description: "Theo dõi thứ hạng các đội một cách trực quan.",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>`,
      path: "/bxh/" + dateFormat(new Date(), "isoDate"),
      color: "from-purple-500 to-purple-600",
    },
  ];

  // --- Kết thúc Dữ liệu Giả lập ---

  onMount(() => {});
</script>

<svelte:head>
  <title>Trang chủ - Onesport</title>
</svelte:head>

<div class="page-content space-y-10">
  <!-- Hero Section -->
  <div
    class="relative rounded-xl shadow-2xl overflow-hidden min-h-[300px] flex items-center p-8 md:p-12 bg-cover bg-center"
    style="background-image: url('stadium.png');"
    in:fly={{ y: -30, duration: 500, delay: 200 }}
  >
    <div
      class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-0"
    ></div>
    <div class="relative z-10 text-white max-w-2xl">
      <h1
        class="text-4xl md:text-5xl font-extrabold tracking-tight"
        in:fly={{ y: -20, duration: 400, delay: 400 }}
      >
        Chào mừng, {user.username}
      </h1>
      <div
        class="flex items-center gap-3 mt-3"
        in:fly={{ y: -20, duration: 400, delay: 500 }}
      >
        <span
          class="bg-purple-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg"
          >{user.role}</span
        >
      </div>
      <p
        class="mt-6 text-lg text-gray-200 italic"
        in:fly={{ y: -20, duration: 400, delay: 600 }}
      >
        "Some people think football is a matter of life and death. I don't like
        that attitude. I can assure them it is much more serious than that." -
        Bill Shankly
      </p>
    </div>
  </div>

  <div>
    <h2
      class="text-2xl font-bold text-gray-800 mb-6"
      in:fly={{ y: 20, duration: 400, delay: 700 }}
    >
      Bắt đầu
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each quickAccessLinks as link, i}
        <button
          class="group cursor-pointer text-left p-6 rounded-xl shadow-lg hover:shadow-2xl bg-gradient-to-br {link.color} text-white transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
          onclick={() => goto(link.path)}
          in:fly={{ y: 20, duration: 400, delay: 800 + i * 100 }}
        >
          <div class="flex flex-col h-full">
            <div class="text-white/80 group-hover:text-white transition-colors">
              {@html link.icon}
            </div>
            <h3 class="text-xl font-bold mt-4">{link.title}</h3>
            <p class="mt-2 text-white/90 flex-grow">
              {link.description}
            </p>
            <div
              class="mt-4 text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Truy cập ngay
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>
