import Papa from 'papaparse';
import { Las } from 'las-js';
import { v4 as uuidv4 } from "uuid";
import type { WellData } from '../types/well';

export const parseCSV = (file: File): Promise<{ depth: number[]; gr: number[] }> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const depth = results.data.map(row => row.DEPTH);
        const gr = results.data.map(row => row.GR);
        
        if (!depth.length || !gr.length) {
          reject(new Error('CSV must contain DEPTH and GR columns'));
        }
        
        resolve({ depth, gr });
      },
      error: (error) => reject(error)
    });
  });
};

export const parseLAS = async (file: File): Promise<{ depth: number[]; gr: number[]; wellName: string; location: string, start: number; stop: number; unit: string }> => {
  try {
    const text = await file.text();
    const parsed = new Las(text, {loadFile: false});
    // const myLas = new Las(data, { loadFile: false });
    //const parsed = await las.parse(text);
    const well = await parsed.wellParams()
    const start = Number(well.STRT.value )
    const stop = Number(well.STOP.value)
    const wellName = well.WELL.value
    const location = well.LOC.value
    const unit = well.STRT.unit
  
    const depth = await parsed.column('DEPT');
    const gr = await parsed.column('GR');
    
    if (!depth || !gr) {
      throw new Error('LAS file must contain DEPT/DEPTH and GR curves');
    }
    const id = uuidv4()
    return { depth, gr , wellName, start, stop, location, unit, id};
  } catch (error: Error | any) {
    throw new Error(`Failed to parse LAS file: ${error.message}`);
  }
};

export const validateFormations = (wells: WellData[]): boolean => {
  if (wells.length < 2) return false;
  
  const formationCount = wells[0].formations.length;
  return wells.every(well => well.formations.length === formationCount);
};