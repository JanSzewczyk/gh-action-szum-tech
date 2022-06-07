export interface LabelConfiguration {
  name: string;
  color: string;
  description?: string;
}

export interface PullRequestChangesReport {
  additions: number;
  changes: number;
  deletions: number;
}

export type LabelsConfiguration = Record<PullRequestSizeLabel, LabelConfiguration>;

export enum PullRequestSizeLabel {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  X_LARGE = "x_large",
  MEGALODON = "megalodon"
}

export enum ChangedFileLabel {
  CONFIGURATION = "configuration"
}

export type LabelsType = PullRequestSizeLabel;
