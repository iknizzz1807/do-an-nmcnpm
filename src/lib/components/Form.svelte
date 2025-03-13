<script lang="ts" module>
  export type FieldOption =  {
    optionValue: string | number,
    optionName: string
  }
  export type FormField = {
    label : string,
    propertyName: string,
    type: "input" | "select" | "Date",
    valueType: "string" | "number" | "Date",
    options?: FieldOption[],
  }
  export type FormInputMap = Map<string, string | number | Date>;
</script>

<script lang="ts">
  
  type Props = {
    fields: FormField[],
    formState : Boolean,
    submitForm: (e: Event) => void,
    // Return empty to open form, another map to open edit form, null to ignore
    onOpenForm?: (() => FormInputMap | null),
    onCloseForm?: (() => void)
  }
  let { formState = $bindable(), submitForm, onOpenForm, fields } : Props = $props();
  let inputValues : FormInputMap = $state(new Map());

  for (const field of fields) {
    switch(field.valueType) {
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

  $effect(() => {
    if (formState)
      openForm();
    else
      closeForm();
  }) 

  const openForm = () => {
    const map = onOpenForm?.() ?? null;
    if (map){
      if (map.size > 0)
        inputValues = map;
      formState = true;
    }
    else
      closeForm();
  };

  const closeForm = () => {
    formState = false;
    for (const field of fields) {
      if (field.valueType === "string")
        inputValues.set(field.propertyName, "");
      if (field.valueType === "number")
        inputValues.set(field.propertyName, 0);
    }
  };
</script>

{#if formState}
  <div
    class="fixed inset-0 flex items-center justify-center backdrop-blur-[1px] bg-white/30"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Tạo đội bóng mới</h2>
      <form onsubmit={submitForm}>
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
                      inputValues.set(field.propertyName, val!!)
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
                    if ((val ?? null) !== null)
                      inputValues.set(field.propertyName, val!!)
                  }
                }
              >
                {#each field.options!! as option}
                  <option value={option.optionValue}>{option.optionName}</option>
                {/each}
              </select>
            {:else if field.type === "Date"}
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for={field.propertyName}
              >
                {field.label}
              </label>
              <input
                id={field.propertyName}
                type="datetime-local"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                bind:value={
                  () => inputValues.get(field.propertyName),
                  (val) => {
                    if ((val ?? null) !== null)
                      inputValues.set(field.propertyName, val!!)
                  }
                }
              />
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
            onclick={submitForm}
          >
            Tạo
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}