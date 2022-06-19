import * as core from "@actions/core";
import { createTestReportMessage, readTestsResultsFromJSONFile } from "./utils";
import * as github from "@actions/github";
import { GithubContextPayloadPullRequest, OctokitClient } from "../types";
import { createComment, getCommentByMessagePrefix, updateComment } from "../services/issues";

const messagePrefix = "<!-- szum-tech/jest-test-results -->";

async function main(): Promise<void> {
  try {
    const githubToken = core.getInput("GITHUB_TOKEN", { required: true, trimWhitespace: true });
    const resultsFileName = core.getInput("RESULTS_FILE", { required: false, trimWhitespace: true });
    const shouldCreatePRComment = core.getBooleanInput("PR_COMMENT", { required: false });
    const shouldCreateStatusCheck = core.getBooleanInput("STATUS_CHECK", { required: false });

    const octokit = github.getOctokit(githubToken);

    core.info(`
    PARAMETERS
    ----------
    GITHUB_TOKEN  : ${githubToken}
    RESULTS_FILE  : ${resultsFileName}
    PR_COMMENT    : ${shouldCreatePRComment}
    STATUS_CHECK  : ${shouldCreateStatusCheck}
    ----------
    `);

    const testResults = await readTestsResultsFromJSONFile(resultsFileName);
    if (!testResults) {
      return;
    }

    // core.info(JSON.stringify(testResults, undefined, 2));

    const testReportMessage = createTestReportMessage(testResults);

    if (shouldCreatePRComment) {
      await createPullRequestComment(octokit, testReportMessage);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    }
  }
}

export async function createPullRequestComment(client: OctokitClient, message: string): Promise<void> {
  try {
    core.info("Creating or updating Pull Request comment...");
    const pullRequest: GithubContextPayloadPullRequest = github.context.payload.pull_request;

    if (!pullRequest) {
      core.info("This event was not triggered by a pull_request. No comment will be created or updated.");
      return;
    }

    core.info("Checking for existing comment on Pull Request....");
    const commentToUpdate = await getCommentByMessagePrefix(client, pullRequest.number, messagePrefix);

    if (!commentToUpdate) {
      core.info(`Creating a new Pull Request comment...`);
      await createComment(client, pullRequest.number, `${messagePrefix}\n${message}`);
    } else {
      core.info(`Updating existing Pull Request #${commentToUpdate.id} comment...`);
      await updateComment(client, commentToUpdate.id, `${messagePrefix}\n${message}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`An error occurred trying to create or update the Pull Request comment: ${error}`);
    }
  }
}

main();
