import { writable } from 'svelte/store';
import type { WellData, PaperSize } from '../types/well';

export const wells = writable<WellData[]>([]);
export const currentStep = writable(0);
export const selectedPaperSize = writable<PaperSize>({
  width: 210,
  height: 297,
  name: 'A4'
});

export const resetWells = () => {
  wells.set([]);
  currentStep.set(0);
};