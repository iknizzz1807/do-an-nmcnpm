<script lang="ts">
	import { enhance } from "$app/forms";
  import type { PageProps } from "./$types";
  

  let { form } : PageProps = $props();
  let inputPassword = $state("");
</script>

<svelte:head>
  <title>Login Admin</title>
</svelte:head>


<div class="fixed inset-0 flex items-center justify-center backdrop-blur-[1px] bg-white/30">
	<div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
		<h1 class="text-xl font-bold mb-4">Sign in</h1>
		<form method="post" use:enhance>
			<div class="mb-4">
				<label for="inputPassword" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
				<input 
					type="password" 
					id="inputPassword" 
					name="password" 
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					autocomplete="current-password" 
					bind:value={inputPassword} 
					required />
			</div>
			<div class="flex justify-end">
				<button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">Continue</button>
			</div>
			<p class="m-5">{form?.message ?? ""}</p>
		</form>
	</div>
</div>
