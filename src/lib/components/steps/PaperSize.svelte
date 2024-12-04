<script lang="ts">
  import { selectedPaperSize } from '../../stores/wellStore';
  import type { PaperSize } from '../../types/well';

  const paperSizes: Record<string, PaperSize> = {
    A0: { width: 841, height: 1189, name: 'A0' },
    A1: { width: 594, height: 841, name: 'A1' },
    A2: { width: 420, height: 594, name: 'A2' },
    A3: { width: 297, height: 420, name: 'A3' },
    A4: { width: 210, height: 297, name: 'A4' },
  };

  let customSize = false;
  let customWidth = 210;
  let customHeight = 297;

  const handleSizeChange = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    if (select.value === 'custom') {
      customSize = true;
      $selectedPaperSize = { width: customWidth, height: customHeight, name: 'Custom' };
    } else {
      customSize = false;
      $selectedPaperSize = paperSizes[select.value];
    }
  };
</script>

<div class="space-y-6">
  <div class="flex flex-col">
    <label class="text-sm font-medium text-gray-700">Paper Size</label>
    <select
      on:change={handleSizeChange}
      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
    >
      {#each Object.entries(paperSizes) as [key, size]}
        <option value={key}>{key} ({size.width}mm × {size.height}mm)</option>
      {/each}
      <option value="custom">Custom Size</option>
    </select>
  </div>

  {#if customSize}
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700">Width (mm)</label>
        <input
          type="number"
          bind:value={customWidth}
          min="1"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700">Height (mm)</label>
        <input
          type="number"
          bind:value={customHeight}
          min="1"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
    </div>
  {/if}
</div>