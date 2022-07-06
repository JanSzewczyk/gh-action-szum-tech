import { faker } from "@faker-js/faker";
import { build, oneOf, sequence } from "@jackfranklin/test-data-bot";

import { ReturnBuilderFunction } from "../types/builder";
import { CheckRun, CheckRunConclusion, CheckRunStatus } from "@types";

interface BuildCheckRunArgs {
  repoName?: string;
}

export function buildCheckRun({
  repoName = faker.internet.domainWord()
}: BuildCheckRunArgs = {}): ReturnBuilderFunction<CheckRun> {
  return build<CheckRun>({
    fields: {
      id: sequence(() => faker.datatype.number({ min: 1 })),
      head_sha: sequence(() => faker.git.commitSha()),
      node_id: sequence(() => faker.datatype.string(20)),
      external_id: sequence(() => `${faker.datatype.number({ min: 1 })}`),
      url: `https://api.github.com/repos/github/${repoName}/check-runs/{id}`,
      html_url: `https://github.com/github/${repoName}/runs/{id}`,
      details_url: faker.internet.url(),
      status: oneOf(...Object.values(CheckRunStatus)),
      conclusion: oneOf(...Object.values(CheckRunConclusion), null),
      started_at: faker.datatype.datetime().toISOString(),
      completed_at: null,
      output: {
        title: "Mighty Readme report",
        summary: "There are 0 failures, 2 warnings, and 1 notice.",
        text: "You may have some misspelled words on lines 2 and 4. You also may want to add a section in your README about how to install your app.",
        annotations_count: 2,
        annotations_url: `https://api.github.com/repos/github/${repoName}/check-runs/{id}/annotations`
      },
      name: "mighty_readme",
      check_suite: {
        id: 5
      },
      app: {
        id: 1,
        slug: "octoapp",
        node_id: "MDExOkludGVncmF0aW9uMQ==",
        owner: {
          login: "github",
          id: 1,
          node_id: "MDEyOk9yZ2FuaXphdGlvbjE=",
          url: "https://api.github.com/orgs/github",
          repos_url: "https://api.github.com/orgs/github/repos",
          events_url: "https://api.github.com/orgs/github/events",
          avatar_url: "https://github.com/images/error/octocat_happy.gif",
          gravatar_id: "",
          html_url: "https://github.com/octocat",
          followers_url: "https://api.github.com/users/octocat/followers",
          following_url: "https://api.github.com/users/octocat/following{/other_user}",
          gists_url: "https://api.github.com/users/octocat/gists{/gist_id}",
          starred_url: "https://api.github.com/users/octocat/starred{/owner}{/repo}",
          subscriptions_url: "https://api.github.com/users/octocat/subscriptions",
          organizations_url: "https://api.github.com/users/octocat/orgs",
          received_events_url: "https://api.github.com/users/octocat/received_events",
          type: "User",
          site_admin: true
        },
        name: "Octocat App",
        description: "",
        external_url: "https://example.com",
        html_url: "https://github.com/apps/octoapp",
        created_at: "2017-07-08T16:18:44-04:00",
        updated_at: "2017-07-08T16:18:44-04:00",
        permissions: {
          metadata: "read",
          contents: "read",
          issues: "write",
          single_file: "write"
        },
        events: ["push", "pull_request"]
      },
      pull_requests: [
        {
          url: "https://api.github.com/repos/github/hello-world/pulls/1",
          id: 1934,
          number: 3956,
          head: {
            ref: "say-hello",
            sha: "3dca65fa3e8d4b3da3f3d056c59aee1c50f41390",
            repo: {
              id: 526,
              url: "https://api.github.com/repos/github/hello-world",
              name: "hello-world"
            }
          },
          base: {
            ref: "master",
            sha: "e7fdf7640066d71ad16a86fbcbb9c6a10a18af4f",
            repo: {
              id: 526,
              url: "https://api.github.com/repos/github/hello-world",
              name: "hello-world"
            }
          }
        }
      ]
    },
    postBuild: (checkRun) => {
      checkRun.url = `https://api.github.com/repos/github/${repoName}/check-runs/${checkRun.id}`;
      checkRun.html_url = `https://github.com/github/${repoName}/runs/${checkRun.id}`;
      checkRun.output.annotations_url = `https://api.github.com/repos/github/${repoName}/check-runs/${checkRun.id}/annotations`;

      return checkRun;
    },
    traits: {
      completed: {
        overrides: {
          completed_at: faker.datatype.datetime().toISOString()
        }
      }
    }
  });
}
