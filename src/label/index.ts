import * as github from "@actions/github";
import * as core from "@actions/core";
import { GithubContextPayloadPullRequest } from "../types";
// import { getInput } from "@actions/core";
import { getPullRequestFiles } from "../services/pull";

export async function main(githubToken: string): Promise<void> {
  try {
    // const githubToken = getInput("GITHUB_TOKEN", { required: true });

    const pullRequest: GithubContextPayloadPullRequest = github.context.payload.pull_request;

    if (!pullRequest) {
      new Error("Could not get pull request number from context, exiting");
      return;
    }

    if (github.context.eventName !== "pull_request") {
      core.info("Comment only will be created on pull requests!");
      return;
    }

    const octokit = github.getOctokit(githubToken);

    const changedFiles = await getPullRequestFiles(octokit, pullRequest.number);
    core.info(`Changed files: [${changedFiles.map((file) => file.filename).join(" ,")}]`);

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
            ...github.context.repo,
            issue_number: pullRequest.number,
            labels: ["markdown"]
          });
          break;
        }
        case "js": {
          await octokit.rest.issues.addLabels({
            ...github.context.repo,
            issue_number: pullRequest.number,
            labels: ["javascript"]
          });
          break;
        }
        case "yml": {
          await octokit.rest.issues.addLabels({
            ...github.context.repo,
            issue_number: pullRequest.number,
            labels: ["yaml"]
          });
          break;
        }
        case "yaml": {
          await octokit.rest.issues.addLabels({
            ...github.context.repo,
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
      ...github.context.repo,
      issue_number: pullRequest.number,
      body: `
        Pull Request #${pullRequest.number} has been updated with: \n
        - ${diffData.changes} changes \n
        - ${diffData.additions} additions \n
        - ${diffData.deletions} deletions \n
      `
    });
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    }
  }
}
