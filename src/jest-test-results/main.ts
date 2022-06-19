import * as core from "@actions/core";

async function main(): Promise<void> {
  try {
    const githubToken = core.getInput("GITHUB_TOKEN", { required: true, trimWhitespace: true });
    const resultsName = core.getInput("RESULTS_FILE", { required: false, trimWhitespace: true });
    const shouldCreatePRComment = core.getInput("PR_COMMENT", { required: false }) === "true";
    const shouldCreateStatusCheck = core.getInput("STATUS_CHECK", { required: false }) === "true";

    core.info(`${githubToken}, ${resultsName}, ${shouldCreatePRComment}, ${shouldCreateStatusCheck}`);
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    }
  }
}

main();
