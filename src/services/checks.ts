import { OctokitClient } from "../types";
import * as github from "@actions/github";
import * as core from "@actions/core";

export async function createCheck(
  client: OctokitClient,
  name: string,
  headSha: string,
  status: string,
  conclusion: string,
  output: {
    title: string;
    summary: string;
    text: string;
  }
): Promise<void> {
  const response = await client.rest.checks.create({
    ...github.context.repo,
    name,
    head_sha: headSha,
    status,
    conclusion,
    output
  });

  if (response.status === 201) {
    core.info(`Status Check #${response.data.id} was created with response status ${response.status}`);
  } else {
    core.setFailed(`An error occurred trying to create Status Check. Error code: ${response.status}.`);
  }
}
