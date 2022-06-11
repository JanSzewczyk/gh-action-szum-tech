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
exports.removeLabelFromPullRequest = exports.addLabelsToPullRequest = exports.updateLabel = exports.createLabel = exports.listLabelsForPullRequest = exports.listLabelsForRepository = void 0;
const github = __importStar(require("@actions/github"));
function listLabelsForRepository(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: repoLabels } = yield client.rest.issues.listLabelsForRepo(Object.assign({}, github.context.repo));
        return repoLabels;
    });
}
exports.listLabelsForRepository = listLabelsForRepository;
function listLabelsForPullRequest(client, pullRequestNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: repoLabels } = yield client.rest.issues.listLabelsOnIssue(Object.assign(Object.assign({}, github.context.repo), { issue_number: pullRequestNumber }));
        return repoLabels;
    });
}
exports.listLabelsForPullRequest = listLabelsForPullRequest;
function createLabel(client, labelConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.rest.issues.createLabel(Object.assign(Object.assign({}, github.context.repo), labelConfig));
    });
}
exports.createLabel = createLabel;
function updateLabel(client, labelConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.rest.issues.updateLabel(Object.assign(Object.assign({}, github.context.repo), labelConfig));
    });
}
exports.updateLabel = updateLabel;
function addLabelsToPullRequest(client, pullRequestNumber, labels) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.rest.issues.addLabels(Object.assign(Object.assign({}, github.context.repo), { issue_number: pullRequestNumber, labels }));
    });
}
exports.addLabelsToPullRequest = addLabelsToPullRequest;
function removeLabelFromPullRequest(client, pullRequestNumber, label) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.rest.issues.removeLabel(Object.assign(Object.assign({}, github.context.repo), { issue_number: pullRequestNumber, name: label }));
    });
}
exports.removeLabelFromPullRequest = removeLabelFromPullRequest;
