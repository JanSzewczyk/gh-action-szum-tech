import { faker } from "@faker-js/faker";
import { build, oneOf, sequence } from "@jackfranklin/test-data-bot";

import { ReturnBuilderFunction } from "../types/builder";
import { IssueComment } from "@types";
import { buildSimpleUser } from "@tests/builders/user.builder";

interface BuildIssueCommentArgs {
  pullRequestNumber?: number;
  repoName?: string;
  ownerName?: string;
}

export function buildIssueComment({
  pullRequestNumber = faker.datatype.number({ min: 1 }),
  repoName = faker.internet.domainWord(),
  ownerName = faker.internet.userName()
}: BuildIssueCommentArgs = {}): ReturnBuilderFunction<IssueComment> {
  return build<IssueComment>("IssueComment", {
    fields: {
      url: `https://api.github.com/repos/${ownerName}/${repoName}/issues/comments/id`,
      html_url: `https://github.com/${ownerName}/${repoName}/pull/${pullRequestNumber}#issuecomment-id`,
      issue_url: `https://api.github.com/repos/${ownerName}/${repoName}/issues/${pullRequestNumber}`,
      id: sequence(() => faker.datatype.number({ min: 10000000, max: 99999999 })),
      node_id: sequence(() => faker.datatype.string(20)),
      user: buildSimpleUser()({ traits: "githubBot" }),
      created_at: faker.datatype.datetime().toISOString(),
      updated_at: faker.datatype.datetime().toISOString(),
      author_association: oneOf(
        "COLLABORATOR",
        "CONTRIBUTOR",
        "FIRST_TIMER",
        "FIRST_TIME_CONTRIBUTOR",
        "MANNEQUIN",
        "MEMBER",
        "NONE",
        "OWNER"
      ),
      body: faker.lorem.text(),
      reactions: {
        url: `https://api.github.com/repos/${ownerName}/${repoName}/issues/comments/id/reactions`,
        total_count: 0,
        "+1": sequence(() => faker.datatype.number({ min: 0, max: 10 })),
        "-1": sequence(() => faker.datatype.number({ min: 0, max: 10 })),
        laugh: sequence(() => faker.datatype.number({ min: 0, max: 10 })),
        hooray: sequence(() => faker.datatype.number({ min: 0, max: 10 })),
        confused: sequence(() => faker.datatype.number({ min: 0, max: 10 })),
        heart: sequence(() => faker.datatype.number({ min: 0, max: 10 })),
        rocket: sequence(() => faker.datatype.number({ min: 0, max: 10 })),
        eyes: sequence(() => faker.datatype.number({ min: 0, max: 10 }))
      },
      performed_via_github_app: null
    },
    postBuild: (issueComment) => {
      issueComment.url = `https://api.github.com/repos/${ownerName}/${repoName}/issues/comments/${issueComment.id}`;
      issueComment.html_url = `https://github.com/${ownerName}/${repoName}/pull/${pullRequestNumber}#issuecomment-${issueComment.id}`;

      if (issueComment.reactions) {
        issueComment.reactions.url = `https://api.github.com/repos/${ownerName}/${repoName}/issues/comments/${issueComment.id}/reactions`;

        issueComment.reactions.total_count =
          issueComment.reactions["+1"] +
          issueComment.reactions["-1"] +
          issueComment.reactions.laugh +
          issueComment.reactions.heart +
          issueComment.reactions.hooray +
          issueComment.reactions.confused +
          issueComment.reactions.rocket +
          issueComment.reactions.eyes;
      }

      return issueComment;
    },
    traits: {
      jestTestResultMessage: {
        overrides: {
          body: `<!-- szum-tech/jest-test-results -->\n\n ${faker.lorem.text()}`
        }
      }
    }
  });
}
