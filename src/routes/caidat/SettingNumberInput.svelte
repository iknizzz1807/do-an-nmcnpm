<script lang="ts">
  type Props = {
    min: number;
    max: number;
    bindValue: number;
    forValue: string;
    label: string;
    unit: string;
  };
  let {
    min,
    max,
    forValue,
    bindValue = $bindable(),
    label,
    unit,
  }: Props = $props();
</script>

<div>
  <label class="block text-sm font-medium text-gray-700 mb-1" for={forValue}
    >{label}</label
  >
  <div class="flex items-center">
    <input
      type="number"
      id={forValue}
      name={forValue}
      bind:value={bindValue}
      {min}
      {max}
      class="block w-full rounded-md bg-white border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm py-2 px-3"
    />
    {#if unit}
      <span class="ml-3 text-gray-500 text-sm">{unit}</span>
    {/if}
  </div>
</div>
