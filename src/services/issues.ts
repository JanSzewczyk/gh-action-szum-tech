import { IssueComment, OctokitClient } from "../types";
import * as github from "@actions/github";

export async function getComments(client: OctokitClient, commentId: number): Promise<IssueComment[]> {
  const { data: comments } = await client.rest.issues.listComments({
    ...github.context.repo,
    issue_number: commentId
  });

  return comments;
}

export async function updateComment(client: OctokitClient, commentId: number, message: string): Promise<void> {
  await client.rest.issues.updateComment({
    ...github.context.repo,
    comment_id: commentId,
    body: message
  });
}

export async function createComment(client: OctokitClient, pullRequestNumber: number, message: string): Promise<void> {
  await client.rest.issues.createComment({
    ...github.context.repo,
    issue_number: pullRequestNumber,
    body: message
  });
}
