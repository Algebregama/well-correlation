export interface WellData {
  id: string;
  fileName: string;
  type: 'csv' | 'las';
  wellName: string;
  location: string;
  start: number;
  stop: number
  depth: number[];
  gr: number[];
  unit: string;
  formations: Formation[];
}

export interface Formation {
  name: string;
  topDepth: number;
  thickness: number;
  color?: string;
}

export interface PaperSize {
  width: number;
  height: number;
  name: string;
}

export interface Step {
  label: string;
  component: any;
  isValid: () => boolean;
}

export interface WellLogConfig {
  lineThickness: number;
  lineColor: string;
  containerStroke: string;
  containerFill: string;
  rectFill: string;
  formationOpacity: number;
  formationStrokeWidth: number;
}