<script lang="ts">
  import { wells } from "../../stores/wellStore";
  import type { Formation } from "../../types/well";
  import { writable } from "svelte/store";

  let formationCount = 1;

  // Fonction pour ajouter une nouvelle formation
  const addFormation = () => {
    $wells = $wells.map((well) => ({
      ...well,
      formations: [
        ...well.formations,
        {
          name: `Formation ${well.formations.length + 1}`,
          topDepth: 0,
          thickness: 0,
          color: "#000000",
        },
      ],
    }));
  };

  // Fonction pour supprimer une formation
  const removeFormation = (index: number) => {
    $wells = $wells.map((well) => ({
      ...well,
      formations: well.formations.filter((_, i) => i !== index),
    }));
  };

  // Synchronisation automatique entre les puits
  $: if ($wells.length > 0) {
    const firstFormation = $wells[0].formations[0];
    if (firstFormation) {
      $wells = $wells.map((well, i) => {
        if (i === 0) return well; // Ignorer le premier puits (source de vérité)
        if (well.formations[0]) {
          well.formations[0].name = firstFormation.name;
          well.formations[0].color = firstFormation.color;
        }
        return well;
      });
    }
  }

  // Réorganisation des puits (drag-and-drop)
  let draggedIndex: number | null = null;

  const onDragStart = (index: number) => {
    draggedIndex = index;
  };

  const onDrop = (index: number) => {
    if (draggedIndex === null) return;
    const reorderedWells = [...$wells];
    const [removed] = reorderedWells.splice(draggedIndex, 1);
    reorderedWells.splice(index, 0, removed);
    $wells = reorderedWells;
    draggedIndex = null;
  };

  $: {
    const diff = formationCount - ($wells[0]?.formations.length || 0);
    if (diff > 0) {
      for (let i = 0; i < diff; i++) addFormation();
    } else if (diff < 0) {
      for (let i = 0; i < -diff; i++)
        removeFormation($wells[0].formations.length - 1);
    }
  }
</script>

<div class="space-y-6">
  <div class="flex flex-col">
    <label class="text-sm font-medium text-gray-700">Number of Formations</label
    >
    <input
      type="number"
      bind:value={formationCount}
      min="1"
      required
      class="mt-1 block w-48 border border-gray-300 rounded-md shadow-sm"
    />
  </div>

  <div>
    {#each $wells as well, wellIndex (well.id)}
      <div
        class="bg-gray-50 p-4 rounded-lg space-y-4"
        draggable="true"
        on:dragstart={() => onDragStart(wellIndex)}
        on:drop={() => onDrop(wellIndex)}
        on:dragover={(e) => e.preventDefault()}
      >
        <h3 class="font-medium">
          Formations for {well.wellName || `Well ${wellIndex + 1}`} [start: {well.start.toFixed(
            0
          )}
          {well.unit.toLocaleLowerCase()}, stop: {well.stop.toFixed(0)}
          {well.unit.toLocaleLowerCase()}]
        </h3>

        {#each well.formations as formation, formationIndex}
          <div class="grid grid-cols-4 gap-4">
            <!-- Nom de la formation -->
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700"
                >Formation Name</label
              >
              <input
                type="text"
                bind:value={formation.name}
                placeholder="Enter formation name"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <!-- Couleur de la formation -->
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700"
                >Formation Color</label
              >
              <input
                type="color"
                bind:value={formation.color}
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <!-- Profondeur supérieure -->
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700">Top Depth</label>
              <input
                type="number"
                bind:value={formation.topDepth}
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <!-- Épaisseur -->
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700">Thickness</label>
              <input
                type="number"
                bind:value={formation.thickness}
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>
