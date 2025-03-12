<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
  import { showErrorToast } from "$lib/components/Toast";
  import type { PageProps } from "./$types";
  

  let { form } : PageProps = $props();
  let inputEmail = $state("");
  let inputUsername = $state("");
  let inputPassword = $state("");
</script>

<svelte:head>
  <title>Sign up</title>
</svelte:head>


<div class="fixed inset-0 flex items-center justify-center backdrop-blur-[1px] bg-white/30">
	<div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
		<h1 class="text-xl font-bold mb-4">Sign up</h1>
		<form method="POST" use:enhance={({ formElement, formData, action, cancel, submitter }) => {
	
			return async ({ result, update }) => {
				if (result.type == "failure" && (result.data ?? null) != null) {
					const message = String(result.data!!.message);
					showErrorToast(message);
				}
				else
					await applyAction(result);
				// `result` is an `ActionResult` object
				// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
			};
		}}>
			<div class="mb-4">
				<label for="inputEmail" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
				<input
				type="email"
				id="inputEmail"
				name="email"
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				autocomplete="username"
				required
				bind:value={inputEmail} />
			</div>
			<div class="mb-4">
				<label for="inputUsername" class="block text-gray-700 text-sm font-bold mb-2">Username</label>
				<input
				type="username"
				id="inputUsername"
				name="username"
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				autocomplete="username"
				required
				bind:value={inputUsername} />
			</div>
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
		</form>
		<a href="/login" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">Login</a>
	</div>
</div>
