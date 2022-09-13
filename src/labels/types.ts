import { difference, intersection, xor } from "lodash-es";

export interface Configuration {
  labels: LabelConfiguration[];
}

export interface LabelConfiguration {
  name: string;
  color: string;
  description: string;
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

export type LabelSizeValidation = Partial<Record<LabelSizeValidationType, number>>;

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

export function isConfiguration(configuration: unknown): configuration is Configuration {
  if (typeof configuration !== "object") {
    return false;
  }
  const config = configuration as Configuration;

  if (xor(Object.keys(config), ["labels"]).length !== 0 || !config?.labels || !Array.isArray(config.labels)) {
    return false;
  }

  for (const labelConfig of config.labels) {
    if (typeof labelConfig !== "object") {
      return false;
    }
    const labelConfigFields = Object.keys(labelConfig);

    if (
      difference(labelConfigFields, ["name", "color", "description", "validation"]).length !== 0 ||
      intersection(labelConfigFields, ["name", "color"]).length !== 2 ||
      !labelConfig?.name ||
      typeof labelConfig.name !== "string" ||
      !labelConfig?.description ||
      typeof labelConfig.description !== "string" ||
      !labelConfig?.validation ||
      labelConfig?.validation !== "object"
    ) {
      return false;
    }

    const labelConfigValidationFields = Object.keys(labelConfig.validation);
    if (
      difference(labelConfigValidationFields, ["ignoreFiles", "any", "every", "changes", "additions", "deletions"])
        .length !== 0
    ) {
      return false;
    }

    for (const stringArrayField of ["ignoreFiles", "any", "every"]) {
      const value = labelConfig.validation[stringArrayField as keyof LabelValidation];

      if (value && !Array.isArray(value)) {
        return false;
      }
    }

    for (const objectField of ["changes", "additions", "deletions"]) {
      const value = labelConfig.validation[objectField as keyof LabelValidation];
      if (value !== undefined && !isLabelSizeValidation(value)) {
        return false;
      }
    }
  }

  return true;
}

function isLabelSizeValidation(labelSizeValidation: unknown): labelSizeValidation is LabelSizeValidation {
  if (typeof labelSizeValidation !== "object") {
    return false;
  }
  const config = labelSizeValidation as LabelSizeValidation;

  const labelSizeValidationTypes = [
    LabelSizeValidationType.LESS,
    LabelSizeValidationType.GREATER,
    LabelSizeValidationType.LESS_OR_EQUAL,
    LabelSizeValidationType.GREATER_OR_EQUAL,
    LabelSizeValidationType.EQUAL
  ];

  if (difference(Object.keys(config), labelSizeValidationTypes).length !== 0) {
    return false;
  }

  for (const sizeValidationType of labelSizeValidationTypes) {
    if (config[sizeValidationType] && typeof config[sizeValidationType] !== "number") {
      return false;
    }
  }

  return true;
}
