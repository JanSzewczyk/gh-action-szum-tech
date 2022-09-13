import * as fs from "fs";
import * as core from "@actions/core";
import yaml from "js-yaml";
import {
  Configuration,
  isConfiguration,
  LabelChangesReport,
  LabelConfiguration,
  PullRequestChangesReport
} from "./types";
import { Label, PullRequestFile } from "@types";
import minimatch from "minimatch";
import { supportedConfigurationFilesExtensions } from "./constants";
import { differenceBy } from "lodash-es";

export function checkIfConfigFileIsSupported(configPath: string): boolean {
  core.info("Checking if the labels configuration file is supported...");

  if (!configPath) {
    core.error("Labels configuration file path does not exist.");
    return false;
  }

  const pathArray = configPath.split("/");
  const configFileName = pathArray[pathArray.length - 1];

  const result = supportedConfigurationFilesExtensions.some((fileExtension) =>
    minimatch(configFileName, `*.${fileExtension}`)
  );

  if (result) {
    core.info(`Labels configuration file '${configFileName}' is supported by action.`);
  } else {
    core.error(`Labels configuration file '${configFileName}' is not supported by action.`);
  }

  return result;
}

// TODO TEST
export function readConfigurationFile(fileName: string): unknown {
  core.info("Reading labels configuration from file...");

  if (fs.existsSync(fileName)) {
    const raw = fs.readFileSync(fileName, "utf8");

    if (!raw) {
      core.error(`The label configuration file '${fileName}' does not contain any data.`);
      return null;
    }

    core.info(`The label configuration file '${fileName}' has been loaded successfully.`);
    return yaml.load(raw);
  } else {
    core.error(`The label configuration file '${fileName}' does not exists.`);
    return null;
  }
}

// TODO TEST
export function isFileConfigurationCorrect(config: unknown): Configuration | false {
  core.info("Checking custom configuration correctness...");

  if (isConfiguration(config)) {
    core.info("Custom configuration is correct.");
    return config;
  }

  core.error("Custom configuration is correct.");
  return false;
}

// TODO TEST
export function mergeConfigurations(
  baseConfig: LabelConfiguration[],
  newConfig: LabelConfiguration[]
): LabelConfiguration[] {
  const baseConfigWithoutOverwrittenLabels = differenceBy(baseConfig, newConfig, "name");
  return [...baseConfigWithoutOverwrittenLabels, ...newConfig];
}

export function getRepositoryLabelsDifference(
  repoLabels: Label[],
  labelConfiguration: LabelConfiguration[]
): LabelChangesReport {
  const labelsToAdd: string[] = labelConfiguration.map((config) => config.name);
  const labelsToUpdate: string[] = [];

  repoLabels.forEach((label) => {
    const labelName = label.name;
    const labelConfig = labelConfiguration.find((config) => config.name === labelName);

    if (labelConfig) {
      if (!checkLabelConfiguration(label, labelConfig)) {
        labelsToUpdate.push(labelName);
      }

      labelsToAdd.splice(labelsToAdd.indexOf(labelName), 1);
    }
  });

  return {
    add: labelsToAdd,
    update: labelsToUpdate
  };
}

export function checkLabelConfiguration(label: Label, labelConfiguration: LabelConfiguration): boolean {
  return (
    label.name === labelConfiguration.name &&
    label.color === labelConfiguration.color &&
    label.description === labelConfiguration.description
  );
}

export function getLabelsDifferences(
  pullRequestLabels: string[],
  labels: string[],
  allLabels: string[]
): LabelChangesReport {
  labels = labels.filter((label) => allLabels.includes(label));
  const pullRequestSupportedLabels = pullRequestLabels.filter((prLabel) => allLabels.includes(prLabel));

  return {
    add: labels.filter((label) => !pullRequestSupportedLabels.includes(label)),
    delete: pullRequestSupportedLabels.filter((label) => !labels.includes(label))
  };
}

export function getPullRequestChangesReport(files: PullRequestFile[]): PullRequestChangesReport {
  let pullRequestReport: PullRequestChangesReport = {
    additions: 0,
    changes: 0,
    deletions: 0
  };

  pullRequestReport = files.reduce((acc, file) => {
    acc.additions += file.additions;
    acc.changes += file.changes;
    acc.deletions += file.deletions;
    return acc;
  }, pullRequestReport);

  return pullRequestReport;
}

export function filterFileNamesByPatterns(fileNames: string[], fileNamePatterns: string[]): string[] {
  return fileNames.filter((fileName) => !fileNamePatterns.some((pattern) => minimatch(fileName, pattern)));
}
