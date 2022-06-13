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

export interface LabelSizeValidation {
  equal?: number;
  lessThan?: number;
  lessOrEqualThan?: number;
  greaterThan?: number;
  greaterOrEqualThan?: number;
}

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
