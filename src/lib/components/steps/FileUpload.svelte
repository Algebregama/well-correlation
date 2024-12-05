<script lang="ts">
  import { wells } from "../../stores/wellStore";
  import { parseCSV, parseLAS } from "../../utils/fileParser";
  import type { WellData } from "../../types/well";

  let files: FileList;
  let validationMessage = "";
  let isLoading = false;

  const validateFiles = (event: Event) => {
    const input = event.target as HTMLInputElement;
    console.log("input.files", input.files);
    if (input.files) {
      files = input.files;
      console.log("length", files.length);

      if (files.length < 2) {
        validationMessage = "Please upload at least 2 files";
        return false;
      }
    }

    for (const file of files) {
      const ext = file.name.split(".").pop().toLowerCase();
      if (ext !== "csv" && ext !== "las") {
        validationMessage = "Only CSV and LAS files are allowed";
        return false;
      }
    }

    validationMessage = "";
    return true;
  };

  const handleUpload = async (event: Event) => {
    event.preventDefault();
    if (!files || !validateFiles(event)) return;

    isLoading = true;
    try {
      const wellData: WellData[] = await Promise.all(
        Array.from(files).map(async (file) => {
          const ext = file?.name?.split(".").pop().toLowerCase();
          const { depth, gr, wellName, start, stop, location, unit, id } =
            ext === "csv" ? await parseCSV(file) : await parseLAS(file);
          return {
            fileName: file.name,
            type: ext as "csv" | "las",
            wellName: wellName,
            location: location,
            start,
            stop,
            depth,
            gr,
            unit,
            id,
            formations: [],
          };
        })
      );

      wells.set(wellData);
    } catch (error: Error) {
      validationMessage = error.message;
    } finally {
      isLoading = false;
    }
  };
</script>

<form on:submit={handleUpload} class="space-y-4">
  <div class="flex flex-col bg-white dark:bg-gray-700">
    <label class="text-sm font-medium text-gray-700">Upload Well Files</label>
    <input
      type="file"
      accept=".csv,.las"
      multiple
      required
      on:change={validateFiles}
      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
    />
  </div>

  {#if validationMessage}
    <div class="text-red-500 text-sm">{validationMessage}</div>
  {/if}

  <button
    type="submit"
    class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={!!validationMessage || isLoading}
  >
    {#if isLoading}
      Processing...
    {:else}
      Upload Files
    {/if}
  </button>
</form>
