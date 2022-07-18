import { context, getOctokit } from "@actions/github";
import types from "@octokit/types";

export type GithubContext = typeof context;

export type PullRequest = types.Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}"]["response"]["data"];
export type PullRequestUser = PullRequest["base"]["user"];
export type PullRequestRepo = PullRequest["base"]["repo"];

export type Repository = types.Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"];

export type OctokitClient = ReturnType<typeof getOctokit>;

export type IssueComment =
  types.Endpoints["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"]["response"]["data"];

export type Label = types.Endpoints["GET /repos/{owner}/{repo}/labels"]["response"]["data"][0];

export type PullRequestFile =
  types.Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"]["response"]["data"][0];

export type User = types.Endpoints["GET /users/{username}"]["response"]["data"];

export enum PullRequestFileStatus {
  ADDED = "added",
  REMOVED = "removed",
  MODIFIED = "modified",
  RENAMED = "renamed",
  COPIED = "copied",
  CHANGED = "changed",
  UNCHANGED = "unchanged"
}
