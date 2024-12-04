<script lang="ts">
  import { currentStep } from '../stores/wellStore';
  import type { Step } from '../types/well';

  export let steps: Step[];
</script>

<div class="flex justify-between mb-8">
  {#each steps as step, index}
    <div class="flex items-center">
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center
          {$currentStep === index ? 'bg-blue-500 text-white' :
           $currentStep > index ? 'bg-green-500 text-white' :
           'bg-gray-200 text-gray-700'}"
      >
        {index + 1}
      </div>
      <div class="ml-2 text-sm font-medium text-gray-700">{step.label}</div>
      {#if index < steps.length - 1}
        <div class="w-full h-0.5 mx-4 bg-gray-200"></div>
      {/if}
    </div>
  {/each}
</div>