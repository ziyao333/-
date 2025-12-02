export interface DataRow {
  [key: string]: string | number | null;
}

export interface VariableSelection {
  dependent: string | null;
  independent: string[];
  controls: string[];
}

export interface RegressionCoefficient {
  name: string;
  value: number;
  stdErr: number;
  tStat: number;
}

export interface RegressionResult {
  coefficients: RegressionCoefficient[];
  r2: number;
  adjR2: number;
  observations: number;
  fStat: number;
  residuals: number[];
  predicted: number[];
  actual: number[];
}
