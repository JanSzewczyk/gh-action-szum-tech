import minimatch from "minimatch";
import { LabelSizeValidationType, LabelValidation, PullRequestChangesReport } from "./types";
import { PullRequestFile } from "../types";
import { filterFileNamesByPatterns, getPullRequestChangesReport } from "./utils";

export function validateLabel(changedFiles: PullRequestFile[], labelValidation: LabelValidation = {}): boolean {
  const sizeValidationFields = ["changes", "additions", "deletions"] as const;
  let validationResult = true;
  let filteredFiles = [...changedFiles];
  let filteredFileNames = changedFiles.map((file) => file.filename);

  if (labelValidation.ignoreFiles && labelValidation.ignoreFiles.length) {
    filteredFileNames = filterFileNamesByPatterns(filteredFileNames, labelValidation.ignoreFiles);
  }

  // check `any`
  if (labelValidation.any && labelValidation.any.length) {
    validationResult = validationResult && checkAnyGlob(labelValidation.any, filteredFileNames);
  }

  // check `every`
  if (labelValidation.every && labelValidation.every.length) {
    validationResult = validationResult && checkEveryGlob(labelValidation.every, filteredFileNames);
  }

  let sizeReport: PullRequestChangesReport = {
    additions: 0,
    changes: 0,
    deletions: 0
  };

  if (sizeValidationFields.some((field) => labelValidation[field])) {
    filteredFiles = filteredFiles.filter((file) => filteredFileNames.includes(file.filename));
    sizeReport = getPullRequestChangesReport(filteredFiles);
  }

  // check `changes`, `additions`, `deletions`
  sizeValidationFields.forEach((sizeValidationField) => {
    const validationField = labelValidation[sizeValidationField];

    if (validationField) {
      Object.values(LabelSizeValidationType).forEach((labelSizeValidationType) => {
        const labelSizeValidationValue = validationField[labelSizeValidationType];

        if (labelSizeValidationValue !== undefined) {
          validationResult =
            validationResult &&
            checkSize(sizeReport[sizeValidationField], labelSizeValidationType, labelSizeValidationValue);
        }
      });
    }
  });

  return validationResult;
}

export function checkSize(validateValue: number, type: LabelSizeValidationType, value: number): boolean {
  if (type === LabelSizeValidationType.EQUAL) {
    return value === validateValue;
  } else if (type === LabelSizeValidationType.GREATER) {
    return validateValue > value;
  } else if (type === LabelSizeValidationType.GREATER_OR_EQUAL) {
    return validateValue >= value;
  } else if (type === LabelSizeValidationType.LESS) {
    return validateValue < value;
  } else if (type === LabelSizeValidationType.LESS_OR_EQUAL) {
    return validateValue <= value;
  }

  return false;
}

export function checkAnyGlob(patterns: string[], fileNames: string[]): boolean {
  if (!patterns.length) {
    return true;
  }

  return patterns.some((pattern) => fileNames.some((fileName) => minimatch(fileName, pattern)));
}

// TODO fix this role add all atterns walidation
export function checkEveryGlob(patterns: string[], fileNames: string[]): boolean {
  if (!patterns.length) {
    return true;
  }

  let names = [...fileNames];
  const patternCheck: Record<string, boolean> = {};

  patterns.forEach((pattern) => {
    let detectedFileNames: string[] = [];

    fileNames.forEach((fileName) => {
      if (minimatch(fileName, pattern)) {
        detectedFileNames.push(fileName);
      }
    });

    names = names.filter((name) => !detectedFileNames.includes(name));
    patternCheck[pattern] = detectedFileNames.length > 0;
    detectedFileNames = [];
  });

  return fileNames.length > 0 && names.length === 0;
}
