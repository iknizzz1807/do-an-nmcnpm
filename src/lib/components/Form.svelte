<script lang="ts" module>
  // For option
  export type FieldOption = {
    optionValue: string | number | null;
    optionName: string;
  };
  export type FormField = {
    label: string;
    propertyName: string; // propertyName for map and data conversion to JSON
    type: "input" | "select" | "Date"; // Form type
    valueType: "string" | "number" | "Date" | "DateTime"; // data type
    options?: FieldOption[] | ((data: FormInputMap) => FieldOption[]); // for option, data là object của cái mình đang dùng
  };
  export type FormInputMap = SvelteMap<string, string | number | Date | null>;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { SvelteMap } from "svelte/reactivity";

  type Props = {
    fields: FormField[]; // See above
    formState: Boolean;
    submitForm: (e: Event, data: any) => void;
    onOpenForm?: () => FormInputMap | null; // Return empty to open form, another map to open edit form, null to ignore
    onCloseForm?: () => void;
  };
  let {
    formState = $bindable(),
    submitForm,
    onOpenForm,
    fields,
  }: Props = $props();
  let inputValues: FormInputMap = $state(new SvelteMap());

  onMount(() => {
    for (const field of fields) {
      switch (field.valueType) {
        case "string":
          inputValues.set(field.propertyName, "");
          break;
        case "number":
          inputValues.set(field.propertyName, 0);
          break;
        case "Date":
          inputValues.set(field.propertyName, new Date());
          break;
      }
    }
  });

  $effect(() => {
    if (formState) openForm();
    else closeForm();
  });

  const openForm = () => {
    const map = onOpenForm?.() ?? null;
    if (map) {
      if (map.size > 0) inputValues = map;
      formState = true;
    } else closeForm();
  };

  const closeForm = () => {
    formState = false;
    for (const field of fields) {
      if (field.valueType === "string") inputValues.set(field.propertyName, "");
      if (field.valueType === "number") inputValues.set(field.propertyName, 0);
    }
  };
</script>

{#if formState}
  <div
    class="fixed inset-0 flex items-center justify-center backdrop-blur-[1px] bg-white/30"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Tạo đội bóng mới</h2>
      <form
        onsubmit={(e: Event) => submitForm(e, Object.fromEntries(inputValues))}
      >
        {#each fields as field}
          <div class="mb-4">
            {#if field.type === "input"}
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for={field.propertyName}
              >
                {field.label}
              </label>
              <input
                id={field.propertyName}
                type="text"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                bind:value={
                  () => inputValues.get(field.propertyName),
                  (val) => {
                    if ((val ?? null) !== null)
                      inputValues.set(field.propertyName, val!!);
                  }
                }
              />
            {:else if field.type === "select"}
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for={field.propertyName}
              >
                {field.label}
              </label>

              <select
                id={field.propertyName}
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                bind:value={
                  () => inputValues.get(field.propertyName),
                  (val) => {
                    if ((val ?? null) !== null || val === null)
                      inputValues.set(field.propertyName, val!!);
                  }
                }
              >
                {#if (field.options ?? null) !== null}
                  {#if field.options instanceof Array}
                    {#each field.options as option}
                      <option value={option.optionValue}
                        >{option.optionName}</option
                      >
                    {/each}
                  {:else if field.options instanceof Function}
                    {#each field.options!!(inputValues) as option}
                      <option value={option.optionValue}
                        >{option.optionName}</option
                      >
                    {/each}
                  {/if}
                {/if}
              </select>
            {:else if field.type === "Date"}
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for={field.propertyName}
              >
                {field.label}
              </label>
              {#if field.valueType === "DateTime"}
                <input
                  id={field.propertyName}
                  type="datetime-local"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  bind:value={
                    () => {
                      const value = inputValues.get(field.propertyName);
                      if (value instanceof Date) {
                        return value.toISOString().slice(0, 16);
                      }
                      return value;
                    },
                    (val) => {
                      if (val !== undefined && val !== null) {
                        inputValues.set(field.propertyName, new Date(val));
                      }
                    }
                  }
                />
              {:else}
                <input
                  id={field.propertyName}
                  type="date"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  bind:value={
                    () => {
                      const value = inputValues.get(field.propertyName);
                      if (value instanceof Date) {
                        console.log(value.toISOString().slice(0, 10));
                        return value.toISOString().slice(0, 10);
                      }
                      return value;
                    },
                    (val) => {
                      if (val !== undefined && val !== null) {
                        inputValues.set(field.propertyName, new Date(val));
                      }
                    }
                  }
                />
              {/if}
              
            {/if}
          </div>
        {/each}
        <div class="flex justify-end">
          <button
            type="button"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            onclick={closeForm}
          >
            Hủy
          </button>
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onclick={(e: Event) =>
              submitForm(e, Object.fromEntries(inputValues))}
          >
            Tạo
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
