import * as github from "@actions/github";
import * as core from "@actions/core";

import { OctokitClient, PullRequestFile } from "@types";
import { getPullRequestFiles } from "@services/pull";
import {
  addLabelsToPullRequest,
  createLabel,
  listLabelsForPullRequest,
  listLabelsForRepository,
  removeLabelFromPullRequest,
  updateLabel
} from "@services/label";
import { Configuration, LabelConfiguration } from "./types";
import {
  checkIfConfigFileIsSupported,
  getLabelsDifferences,
  getRepositoryLabelsDifference,
  isFileConfigurationCorrect,
  mergeConfigurations,
  readConfigurationFile
} from "./utils";
import { validateLabel } from "./validation";
import { getParametersDescription } from "@utils/utils";
import { defaultConfiguration } from "./constants";
import { orderBy } from "lodash-es";

export async function main(): Promise<void> {
  try {
    const githubToken = core.getInput("GITHUB_TOKEN", { required: false, trimWhitespace: true });
    const customConfigPath = core.getInput("CUSTOM_CONFIG_PATH", { required: false, trimWhitespace: true }) || null;
    const disableDefaultConfig = core.getBooleanInput("DISABLE_DEFAULT_CONFIG", { required: false });

    const octokit = github.getOctokit(githubToken);

    core.info(
      getParametersDescription({
        GITHUB_TOKEN: githubToken,
        CUSTOM_CONFIG_PATH: customConfigPath,
        DISABLE_DEFAULT_CONFIG: disableDefaultConfig
      })
    );

    if (github.context.eventName !== "pull_request") {
      core.info("This event was not triggered by a `pull_request` event. No label will be updated.");
      return;
    }

    const pullRequestNumber = github.context.payload.pull_request?.number as number;

    const configuration = getLabelConfiguration(customConfigPath, disableDefaultConfig);
    core.info(`Successfully get label configuration with ${configuration.length} label(s).`);

    core.info("\nSync Repository labels...");
    await syncRepositoryLabels(octokit, defaultConfiguration.labels);

    core.info("\nGetting Pull Request Files...");
    const changedFiles = await getPullRequestFiles(octokit, pullRequestNumber);

    core.info("\nDetecting Pull Request Labels...");
    const detectedLabels = definePullRequestLabels(defaultConfiguration.labels, changedFiles);

    core.info("\nSync Pull Request labels...");
    await syncPullRequestLabels(octokit, pullRequestNumber, detectedLabels, defaultConfiguration.labels);
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    }
  }
}

export function getLabelConfiguration(
  customConfigurationPath: string | null,
  disableDefaultConfig: boolean
): LabelConfiguration[] {
  core.info(`Getting labels configuration....`);

  const defaultConfig: Configuration = defaultConfiguration;
  let customConfig: Configuration | null = null;

  if (customConfigurationPath) {
    core.info(`Custom label configuration is supported.`);
    core.info(`Getting custom labels configuration from file '${customConfigurationPath}'...`);

    const isFileNameSupported = checkIfConfigFileIsSupported(customConfigurationPath);

    if (isFileNameSupported) {
      const rawConfig = readConfigurationFile(customConfigurationPath);
      const config = isFileConfigurationCorrect(rawConfig);

      if (config) {
        customConfig = config;
      }
    }

    if (!isFileNameSupported || !customConfig) {
      if (disableDefaultConfig) {
        core.setFailed(
          "Custom labels configuration file is not supported by an action and DEFAULT configuration is disabled. No label will be changed."
        );
      } else {
        core.warning(
          "Custom labels configuration file is not supported by an action. DEFAULT labels configuration will be used."
        );
      }
    }
  }

  if (!disableDefaultConfig) {
    if (customConfig !== null) {
      core.info(`The source of labels configuration is configuration created from DEFAULT and CUSTOM configuration.`);
      return orderBy(mergeConfigurations(defaultConfig.labels, customConfig.labels), ["name"]);
    } else {
      core.info(`The source of labels configuration is the only default configuration.`);
      return orderBy(defaultConfig.labels, ["name"]);
    }
  } else {
    if (customConfig !== null) {
      core.info(`The source of labels configuration is the only CUSTOM configuration.`);
      return orderBy(customConfig.labels, ["name"]);
    }
  }

  return [];
}

