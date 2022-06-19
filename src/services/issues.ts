import { IssueComment, OctokitClient } from "../types";
import * as github from "@actions/github";
import * as core from "@actions/core";

export async function getComments(client: OctokitClient, pullRequestNumber: number): Promise<IssueComment[]> {
  const { data: comments } = await client.rest.issues.listComments({
    ...github.context.repo,
    issue_number: pullRequestNumber
  });

  return comments;
}

export async function updateComment(client: OctokitClient, commentId: number, message: string): Promise<void> {
  const response = await client.rest.issues.updateComment({
    ...github.context.repo,
    comment_id: commentId,
    body: message
  });

  if (response.status === 200) {
    core.info(`Pull Request #${response.data.id} comment was updated.`);
  } else {
    core.setFailed(`An error occurred trying to update Pull Request comment. Error code: ${response.status}.`);
  }
}

export async function createComment(client: OctokitClient, pullRequestNumber: number, message: string): Promise<void> {
  const response = await client.rest.issues.createComment({
    ...github.context.repo,
    issue_number: pullRequestNumber,
    body: message
  });

  if (response.status === 201) {
    core.info(`Pull Request #${response.data.id} comment was created.`);
  } else {
    core.setFailed(`An error occurred trying to create Pull Request comment. Error code: ${response.status}.`);
  }
}

export async function getCommentByMessagePrefix(
  client: OctokitClient,
  pullRequestNumber: number,
  messagePrefix: string
): Promise<IssueComment | null> {
  const issueComments = await getComments(client, pullRequestNumber);

  core.info(`Finished getting comments for Pull Request #${pullRequestNumber}.`);

  const comment = issueComments.find((c) => c.body && c.body.startsWith(messagePrefix));

  if (comment) {
    core.info(`A jest tests result comment was found.`);
    return comment;
  } else {
    core.info(`A jest tests result comment was not found.`);
    return null;
  }
}
