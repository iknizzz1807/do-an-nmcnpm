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
    min?: string | number | undefined;
    max?: string | number | undefined;
  };
  export type FormInputMap = SvelteMap<string, string | number | Date | null>;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { SvelteMap } from "svelte/reactivity";
  import dateFormat from "dateformat";

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
    class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50 p-4"
  >
    <div
      class="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-lg transform transition-all border border-gray-200"
    >
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">
        Thông tin chi tiết
      </h2>
      <form
        onsubmit={(e: Event) => submitForm(e, Object.fromEntries(inputValues))}
      >
        {#each fields as field}
          <div class="mb-5">
            {#if field.type === "input"}
              <label
                class="block text-gray-700 text-sm font-medium mb-1.5"
                for={field.propertyName}
              >
                {field.label}
              </label>
              <input
                id={field.propertyName}
                {...{
                  type: field.valueType === "string" ? "text" : "number",
                  max: field.max,
                  min: field.min,
                }}
                class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2.5 px-3.5 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                class="block text-gray-700 text-sm font-medium mb-1.5"
                for={field.propertyName}
              >
                {field.label}
              </label>
              <select
                id={field.propertyName}
                class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2.5 px-3.5 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                class="block text-gray-700 text-sm font-medium mb-1.5"
                for={field.propertyName}
              >
                {field.label}
              </label>
              <input
                id={field.propertyName}
                {...{
                  type:
                    field.valueType === "DateTime" ? "datetime-local" : "date",
                }}
                min={field.min}
                max={field.max}
                class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2.5 px-3.5 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
                bind:value={
                  () => {
                    const value = inputValues.get(field.propertyName);
                    if (value instanceof Date) {
                      if (field.valueType === "DateTime") {
                        const date = dateFormat(value, "isoDateTime").slice(
                          0,
                          19
                        );
                        return date;
                      } else {
                        const date = dateFormat(value, "isoDate");
                        return date;
                      }
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
          </div>
        {/each}
        <div class="flex justify-end space-x-3.5 mt-10">
          <button
            type="button"
            class="px-5 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            onclick={closeForm}
          >
            Hủy
          </button>
          <button
            type="submit"
            class="px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            onclick={(e: Event) =>
              submitForm(e, Object.fromEntries(inputValues))}
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