async function syncRepositoryLabels(
  client: OctokitClient,
  labelConfigurationList: LabelConfiguration[]
): Promise<void> {
  core.info("Getting Repository labels...");
  const repoLabels = await listLabelsForRepository(client);

  core.info("Checking differences between repository labels and supported labels configuration...");
  const labelsDifferences = getRepositoryLabelsDifference(repoLabels, labelConfigurationList);

  if (labelsDifferences.update?.length) {
    core.info("\nUpdating Repository labels...");

    const labelsNameToUpdate = labelsDifferences.update;
    const labelConfigurationsToUpdate = labelConfigurationList.filter((labelConfig) =>
      labelsNameToUpdate.includes(labelConfig.name)
    );
    for (const labelToUpdate of labelConfigurationsToUpdate) {
      const index = labelConfigurationsToUpdate.indexOf(labelToUpdate);
      await updateLabel(client, labelToUpdate);
      core.info(`[${index + 1}/${labelsNameToUpdate.length}]\tUpdated label: [${labelToUpdate.name}]`);
    }
  }

  if (labelsDifferences.add?.length) {
    core.info("\nCreating Repository labels...");

    const labelNamesToAdd = labelsDifferences.add;
    const labelConfigurationsToAdd = labelConfigurationList.filter((labelConfig) =>
      labelNamesToAdd.includes(labelConfig.name)
    );
    for (const labelToAdd of labelConfigurationsToAdd) {
      const index = labelConfigurationsToAdd.indexOf(labelToAdd);
      await createLabel(client, labelToAdd);
      core.info(`[${index + 1}/${labelConfigurationsToAdd.length}]\tCreate label: [${labelToAdd.name}]`);
    }
  }

  if (!labelsDifferences.update?.length && !labelsDifferences.add?.length) {
    core.info("All labels are up to date");
  }
}

function definePullRequestLabels(
  labelConfigurationList: LabelConfiguration[],
  changedFiles: PullRequestFile[]
): string[] {
  const detectedLabels: string[] = [];

  labelConfigurationList.forEach((labelConfiguration) => {
    if (validateLabel(changedFiles, labelConfiguration.validation)) {
      detectedLabels.push(labelConfiguration.name);
      core.info(`\t✅ [${labelConfiguration.name}]`);
    } else {
      core.info(`\t❌ [${labelConfiguration.name}]`);
    }
  });

  return detectedLabels;
}

async function syncPullRequestLabels(
  client: OctokitClient,
  pullRequestNumber: number,
  detectedLabels: string[],
  labelConfigurationList: LabelConfiguration[]
): Promise<void> {
  core.info("Getting Pull Request labels...");
  const pullRequestLabels = await listLabelsForPullRequest(client, pullRequestNumber);

  const differences = getLabelsDifferences(
    pullRequestLabels.map((label) => label.name),
    detectedLabels,
    labelConfigurationList.map((label) => label.name)
  );

  if (differences.delete?.length) {
    core.info("\nRemoving labels from pull request...");
    for (const labelToRemove of differences.delete) {
      const index = differences.delete.indexOf(labelToRemove);
      await removeLabelFromPullRequest(client, pullRequestNumber, labelToRemove);
      core.info(`[${index + 1}/${differences.delete.length}]\tRemoved label: [${labelToRemove}]`);
    }
  }

  if (differences.add?.length) {
    core.info("\nAdding labels to pull request...");
    await addLabelsToPullRequest(client, pullRequestNumber, detectedLabels);

    for (const labelToAdd of differences.add) {
      const index = differences.add.indexOf(labelToAdd);
      core.info(`[${index + 1}/${differences.add.length}]\tAdded label: [${labelToAdd}]`);
    }
  }

  if (!differences.add?.length && !differences.delete?.length) {
    core.info("\nAll pull request labels are up to date");
  }
}

main();
