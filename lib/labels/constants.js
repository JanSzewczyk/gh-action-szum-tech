"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allLabelsNames = exports.pullRequestSizeLabelNames = void 0;
const types_1 = require("./types");
exports.pullRequestSizeLabelNames = [
    types_1.PullRequestSizeLabel.SMALL,
    types_1.PullRequestSizeLabel.MEDIUM,
    types_1.PullRequestSizeLabel.LARGE,
    types_1.PullRequestSizeLabel.X_LARGE,
    types_1.PullRequestSizeLabel.MEGALODON
];
exports.allLabelsNames = [...exports.pullRequestSizeLabelNames];
