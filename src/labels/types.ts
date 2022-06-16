export interface Configuration {
  labels: LabelConfiguration[];
}

export interface LabelConfiguration {
  name: string;
  color: string;
  description?: string;
  validation?: LabelValidation;
}

export interface LabelValidation {
  ignoreFiles?: string[];
  any?: string[];
  every?: string[];
  changes?: LabelSizeValidation;
  additions?: LabelSizeValidation;
  deletions?: LabelSizeValidation;
}

export enum LabelSizeValidationType {
  EQUAL = "equal",
  LESS = "less",
  LESS_OR_EQUAL = "lessOrEqual",
  GREATER = "greater",
  GREATER_OR_EQUAL = "greaterOrEqual"
}

export type LabelSizeValidation = Record<LabelSizeValidationType, number | undefined>;

export interface PullRequestChangesReport {
  additions: number;
  changes: number;
  deletions: number;
}

export interface LabelChangesReport {
  add?: string[];
  delete?: string[];
  update?: string[];
}
