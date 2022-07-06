// import { faker } from "@faker-js/faker";
// import { ReturnBuilderFunction } from "@tests/types/builder";
// import { GithubContext } from "@types";
// import { build, oneOf } from "@jackfranklin/test-data-bot";
//
// interface BuildContextArgs {
//   pullRequestNumber?: number;
// }
//
// export function buildContext({
//   pullRequestNumber = faker.datatype.number({ min: 1 })
// }: BuildContextArgs = {}): ReturnBuilderFunction<GithubContext> {
//   return build<GithubContext>({
//     fields: {
//       payload: {
//         action: oneOf("synchronize"),
//         after: faker.git.commitSha(),
//         before: faker.git.commitSha(),
//         number: pullRequestNumber
//         // pull_request: buildPullRequest({ pullRequestNumber })() as GithubContext["payload"]["pull_request"],
//         // repository: buildPullRequestRepo()(),
//         // sender: buildPullRequestUser()()
//       },
//       eventName: oneOf("pull_request"),
//       sha: faker.git.commitSha(),
//       ref: `refs/pull/${pullRequestNumber}/merge`,
//       workflow: faker.lorem.sentence(4),
//       action: "__self",
//       actor: faker.internet.userName(),
//       job: faker.lorem.slug(),
//       runNumber: faker.datatype.number({ min: 1 }),
//       runId: faker.datatype.number({ min: 10000000, max: 99999999 }),
//       apiUrl: "https://api.github.com",
//       serverUrl: "https://github.com",
//       graphqlUrl: "https://api.github.com/graphql"
//     }
//   });
// }
