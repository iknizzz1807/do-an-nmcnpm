<script lang="ts">
  type Props = {
    min: number,
    max: number,
    bindValue: number,
    label: string,
    unit: string,
  }
  let { min, max, bindValue = $bindable(), label, unit } : Props = $props();  
</script>


<div>
  <label class="block text-sm font-medium text-gray-700 mb-2"
    >{label}</label
  >
  <div class="flex items-center">
    <input
      type="number"
      bind:value={bindValue}
      min={min}
      max={max}
      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
    />
    <span class="ml-2 text-gray-500">{unit}</span>
  </div>
</div>