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
const core = __importStar(require("@actions/core"));
function main() {
    core.info("Greetings users");
    core.info("\nHave a good hacking!!");
}
main();
// const inputName = getInput("name");
// const githubToken = getInput("GITHUB_TOKEN");
// greet(inputName, getRepositoryUrl(context));
// getPreviousPRComments().then(() => {
//   // console.log("comments", JSON.stringify(res, undefined, 2));
// });
// console.log("--- Action Info ---");
// console.log("eventName:", context.eventName);
// console.log("sha:", context.sha);
// console.log("ref:", context.ref);
// console.log("workflow:", context.workflow);
// console.log("action:", context.action);
// console.log("actor:", context.actor);
// console.log("job:", context.job);
// console.log("runNumber:", context.runNumber);
// console.log("runId:", context.runId);
// console.log("apiUrl:", context.apiUrl);
// console.log("serverUrl:", context.serverUrl);
// console.log("graphqlUrl:", context.graphqlUrl);
// console.log("-------------------");
// //
// console.log("--- Payload ---");
// console.log(JSON.stringify(context.payload.action, undefined, 2));
// console.log("---------------");
// console.log(JSON.stringify(context.payload.comment, undefined, 2));
// console.log("---------------");
// console.log(JSON.stringify(context.payload.pull_request, undefined, 2));
// console.log("---------------");
//
// //L
// // function getRepositoryUrl({ repo, serverUrl }: GithubContext): string {
// //   return `${serverUrl}/${repo.owner}/${repo.repo}`;
// // }
//
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// async function getDiff(): Promise<any[]> {
//   const octokit = getOctokit(githubToken);
//
//   const result = await octokit.rest.repos.compareCommits({
//     repo: context.repo.repo,
//     owner: context.repo.owner,
//     head: context.payload.pull_request?.head.sha,
//     base: context.payload.pull_request?.base.sha,
//     per_page: 100
//   });
//
//   return result.data.files || [];
// }
//
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// async function getPreviousPRComments(): Promise<any[]> {
//   const pullRequest: GithubContextPayloadPullRequest = context.payload.pull_request;
//
//   if (pullRequest) {
//     const octokit = getOctokit(githubToken);
//
//     const result = await octokit.rest.issues.listComments({
//       owner: context.repo.owner,
//       repo: context.repo.repo,
//       issue_number: pullRequest.number
//     });
//
//     // console.log("jestem to", result);
//     return result.data;
//   }
//
//   return [];
// }
