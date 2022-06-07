import { OctokitClient, PullRequestFile } from "../types";
import * as github from "@actions/github";

export async function getPullRequestFiles(
  client: OctokitClient,
  pullRequestNumber: number
): Promise<PullRequestFile[]> {
  const { data: changedFiles } = await client.rest.pulls.listFiles({
    ...github.context.repo,
    pull_number: pullRequestNumber
  });

  return changedFiles;
}
