import * as github from "@actions/github";
import * as core from "@actions/core";

import { GithubContextPayloadPullRequest, OctokitClient, PullRequestFile } from "../types";
import { getInput } from "@actions/core";
import { getPullRequestFiles } from "../services/pull";
import {
  addLabelsToPullRequest,
  createLabel,
  listLabelsForPullRequest,
  listLabelsForRepository,
  removeLabelFromPullRequest,
  updateLabel
} from "../services/label";
import { LabelConfiguration } from "./types";
import { getDefaultConfiguration, getLabelsDifferences, getRepositoryLabelsDifference } from "./utils";
import { validateLabel } from "./validation";

const defaultConfigPath = "./src/labels/default-config.yml";

export async function main(): Promise<void> {
  try {
    const githubToken = getInput("GITHUB_TOKEN", { required: true });

    const pullRequest: GithubContextPayloadPullRequest = github.context.payload.pull_request;

    if (!pullRequest) {
      core.warning("Could not get pull request from context, exiting...");
      return;
    }

    const octokit = github.getOctokit(githubToken);

    core.info(`Getting default label configuration....`);
    const defaultConfiguration = await getDefaultConfiguration(defaultConfigPath);
    core.info(`Successfully get label configuration with ${defaultConfiguration.labels.length} label(s)`);

    core.info("\nSync Repository labels...");
    await syncRepositoryLabels(octokit, defaultConfiguration.labels);

    core.info("\nGetting Pull Request Files...");
    const changedFiles = await getPullRequestFiles(octokit, pullRequest.number);

    core.info("\nDetecting Pull Request Labels...");
    const detectedLabels = definePullRequestLabels(defaultConfiguration.labels, changedFiles);

    detectedLabels.forEach((detectedLabel, index) => {
      core.info(`[${index + 1}/${detectedLabels.length}]\t[${detectedLabel}]`); // X fajka
    });

    core.info("\nSync Pull Request labels...");
    await syncPullRequestLabels(octokit, pullRequest.number, detectedLabels, defaultConfiguration.labels);
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    }
  }
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
      core.info(`✅\t[${labelConfiguration.name}]`);
    } else {
      core.info(`❌\t[${labelConfiguration.name}]`);
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
