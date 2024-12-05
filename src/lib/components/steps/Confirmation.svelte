<script lang="ts">
  import { wells, selectedPaperSize } from "../../stores/wellStore";
  import { createWellVisualization } from "../../utils/visualization";
import { jsPDF } from "jspdf";
  let svgNode: SVGSVGElement | null = null;

  const generateVisualization = () => {
    const chart = createWellVisualization($wells, $selectedPaperSize);
    const chartdiv = document.getElementById("chart");

    // Supprimer le précédent graphique
    chartdiv?.replaceChildren();

    if (chart) {
      chartdiv?.append(chart);
      svgNode = chart as SVGSVGElement;
    }
  };

  const printChart = () => {
    if (!svgNode) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(svgNode.outerHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const downloadAsImage = () => {
    if (!svgNode) return;

    const svgData = new XMLSerializer().serializeToString(svgNode);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      canvas.width = svgNode.clientWidth;
      canvas.height = svgNode.clientHeight;
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      // Télécharger comme image
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = url;
  };

  const downloadAsPDF = async () => {
    if (!svgNode) return;

    const svgData = new XMLSerializer().serializeToString(svgNode);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = async () => {
      canvas.width = svgNode.clientWidth;
      canvas.height = svgNode.clientHeight;
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [$selectedPaperSize.width, $selectedPaperSize.height],
      });
      const imgData = canvas.toDataURL("image/png");

      pdf.addImage(imgData, "PNG", 0, 0, $selectedPaperSize.width, $selectedPaperSize.height);
      pdf.save("chart.pdf");
    };
    img.src = url;
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

  <!-- Boutons pour les actions -->
  <div class="flex space-x-4 mt-4">
    <button
      on:click={printChart}
      class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
    >
      Print
    </button>
    <button
      on:click={downloadAsImage}
      class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
    >
      Download as Image
    </button>
    <button
      on:click={downloadAsPDF}
      class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
    >
      Download as PDF
    </button>
  </div>
</div>

<div id="chart"></div>
