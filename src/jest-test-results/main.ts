import * as core from "@actions/core";
import { createTestReportMessage, readTestsResultsFromJSONFile } from "./utils";
import * as github from "@actions/github";
import { CheckRunConclusion, CheckRunStatus, OctokitClient } from "@types";
import { createComment, getCommentByMessagePrefix, updateComment } from "@services/issues";
import { createCheck } from "@services/checks";
import { JestResults } from "./types";
import { getParametersDescription } from "@utils/utils";

const messagePrefix = "<!-- szum-tech/jest-test-results -->";

export async function main(): Promise<void> {
  try {
    const githubToken = core.getInput("GITHUB_TOKEN", { required: false, trimWhitespace: true });
    const resultsFileName = core.getInput("RESULTS_FILE", { required: false, trimWhitespace: true });
    const shouldCreatePRComment = core.getBooleanInput("PR_COMMENT", { required: false });
    const shouldCreateStatusCheck = core.getBooleanInput("STATUS_CHECK", { required: false });

    const octokit = github.getOctokit(githubToken);

    core.info(
      getParametersDescription({
        GITHUB_TOKEN: githubToken,
        RESULTS_FILE: resultsFileName,
        PR_COMMENT: shouldCreatePRComment,
        STATUS_CHECK: shouldCreateStatusCheck
      })
    );

    const testResults = readTestsResultsFromJSONFile(resultsFileName);
    if (!testResults) {
      return;
    }

    const testReportMessage = createTestReportMessage(testResults);
    if (testReportMessage === null) {
      core.setFailed("An error occurred while trying to build a GitHub message");
      return;
    }

    if (shouldCreatePRComment) {
      await createPullRequestComment(octokit, testReportMessage);
    }

    if (shouldCreateStatusCheck) {
      await createStatusCheck(octokit, testResults, testReportMessage);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    }
  }
}

export async function createPullRequestComment(client: OctokitClient, message: string): Promise<void> {
  core.info("Creating or updating Pull Request comment...");

  try {
    if (github.context.eventName !== "pull_request") {
      core.info("This event was not triggered by a `pull_request` event. No comment will be created or updated.");
      return;
    }

    const pullRequestNumber = github.context.payload.pull_request?.number as number;

    core.info("Checking for existing comment on Pull Request....");
    const commentToUpdate = await getCommentByMessagePrefix(client, pullRequestNumber, messagePrefix);

    if (!commentToUpdate) {
      core.info(`Creating a new Pull Request comment...`);
      await createComment(client, pullRequestNumber, message);
    } else {
      core.info(`Updating existing Pull Request #${commentToUpdate.id} comment...`);
      await updateComment(client, commentToUpdate.id, message);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`An error occurred trying to create or update the Pull Request comment: ${error}`);
    }
  }
}

export async function createStatusCheck(
  client: OctokitClient,
  jestResults: JestResults,
  message: string
): Promise<void> {
  core.info("Creating Status Check...");

  try {
    const gitSha =
      github.context.eventName === "pull_request" ? github.context.payload.pull_request?.head.sha : github.context.sha;
    core.info(`Creating Status Check for GitSha: #${gitSha} on a '${github.context.eventName}' event`);

    const checkTime = new Date().toUTCString();
    core.info(`Checking time: ${checkTime}`);

    let conclusion = CheckRunConclusion.SUCCESS;
    if (!jestResults.success) {
      conclusion = jestResults ? CheckRunConclusion.NEUTRAL : CheckRunConclusion.FAILURE;
    }

    await createCheck(client, "status check - jest test results", gitSha, CheckRunStatus.COMPLETED, conclusion, {
      title: "Jest Test Results",
      summary: `This test run completed at '${checkTime}'`,
      text: message
    });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`An error occurred trying to create Status Check: ${error}`);
    }
  }
}

main();
