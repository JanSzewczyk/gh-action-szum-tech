import { PullRequestSizeLabel } from "./types";

export const pullRequestSizeLabelNames = [
  PullRequestSizeLabel.SMALL,
  PullRequestSizeLabel.MEDIUM,
  PullRequestSizeLabel.LARGE,
  PullRequestSizeLabel.X_LARGE,
  PullRequestSizeLabel.MEGALODON
];

export const allLabelsNames = [...pullRequestSizeLabelNames];
