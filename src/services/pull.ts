import { OctokitClient, PullRequestFile } from "@types";
import * as github from "@actions/github";
import * as core from "@actions/core";

export async function getPullRequestFiles(
  client: OctokitClient,
  pullRequestNumber: number
): Promise<PullRequestFile[]> {
  const response = await client.rest.pulls.listFiles({
    ...github.context.repo,
    pull_number: pullRequestNumber
  });

  if (response.status !== 200) {
    core.setFailed(`An error occurred trying to get Pull Request files. Error code: ${response.status}.`);
  }

  core.info(`Pull Request #${pullRequestNumber} files was got.`);
  return response.data;
}
