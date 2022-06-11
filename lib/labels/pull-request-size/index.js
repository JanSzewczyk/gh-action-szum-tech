"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSizeLabel = exports.getPullRequestChangesReport = exports.filterFileNames = exports.getPullRequestSizeLabel = void 0;
const types_1 = require("../types");
const core = __importStar(require("@actions/core"));
const ignoredFiles = ["yarn.lock", "package-lock.json"];
const ignoredDirectory = ["lib/", "dist/"];
function getPullRequestSizeLabel(changedFiles) {
    core.info("\nProcessing Pull Request Changes Report...");
    const fileNames = changedFiles.map((file) => file.filename);
    const filteredFileNames = filterFileNames(fileNames);
    const filteredFiles = changedFiles.filter((file) => filteredFileNames.includes(file.filename));
    const pullRequestReport = getPullRequestChangesReport(filteredFiles);
    core.info("Report details:");
    core.info(`\t* ${filteredFiles.length} file(s)`);
    core.info(`\t* ${pullRequestReport.additions} addition(s)`);
    core.info(`\t* ${pullRequestReport.changes} change(s)`);
    core.info(`\t* ${pullRequestReport.deletions} deletion(s)`);
    return getSizeLabel(pullRequestReport.changes);
}
exports.getPullRequestSizeLabel = getPullRequestSizeLabel;
function filterFileNames(fileNames) {
    return fileNames.filter((fileName) => !ignoredFiles.includes(fileName) && ignoredDirectory.every((dirName) => !fileName.startsWith(dirName)));
}
exports.filterFileNames = filterFileNames;
function getPullRequestChangesReport(files) {
    let pullRequestReport = {
        additions: 0,
        changes: 0,
        deletions: 0
    };
    pullRequestReport = files.reduce((acc, file) => {
        acc.additions += file.additions;
        acc.changes += file.changes;
        acc.deletions += file.deletions;
        return acc;
    }, pullRequestReport);
    return pullRequestReport;
}
exports.getPullRequestChangesReport = getPullRequestChangesReport;
function getSizeLabel(changes) {
    if (changes < 32)
        return types_1.PullRequestSizeLabel.SMALL;
    if (changes < 128)
        return types_1.PullRequestSizeLabel.MEDIUM;
    if (changes < 512)
        return types_1.PullRequestSizeLabel.LARGE;
    if (changes < 1024)
        return types_1.PullRequestSizeLabel.X_LARGE;
    return types_1.PullRequestSizeLabel.MEGALODON;
}
exports.getSizeLabel = getSizeLabel;
