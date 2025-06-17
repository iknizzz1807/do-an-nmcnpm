<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import { showErrorToast } from "$lib/components/Toast";
  import type { PageProps } from "./$types";
  let { form }: PageProps = $props();
  let inputEmail = $state("");
  let inputUsername = $state("");
  let inputPassword = $state("");
</script>

<svelte:head>
  <title>Đăng ký tài khoản mới</title>
</svelte:head>

<div class="fixed inset-0 flex items-center justify-center bg-gray-100">
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
      Đăng ký tài khoản
    </h1>
    <p class="text-center text-gray-500 mb-8">
      Tham gia quản lý giải bóng đá quốc gia!
    </p>
    <form
      method="POST"
      use:enhance={({ formElement, formData, action, cancel, submitter }) => {
        return async ({ result, update }) => {
          if (result.type == "failure" && (result.data ?? null) != null) {
            const message = String(result.data!!.message);
            showErrorToast(message);
          } else await applyAction(result);
        };
      }}
    >
      <div class="mb-5">
        <label
          for="inputEmail"
          class="block text-gray-700 text-sm font-semibold mb-2">Email</label
        >
        <input
          type="email"
          id="inputEmail"
          name="email"
          class="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          autocomplete="email"
          required
          bind:value={inputEmail}
        />
      </div>
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
          autocomplete="new-password"
          bind:value={inputPassword}
          required
        />
      </div>
      <div class="flex flex-col items-center gap-4">
        <button
          class="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Đăng ký
        </button>
        <a
          href="/login"
          class="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg transition-all"
          >Đã có tài khoản? Đăng nhập</a
        >
      </div>
      {#if form?.message}
        <p class="mt-5 text-center text-red-600 font-semibold">
          {form.message}
        </p>
      {/if}
    </form>
  </div>
</div>
