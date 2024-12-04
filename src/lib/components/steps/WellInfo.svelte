<script lang="ts">
  import { wells } from "../../stores/wellStore";

  const handleWellInfo = () => {
    // Store is automatically updated through bindings
  };
</script>

<form on:submit|preventDefault={handleWellInfo} class="space-y-6">
  {#each $wells as well, index}
    {console.log(well.wellName)}
    <div class="bg-gray-50 p-4 rounded-lg space-y-4">
      <h3 class="font-medium">Well {index + 1}: {well.fileName}</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col">
          <label for="wellName" class="text-sm font-medium text-gray-700"
            >Well Name</label
          >
          <input
            type="text"
            id="wellName"
            bind:value={well.wellName}
            placeholder="Well Name"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div class="flex flex-col">
          <label for="location" class="text-sm font-medium text-gray-700"
            >Location</label
          >
          <input
            type="text"
            id="location"
            bind:value={well.location}
            placeholder="Location"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>
    </div>
  {/each}

  <button
    type="submit"
    class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
  >
    Save Well Information
  </button>
</form>
