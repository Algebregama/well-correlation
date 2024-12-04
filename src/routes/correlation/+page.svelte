<script lang="ts">
  import FileUpload from "$lib/components/steps/FileUpload.svelte";
  import WellInfo from "$lib/components/steps/WellInfo.svelte";
  import FormationData from "$lib/components/steps/FormationData.svelte";
  import PaperSize from "$lib/components/steps/PaperSize.svelte";
  import Confirmation from "$lib/components/steps/Confirmation.svelte";
  import ProgressBar from "$lib/components/ProgressBar.svelte";
  import Navigation from "$lib/components/Navigation.svelte";
  import { currentStep, wells } from "$lib/stores/wellStore";
  import type { Step } from "$lib/types/well";

  const steps: Step[] = [
    {
      label: "Upload Files",
      component: FileUpload,
      isValid: () => $wells.length > 1,
    },
    {
      label: "Well Information",
      component: WellInfo,
      isValid: () => $wells.every((well) => well.wellName && well.location),
    },
    {
      label: "Formation Data",
      component: FormationData,
      isValid: () => $wells.every((well) => well.formations.length > 0),
    },
    {
      label: "Paper Size",
      component: PaperSize,
      isValid: () => true,
    },
    {
      label: "Confirmation",
      component: Confirmation,
      isValid: () => true,
    },
  ];
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <h1 class="text-3xl font-bold mb-8">Well Data Visualization</h1>

  <ProgressBar {steps} />

  <div class="bg-white shadow-md rounded-lg p-6">
    <svelte:component this={steps[$currentStep].component} />
  </div>

  <Navigation {steps} />
</div>
