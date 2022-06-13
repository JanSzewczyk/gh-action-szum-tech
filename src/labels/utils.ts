import fs from "fs/promises";
import yaml from "js-yaml";
import { Configuration, LabelChangesReport, LabelConfiguration, PullRequestChangesReport } from "./types";
import { Label, PullRequestFile } from "../types";

export async function getDefaultConfiguration(defaultConfigPath: string): Promise<Configuration> {
  const yamlFile = await fs.readFile(defaultConfigPath, "utf8");

  return yaml.load(yamlFile) as Configuration;
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

    if (labelConfig && !label.default) {
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
