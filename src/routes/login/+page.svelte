<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageProps } from "./$types";
  let { form }: PageProps = $props();
  let inputUsername = $state("");
  let inputPassword = $state("");
</script>

<svelte:head>
  <title>Đăng nhập</title>
</svelte:head>

<div
  class="bg-white rounded-xl shadow-xl p-8 w-full max-w-md border-t-4 border-green-600"
>
  <div class="flex justify-center mb-6">
    <img
      src="/favicon.png"
      alt="Onesport Logo"
      class="w-16 h-10 object-contain"
    />
  </div>
  <h1 class="text-2xl font-bold mb-2 text-gray-800 text-center">
    Quản lý giải bóng đá
  </h1>
  <p class="text-center text-gray-500 mb-8">
    Đăng nhập để bắt đầu quản lý mùa giải!
  </p>
  <form method="post" use:enhance>
    <div class="mb-5">
      <label
        for="inputUsername"
        class="block text-gray-700 text-sm font-semibold mb-2"
        >Tên đăng nhập</label
      >
      <input
        type="text"
        id="inputUsername"
        name="username"
        class="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
        autocomplete="username"
        required
        bind:value={inputUsername}
      />
    </div>
    <div class="mb-6">
      <label
        for="inputPassword"
        class="block text-gray-700 text-sm font-semibold mb-2">Mật khẩu</label
      >
      <input
        type="password"
        id="inputPassword"
        name="password"
        class="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
        autocomplete="current-password"
        bind:value={inputPassword}
        required
      />
    </div>
    <div class="flex flex-col items-center gap-4">
      <button
        class="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
      >
        Đăng nhập
      </button>
      <a
        href="/signup"
        class="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg transition-all"
        >Tạo tài khoản</a
      >
    </div>
    {#if form?.message}
      <p class="mt-5 text-center text-red-600 font-semibold">
        {form.message}
      </p>
    {/if}
  </form>
</div>
