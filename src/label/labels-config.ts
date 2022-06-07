import { LabelsConfiguration, PullRequestSizeLabel } from "./types";

export const labelsConfig: LabelsConfiguration = {
  [PullRequestSizeLabel.SMALL]: {
    color: "4CAF50",
    description: "Small size of pull request, up to 32 lines.",
    name: PullRequestSizeLabel.SMALL
  },
  [PullRequestSizeLabel.MEDIUM]: {
    color: "FFEB3B",
    description: "Medium size of pull request, from 32 to 128 lines.",
    name: PullRequestSizeLabel.MEDIUM
  },
  [PullRequestSizeLabel.LARGE]: {
    color: "FFC107",
    description: "Large size of pull request, from 128 to 512 lines.",
    name: PullRequestSizeLabel.LARGE
  },
  [PullRequestSizeLabel.X_LARGE]: {
    color: "FF5722",
    description: "X_Large size of pull request, from 512 to 1024 lines.",
    name: PullRequestSizeLabel.X_LARGE
  },
  [PullRequestSizeLabel.MEGALODON]: {
    color: "F44336",
    description: "Pull request in MEGALODON size, over 1024 lines.",
    name: PullRequestSizeLabel.MEGALODON
  }
};
