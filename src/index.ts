/* eslint-disable no-console */
import { context } from "@actions/github";
// import { getInput } from "@actions/core";
// import { main as runLabel } from "./label";

// const inputName = getInput("name");
// const githubToken = getInput("GITHUB_TOKEN");

// greet(inputName, getRepositoryUrl(context));

// eslint-disable-next-line github/no-then
// runLabel(githubToken).then(() => {
//   console.log("xxxx");
// });

// getPreviousPRComments().then(() => {
//   // console.log("comments", JSON.stringify(res, undefined, 2));
// });

console.log("--- Action Info ---");
console.log("eventName:", context.eventName);
console.log("sha:", context.sha);
console.log("ref:", context.ref);
console.log("workflow:", context.workflow);
console.log("action:", context.action);
console.log("actor:", context.actor);
console.log("job:", context.job);
console.log("runNumber:", context.runNumber);
console.log("runId:", context.runId);
console.log("apiUrl:", context.apiUrl);
console.log("serverUrl:", context.serverUrl);
console.log("graphqlUrl:", context.graphqlUrl);
console.log("-------------------");
//
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
