<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageProps } from "./$types";
  let { form }: PageProps = $props();
  let inputUsername = $state("");
  let inputPassword = $state("");
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<div class="fixed inset-0 flex items-center justify-center bg-gray-100">
  <div
    class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-4 border-green-600 relative"
  >
    <!-- Football Icon -->
    <div class="flex justify-center mb-4">
      <img
        src="/football.svg"
        alt="Football"
        class="w-16 h-16 drop-shadow-lg"
      />
    </div>
    <h1
      class="text-2xl font-extrabold mb-2 text-green-700 text-center tracking-wide font-sans uppercase"
    >
      Quản lý giải bóng đá
    </h1>
    <p class="text-center text-gray-600 mb-6 italic">
      Đăng nhập để bắt đầu quản lý mùa giải!
    </p>
    <form method="post" use:enhance>
      <div class="mb-4">
        <label
          for="inputUsername"
          class="block text-green-800 text-sm font-bold mb-2">Username</label
        >
        <input
          type="text"
          id="inputUsername"
          name="username"
          class="shadow appearance-none border-2 border-green-400 rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:border-yellow-400 focus:shadow-outline"
          autocomplete="username"
          required
          bind:value={inputUsername}
        />
      </div>
      <div class="mb-4">
        <label
          for="inputPassword"
          class="block text-green-800 text-sm font-bold mb-2">Password</label
        >
        <input
          type="password"
          id="inputPassword"
          name="password"
          class="shadow appearance-none border-2 border-green-400 rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:border-yellow-400 focus:shadow-outline"
          autocomplete="current-password"
          bind:value={inputPassword}
          required
        />
      </div>
      <div class="flex justify-center">
        <button
          class="bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white font-extrabold py-2 px-6 rounded-lg flex items-center gap-2 shadow-md transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="white"
              stroke-width="2"
              fill="green"
            />
            <path
              d="M8 12l2 2 4-4"
              stroke="white"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Đăng nhập
        </button>
      </div>
      <p class="m-5 text-center text-red-600 font-semibold">
        {form?.message ?? ""}
      </p>
    </form>
    <div class="flex flex-col md:flex-row justify-between mt-6 gap-2">
      <a
        href="/signup"
        class="flex-1 text-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-150"
        >Tạo tài khoản</a
      >
      <!-- <a
        href="/forgot-password"
        class="flex-1 text-center bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold py-2 px-4 rounded-lg transition-all duration-150"
        >Quên mật khẩu?</a
      > -->
    </div>
  </div>
</div>
