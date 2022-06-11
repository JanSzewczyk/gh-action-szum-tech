"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.labelsConfig = void 0;
const types_1 = require("./types");
exports.labelsConfig = {
    [types_1.PullRequestSizeLabel.SMALL]: {
        color: "4CAF50",
        description: "Small size of pull request, up to 32 lines.",
        name: types_1.PullRequestSizeLabel.SMALL
    },
    [types_1.PullRequestSizeLabel.MEDIUM]: {
        color: "FFEB3B",
        description: "Medium size of pull request, from 32 to 128 lines.",
        name: types_1.PullRequestSizeLabel.MEDIUM
    },
    [types_1.PullRequestSizeLabel.LARGE]: {
        color: "FFC107",
        description: "Large size of pull request, from 128 to 512 lines.",
        name: types_1.PullRequestSizeLabel.LARGE
    },
    [types_1.PullRequestSizeLabel.X_LARGE]: {
        color: "FF5722",
        description: "X_Large size of pull request, from 512 to 1024 lines.",
        name: types_1.PullRequestSizeLabel.X_LARGE
    },
    [types_1.PullRequestSizeLabel.MEGALODON]: {
        color: "F44336",
        description: "Pull request in MEGALODON size, over 1024 lines.",
        name: types_1.PullRequestSizeLabel.MEGALODON
    }
};
