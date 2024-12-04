<script lang="ts">
  import { currentStep, resetWells } from '../stores/wellStore';
  import type { Step } from '../types/well';

  export let steps: Step[];

  const previousStep = () => {
    if ($currentStep > 0) {
      $currentStep--;
    }
  };

  const nextStep = () => {
    if ($currentStep < steps.length - 1 && steps[$currentStep].isValid()) {
      $currentStep++;
    }
  };

  const clearStep = () => {
    // Implementation depends on specific step requirements
  };
</script>

<div class="flex justify-between mt-8">
  <button
    on:click={previousStep}
    disabled={$currentStep === 0}
    class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50
           disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Back
  </button>

  <div class="space-x-4">
    <button
      on:click={clearStep}
      class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
    >
      Clear Step
    </button>
    <button
      on:click={resetWells}
      class="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
    >
      Reset All
    </button>
  </div>

  <button
    on:click={nextStep}
    disabled={!steps[$currentStep].isValid()}
    class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600
           disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {$currentStep === steps.length - 1 ? 'Finish' : 'Next'}
  </button>
</div>