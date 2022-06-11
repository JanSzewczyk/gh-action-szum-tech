import * as github from "@actions/github";
import * as core from "@actions/core";
import { GithubContextPayloadPullRequest, Label, OctokitClient } from "../types";
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
import { allLabelsNames } from "./constants";
import { LabelConfiguration, LabelsType } from "./types";
import { labelsConfig } from "./labels-config";
import { getPullRequestSizeLabel } from "./pull-request-size";

export async function main(): Promise<void> {
  try {
    const githubToken = getInput("GITHUB_TOKEN", { required: true });

    const pullRequest: GithubContextPayloadPullRequest = github.context.payload.pull_request;

    if (!pullRequest) {
      core.warning("Could not get pull request number from context, exiting");
      return;
    }

    if (github.context.eventName !== "pull_request") {
      core.warning("Comment only will be created on pull requests!");
      return;
    }

    const octokit = github.getOctokit(githubToken);

    await checkRepositoryLabels(octokit);

    const changedFiles = await getPullRequestFiles(octokit, pullRequest.number);

    const detectedLabels = [];
    const sizeLabel = getPullRequestSizeLabel(changedFiles);
    detectedLabels.push(sizeLabel);

    core.info(`\nDetected labels:`);
    detectedLabels.forEach((detectedLabel, index) => {
      core.info(`[${index + 1}/${detectedLabels.length}]\t [${detectedLabel}]`);
    });

    const pullRequestLabels = await listLabelsForPullRequest(octokit, pullRequest.number);

    const differences = getLabelsDifferences(
      pullRequestLabels.map((label) => label.name),
      detectedLabels,
      [...allLabelsNames]
    );

    if (differences.remove.length) {
      core.info("\nRemoving labels from pull request...");
      for (const labelToRemove of differences.remove) {
        const index = differences.remove.indexOf(labelToRemove);
        await removeLabelFromPullRequest(octokit, pullRequest.number, labelToRemove);
        core.info(`[${index + 1}/${differences.remove.length}]\tRemoved label: ${labelToRemove}`);
      }
    }

    if (differences.add.length) {
      core.info("\nAdding labels to pull request...");
      await addLabelsToPullRequest(octokit, pullRequest.number, detectedLabels);

      for (const labelToAdd of differences.add) {
        const index = differences.add.indexOf(labelToAdd);
        core.info(`[${index + 1}/${differences.add.length}]\tAdded label: ${labelToAdd}`);
      }
    }

    if (!differences.add.length && !differences.remove.length) {
      core.info("\nAll pull request labels are up to date");
    }
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    }
  }
}

async function checkRepositoryLabels(client: OctokitClient): Promise<void> {
  core.info("Checking Repository Labels...");

  const repoLabels = await listLabelsForRepository(client);

  const labelsToAdd: LabelsType[] = [...allLabelsNames];
  const labelsToUpdate: LabelsType[] = [];

  let foundLabelCount = 0;
  repoLabels.forEach((label) => {
    const labelName = label.name as LabelsType;

    if (allLabelsNames.includes(labelName) && !label.default) {
      core.info(`[${foundLabelCount + 1}/${allLabelsNames.length}]\tA supported label was found: [${label.name}]`);
      foundLabelCount = foundLabelCount + 1;

      if (!validateLabelWithConfiguration(label, labelsConfig[labelName])) {
        labelsToUpdate.push(labelName);
      }

      labelsToAdd.splice(labelsToAdd.indexOf(labelName), 1);
    }
  });

  if (labelsToUpdate.length) {
    core.info("\nUpdating repository labels...");
    for (const labelToUpdate of labelsToUpdate) {
      const index = labelsToUpdate.indexOf(labelToUpdate);
      await updateLabel(client, labelsConfig[labelToUpdate]);
      core.info(`[${index + 1}/${labelsToUpdate.length}]\tUpdated label: ${labelToUpdate}`);
    }
  }

  if (labelsToAdd.length) {
    core.info("\nCreating repository labels...");
    for (const labelToAdd of labelsToAdd) {
      const index = labelsToAdd.indexOf(labelToAdd);
      await createLabel(client, labelsConfig[labelToAdd]);
      core.info(`[${index + 1}/${labelsToAdd.length}]\tCreate label: ${labelToAdd}`);
    }
  }

  if (!labelsToAdd.length && !labelsToUpdate.length) {
    core.info("All labels are up to date");
  }
}

function validateLabelWithConfiguration(label: Label, labelConfiguration: LabelConfiguration): boolean {
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
): { add: string[]; remove: string[] } {
  core.info("\nGetting differences...");

  labels = labels.filter((label) => allLabels.includes(label));
  const pullRequestSupportedLabels = pullRequestLabels.filter((prLabel) => allLabels.includes(prLabel));

  return {
    add: labels.filter((label) => !pullRequestSupportedLabels.includes(label)),
    remove: pullRequestSupportedLabels.filter((label) => !labels.includes(label))
  };
}

main();
