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

export enum PullRequestFileStatus {
  ADDED = "added",
  REMOVED = "removed",
  MODIFIED = "modified",
  RENAMED = "renamed",
  COPIED = "copied",
  CHANGED = "changed",
  UNCHANGED = "unchanged"
}

export type User = types.Endpoints["GET /users/{username}"]["response"]["data"];
export type SimpleUser = types.Endpoints["GET /users"]["response"]["data"][0];

export type CheckRun = types.Endpoints["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"]["response"]["data"];
export enum CheckRunConclusion {
  SUCCESS = "success",
  FAILURE = "failure",
  NEUTRAL = "neutral",
  CANCELLED = "cancelled",
  SKIPPED = "skipped",
  TIME_OUT = "timed_out",
  ACTION_REQUIRED = "action_required"
}
export enum CheckRunStatus {
  QUEUED = "queued",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed"
}
