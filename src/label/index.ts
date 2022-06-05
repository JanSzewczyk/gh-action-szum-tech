import { getOctokit, context } from "@actions/github";
import * as core from "@actions/core";
import { GithubContextPayloadPullRequest } from "../types";

export async function main(githubToken: string): Promise<void> {
  try {
    const octokit = getOctokit(githubToken);
    const pullRequest: GithubContextPayloadPullRequest = context.payload.pull_request;

    if (!pullRequest) {
      new Error("Pull Request doesn't exists!!!");
      return;
    }

    const { data: changedFiles } = await octokit.rest.pulls.listFiles({
      ...context.repo,
      pull_number: pullRequest.number
    });

    let diffData = {
      additions: 0,
      deletions: 0,
      changes: 0
    };

    diffData = changedFiles.reduce((acc, file) => {
      acc.additions += file.additions;
      acc.deletions += file.deletions;
      acc.changes += file.changes;
      return acc;
    }, diffData);

    /**
     * Loop over all the files changed in the PR and add labels according
     * to files types.
     **/
    for (const file of changedFiles) {
      /**
       * Add labels according to file types.
       */
      const fileExtension = file.filename.split(".").pop();

      switch (fileExtension) {
        case "md": {
          await octokit.rest.issues.addLabels({
            ...context.repo,
            issue_number: pullRequest.number,
            labels: ["markdown"]
          });
          break;
        }
        case "js": {
          await octokit.rest.issues.addLabels({
            ...context.repo,
            issue_number: pullRequest.number,
            labels: ["javascript"]
          });
          break;
        }
        case "yml": {
          await octokit.rest.issues.addLabels({
            ...context.repo,
            issue_number: pullRequest.number,
            labels: ["yaml"]
          });
          break;
        }
        case "yaml": {
          await octokit.rest.issues.addLabels({
            ...context.repo,
            issue_number: pullRequest.number,
            labels: ["yaml"]
          });
        }
      }
    }

    /**
     * Remove existed
     */
    // TODO add remove orr update comment

    /**
     * Create a comment on the PR with the information we compiled from the
     * list of changed files.
     */
    await octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: pullRequest.number,
      body: `
        Pull Request #${pullRequest.number} has been updated with: \n
        - ${diffData.changes} changes \n
        - ${diffData.additions} additions \n
        - ${diffData.deletions} deletions \n
      `
    });
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}
