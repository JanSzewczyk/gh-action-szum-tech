import { Label, OctokitClient } from "../types";
import * as github from "@actions/github";
import { LabelConfiguration } from "../labels/types";

export async function listLabelsForRepository(client: OctokitClient): Promise<Label[]> {
  const { data: repoLabels } = await client.rest.issues.listLabelsForRepo({
    ...github.context.repo
  });

  return repoLabels;
}

export async function listLabelsForPullRequest(client: OctokitClient, pullRequestNumber: number): Promise<Label[]> {
  const { data: repoLabels } = await client.rest.issues.listLabelsOnIssue({
    ...github.context.repo,
    issue_number: pullRequestNumber
  });

  return repoLabels;
}

export async function createLabel(client: OctokitClient, labelConfig: LabelConfiguration): Promise<void> {
  await client.rest.issues.createLabel({
    ...github.context.repo,
    name: labelConfig.name,
    color: labelConfig.color,
    description: labelConfig.description
  });
}

export async function updateLabel(client: OctokitClient, labelConfig: LabelConfiguration): Promise<void> {
  await client.rest.issues.updateLabel({
    ...github.context.repo,
    name: labelConfig.name,
    color: labelConfig.color,
    description: labelConfig.description
  });
}

export async function addLabelsToPullRequest(
  client: OctokitClient,
  pullRequestNumber: number,
  labels: string[]
): Promise<void> {
  await client.rest.issues.addLabels({
    ...github.context.repo,
    issue_number: pullRequestNumber,
    labels
  });
}

export async function removeLabelFromPullRequest(
  client: OctokitClient,
  pullRequestNumber: number,
  label: string
): Promise<void> {
  await client.rest.issues.removeLabel({
    ...github.context.repo,
    issue_number: pullRequestNumber,
    name: label
  });
}
