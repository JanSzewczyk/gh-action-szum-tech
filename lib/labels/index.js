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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabelsDifferences = exports.main = void 0;
const github = __importStar(require("@actions/github"));
const core = __importStar(require("@actions/core"));
const core_1 = require("@actions/core");
const pull_1 = require("../services/pull");
const label_1 = require("../services/label");
const constants_1 = require("./constants");
const labels_config_1 = require("./labels-config");
const pull_request_size_1 = require("./pull-request-size");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const githubToken = (0, core_1.getInput)("GITHUB_TOKEN", { required: true });
            const pullRequest = github.context.payload.pull_request;
            if (!pullRequest) {
                core.warning("Could not get pull request number from context, exiting");
                return;
            }
            if (github.context.eventName !== "pull_request") {
                core.warning("Comment only will be created on pull requests!");
                return;
            }
            const octokit = github.getOctokit(githubToken);
            yield checkRepositoryLabels(octokit);
            const changedFiles = yield (0, pull_1.getPullRequestFiles)(octokit, pullRequest.number);
            const detectedLabels = [];
            const sizeLabel = (0, pull_request_size_1.getPullRequestSizeLabel)(changedFiles);
            detectedLabels.push(sizeLabel);
            core.info(`\nDetected labels:`);
            detectedLabels.forEach((detectedLabel, index) => {
                core.info(`[${index + 1}/${detectedLabels.length}]\t [${detectedLabel}]`);
            });
            const pullRequestLabels = yield (0, label_1.listLabelsForPullRequest)(octokit, pullRequest.number);
            const differences = getLabelsDifferences(pullRequestLabels.map((label) => label.name), detectedLabels, [...constants_1.allLabelsNames]);
            if (differences.remove.length) {
                core.info("\nRemoving labels from pull request...");
                for (const labelToRemove of differences.remove) {
                    const index = differences.remove.indexOf(labelToRemove);
                    yield (0, label_1.removeLabelFromPullRequest)(octokit, pullRequest.number, labelToRemove);
                    core.info(`[${index + 1}/${differences.remove.length}]\tRemoved label: ${labelToRemove}`);
                }
            }
            if (differences.add.length) {
                core.info("\nAdding labels to pull request...");
                yield (0, label_1.addLabelsToPullRequest)(octokit, pullRequest.number, detectedLabels);
                for (const labelToAdd of differences.add) {
                    const index = differences.add.indexOf(labelToAdd);
                    core.info(`[${index + 1}/${differences.add.length}]\tAdded label: ${labelToAdd}`);
                }
            }
            if (!differences.add.length && !differences.remove.length) {
                core.info("\nAll pull request labels are up to date");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                core.error(error);
                core.setFailed(error.message);
            }
        }
    });
}
exports.main = main;
function checkRepositoryLabels(client) {
    return __awaiter(this, void 0, void 0, function* () {
        core.info("Checking Repository Labels...");
        const repoLabels = yield (0, label_1.listLabelsForRepository)(client);
        const labelsToAdd = [...constants_1.allLabelsNames];
        const labelsToUpdate = [];
        let foundLabelCount = 0;
        repoLabels.forEach((label) => {
            const labelName = label.name;
            if (constants_1.allLabelsNames.includes(labelName) && !label.default) {
                core.info(`[${foundLabelCount + 1}/${constants_1.allLabelsNames.length}]\tA supported label was found: [${label.name}]`);
                foundLabelCount = foundLabelCount + 1;
                if (!validateLabelWithConfiguration(label, labels_config_1.labelsConfig[labelName])) {
                    labelsToUpdate.push(labelName);
                }
                labelsToAdd.splice(labelsToAdd.indexOf(labelName), 1);
            }
        });
        if (labelsToUpdate.length) {
            core.info("\nUpdating repository labels...");
            for (const labelToUpdate of labelsToUpdate) {
                const index = labelsToUpdate.indexOf(labelToUpdate);
                yield (0, label_1.updateLabel)(client, labels_config_1.labelsConfig[labelToUpdate]);
                core.info(`[${index + 1}/${labelsToUpdate.length}]\tUpdated label: ${labelToUpdate}`);
            }
        }
        if (labelsToAdd.length) {
            core.info("\nCreating repository labels...");
            for (const labelToAdd of labelsToAdd) {
                const index = labelsToAdd.indexOf(labelToAdd);
                yield (0, label_1.createLabel)(client, labels_config_1.labelsConfig[labelToAdd]);
                core.info(`[${index + 1}/${labelsToAdd.length}]\tCreate label: ${labelToAdd}`);
            }
        }
        if (!labelsToAdd.length && !labelsToUpdate.length) {
            core.info("All labels are up to date");
        }
    });
}
function validateLabelWithConfiguration(label, labelConfiguration) {
    return (label.name === labelConfiguration.name &&
        label.color === labelConfiguration.color &&
        label.description === labelConfiguration.description);
}
function getLabelsDifferences(pullRequestLabels, labels, allLabels) {
    core.info("\nGetting differences...");
    labels = labels.filter((label) => allLabels.includes(label));
    const pullRequestSupportedLabels = pullRequestLabels.filter((prLabel) => allLabels.includes(prLabel));
    return {
        add: labels.filter((label) => !pullRequestSupportedLabels.includes(label)),
        remove: pullRequestSupportedLabels.filter((label) => !labels.includes(label))
    };
}
exports.getLabelsDifferences = getLabelsDifferences;
main();
