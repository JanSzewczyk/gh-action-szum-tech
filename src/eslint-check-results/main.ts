import * as core from "@actions/core";
import * as github from "@actions/github";
import { getParametersDescription } from "@utils/utils";
import { getPullRequestReviewComments } from "@services/review-comments";

export async function main(): Promise<void> {
  try {
    const githubToken = core.getInput("GITHUB_TOKEN", { required: false, trimWhitespace: true });
    const resultsFileName = core.getInput("RESULTS_FILE", { required: false, trimWhitespace: true });

    const octokit = github.getOctokit(githubToken);

    core.info(
      getParametersDescription({
        GITHUB_TOKEN: githubToken,
        RESULTS_FILE: resultsFileName
      })
    );

    if (github.context.eventName !== "pull_request") {
      core.info("This event was not triggered by a `pull_request` event. No comment will be created or updated.");
      return;
    }

    const pullRequestNumber = github.context.payload.pull_request?.number as number;
    const commentList = await getPullRequestReviewComments(octokit, pullRequestNumber);

    console.log(commentList);

    core.info(JSON.stringify(commentList, undefined, 2));
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    }
  }
}

main();
