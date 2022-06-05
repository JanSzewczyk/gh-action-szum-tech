import {context} from "@actions/github";

export type GithubContext = typeof context;

export type GithubContextPayloadPullRequest = GithubContext["payload"]['pull_request'];