import { OctokitClient, pullRequestReviewComment } from "@types";
import * as github from "@actions/github";
import * as core from "@actions/core";

export async function getPullRequestReviewComments(
  client: OctokitClient,
  pullRequestNumber: number
): Promise<pullRequestReviewComment[]> {
  const response = await client.rest.pulls.listReviewComments({
    ...github.context.repo,
    pull_number: pullRequestNumber,
    per_page: 100
  });

  if (response.status !== 200) {
    core.setFailed(`An error occurred trying to get Pull Request review comments. Error code: ${response.status}.`);
  }

  core.info(`Pull Request #${pullRequestNumber} review comments was got.`);
  return response.data;
}
