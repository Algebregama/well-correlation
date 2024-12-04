<script lang="ts">
  import { wells, selectedPaperSize } from "../../stores/wellStore";
  import { createWellVisualization } from "../../utils/visualization";

  const generateVisualization = () => {
    const chart = createWellVisualization($wells, $selectedPaperSize);
    const chartdiv = document.getElementById("chart");
    if (chart) {
      chartdiv?.append(chart);
    }
  };
</script>

<div class="space-y-6">
  <h3 class="text-lg font-medium">Review Data</h3>

  <div class="space-y-4">
    {#each $wells as well}
      <div class="bg-gray-50 p-4 rounded-lg">
        <h4 class="font-medium">{well.wellName}</h4>
        <p>Location: {well.location}</p>
        <p>Formations: {well.formations.length}</p>
      </div>
    {/each}
  </div>

  <div class="bg-gray-50 p-4 rounded-lg">
    <h4 class="font-medium">Paper Size</h4>
    <p>
      {$selectedPaperSize.name} ({$selectedPaperSize.width}mm × {$selectedPaperSize.height}mm)
    </p>
  </div>

  <button
    on:click={generateVisualization}
    class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
  >
    Generate Chart
  </button>
</div>
<div id="chart"></div>
