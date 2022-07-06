import { faker } from "@faker-js/faker";
import { build, oneOf } from "@jackfranklin/test-data-bot";

import { ReturnBuilderFunction } from "../types/builder";
import { PullRequest, PullRequestRepo, PullRequestUser } from "@types";
import { buildLabel } from "@tests/builders/label.builder";

interface BuildPullRequestArgs {
  baseBranch?: string;
  currentBranch?: string;
  pullRequestNumber?: number;
  repoName?: string;
  userName?: string;
}

export function buildPullRequest({
  baseBranch = "main",
  currentBranch = faker.git.branch(),
  pullRequestNumber = faker.datatype.number({ min: 1 }),
  repoName = faker.internet.domainWord(),
  userName = faker.internet.userName()
}: BuildPullRequestArgs = {}): ReturnBuilderFunction<PullRequest> {
  const pullRequestUserBuilder = buildPullRequestUser({ userName });
  const prUser = pullRequestUserBuilder();

  const pullRequestRepoBuilder = buildPullRequestRepo({
    baseBranch,
    owner: prUser,
    userName,
    repoName
  });
  const repo = pullRequestRepoBuilder();

  return build<PullRequest>({
    fields: {
      url: `https://api.github.com/repos/${userName}/${repoName}/pulls/${pullRequestNumber}`,
      id: faker.datatype.number({ min: 10000000, max: 99999999 }),
      node_id: faker.datatype.string(20),
      html_url: `https://github.com/${userName}/${repoName}/pull/${pullRequestNumber}`,
      diff_url: `https://github.com/${userName}/${repoName}/pull/${pullRequestNumber}.diff`,
      patch_url: `https://github.com/${userName}/${repoName}/pull/${pullRequestNumber}.patch`,
      issue_url: `https://api.github.com/repos/${userName}/${repoName}/issues/${pullRequestNumber}`,
      commits_url: `https://api.github.com/repos/octocat/${userName}/${repoName}/${pullRequestNumber}/commits`,
      review_comments_url: `https://api.github.com/repos/${userName}/${repoName}/pulls/${pullRequestNumber}/comments`,
      review_comment_url: `https://api.github.com/repos/${userName}/${repoName}/pulls/comments{/number}`,
      comments_url: `https://api.github.com/repos/${userName}/${repoName}/issues/${pullRequestNumber}/comments`,
      statuses_url: `https://api.github.com/repos/${userName}/${repoName}/statuses/6dcb09b5b57875f334f61aebed695e2e4193db5e`,
      number: pullRequestNumber,
      state: oneOf("open", "closed"),
      locked: faker.datatype.boolean(),
      title: faker.lorem.sentence(),
      user: pullRequestUserBuilder(),
      body: faker.lorem.text(),
      labels: Array(faker.datatype.number({ min: 0, max: 7 })).map(() => buildLabel()()),
      milestone: {
        url: `https://api.github.com/repos/${userName}/${repoName}/milestones/${pullRequestNumber}`,
        html_url: `https://github.com/${userName}/${repoName}/milestones/v1.0`,
        labels_url: `https://api.github.com/repos/${userName}/${repoName}/milestones/${pullRequestNumber}/labels`,
        id: faker.datatype.number({ min: 10000000, max: 99999999 }),
        node_id: faker.datatype.string(20),
        number: faker.datatype.number({ min: 1, max: 10 }),
        state: "open",
        title: "v1.0",
        description: faker.lorem.sentence(),
        creator: prUser,
        open_issues: faker.datatype.number({ min: 1, max: 10 }),
        closed_issues: faker.datatype.number({ min: 1, max: 10 }),
        created_at: faker.datatype.datetime().toISOString(),
        updated_at: faker.datatype.datetime().toISOString(),
        closed_at: oneOf(faker.datatype.datetime().toISOString(), null),
        due_on: oneOf(faker.datatype.datetime().toISOString(), null)
      },
      active_lock_reason: oneOf("too heated", null),
      created_at: faker.datatype.datetime().toISOString(),
      updated_at: faker.datatype.datetime().toISOString(),
      closed_at: oneOf(faker.datatype.datetime().toISOString(), null),
      merged_at: oneOf(faker.datatype.datetime().toISOString(), null),
      merge_commit_sha: faker.git.commitSha(),
      assignee: oneOf(prUser, buildPullRequestUser()(), null),
      assignees: [prUser],
      requested_reviewers: Array(faker.datatype.number({ min: 0, max: 3 })).map(() => buildPullRequestUser()()),
      requested_teams: [
        // {
        //   id: 1,
        //   node_id: "MDQ6VGVhbTE=",
        //   url: "https://api.github.com/teams/1",
        //   html_url: "https://github.com/orgs/github/teams/justice-league",
        //   name: "Justice League",
        //   slug: "justice-league",
        //   description: "A great team.",
        //   privacy: "closed",
        //   permission: "admin",
        //   members_url: "https://api.github.com/teams/1/members{/member}",
        //   repositories_url: "https://api.github.com/teams/1/repos"
        // }
      ],
      head: {
        label: `${userName}:${currentBranch}`,
        ref: currentBranch,
        sha: faker.git.commitSha(),
        user: prUser,
        repo
      },
      base: {
        label: `${userName}:${baseBranch}`,
        ref: baseBranch,
        sha: faker.git.commitSha(),
        user: pullRequestUserBuilder(),
        repo
      },
      _links: {
        comments: {
          href: `https://api.github.com/repos/${userName}/${repoName}/issues/${pullRequestNumber}/comments`
        },
        commits: {
          href: `https://api.github.com/repos/${userName}/${repoName}/pulls/${pullRequestNumber}/commits`
        },
        html: {
          href: `https://github.com/${userName}/${repoName}/pull/${pullRequestNumber}`
        },
        issue: {
          href: `https://api.github.com/repos/${userName}/${repoName}/issues/${pullRequestNumber}`
        },
        review_comment: {
          href: `https://api.github.com/repos/${userName}/${repoName}/pulls/comments{/number}`
        },
        review_comments: {
          href: `https://api.github.com/repos/${userName}/${repoName}/pulls/${pullRequestNumber}/comments`
        },
        self: {
          href: `https://api.github.com/repos/${userName}/${repoName}/pulls/${pullRequestNumber}`
        },
        statuses: {
          href: `https://api.github.com/repos/${userName}/${repoName}/statuses/eabe86b837d1303b17dd7d1234a2128562fa6c7e`
        }
      },
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
      auto_merge: null,
      draft: faker.datatype.boolean(),
      merged: faker.datatype.boolean(),
      mergeable: oneOf(faker.datatype.boolean(), null),
      rebaseable: oneOf(faker.datatype.boolean(), null),
      mergeable_state: "clean",
      merged_by: oneOf(pullRequestUserBuilder(), null),
      comments: faker.datatype.number({ min: 0, max: 10 }),
      review_comments: faker.datatype.number({ min: 0, max: 10 }),
      maintainer_can_modify: faker.datatype.boolean(),
      commits: faker.datatype.number({ min: 1, max: 10 }),
      additions: faker.datatype.number({ min: 1, max: 2000 }),
      deletions: faker.datatype.number({ min: 1, max: 200 }),
      changed_files: faker.datatype.number({ min: 1, max: 20 })
    }
  });
}

// ------------------------------------------ //

interface BuildPullRequestRepoArgs {
  baseBranch?: string;
  repoName?: string;
  userName?: string;
  owner?: PullRequestUser;
}

export function buildPullRequestRepo({
  baseBranch = "main",
  repoName = faker.internet.domainWord(),
  userName = faker.internet.userName(),
  owner = buildPullRequestUser({ userName })()
}: BuildPullRequestRepoArgs = {}): ReturnBuilderFunction<PullRequestRepo> {
  return build<PullRequestRepo>({
    fields: {
      id: faker.datatype.number({ min: 10000000, max: 99999999 }),
      node_id: faker.datatype.string(20),
      name: repoName,
      full_name: `${userName}/${repoName}`,
      owner,
      private: faker.datatype.boolean(),
      html_url: `https://github.com/${userName}/${repoName}`,
      description: faker.lorem.paragraph(),
      fork: faker.datatype.boolean(),
      url: `https://api.github.com/repos/${userName}/${repoName}`,
      archive_url: `https://api.github.com/repos/${userName}/${repoName}/{archive_format}{/ref}`,
      assignees_url: `https://api.github.com/repos/${userName}/${repoName}/assignees{/user}`,
      blobs_url: `https://api.github.com/repos/${userName}/${repoName}/git/blobs{/sha}`,
      branches_url: `https://api.github.com/repos/${userName}/${repoName}/branches{/branch}`,
      collaborators_url: `https://api.github.com/repos/${userName}/${repoName}/collaborators{/collaborator}`,
      comments_url: `https://api.github.com/repos/${userName}/${repoName}/comments{/number}`,
      commits_url: `https://api.github.com/repos/${userName}/${repoName}/commits{/sha}`,
      compare_url: `https://api.github.com/repos/${userName}/${repoName}/compare/{base}...{head}`,
      contents_url: `https://api.github.com/repos/${userName}/${repoName}/contents/{+path}`,
      contributors_url: `https://api.github.com/repos/${userName}/${repoName}/contributors`,
      deployments_url: `https://api.github.com/repos/${userName}/${repoName}/deployments`,
      downloads_url: `https://api.github.com/repos/${userName}/${repoName}/downloads`,
      events_url: `https://api.github.com/repos/${userName}/${repoName}/events`,
      forks_url: `https://api.github.com/repos/${userName}/${repoName}/forks`,
      git_commits_url: `https://api.github.com/repos/${userName}/${repoName}/git/commits{/sha}`,
      git_refs_url: `https://api.github.com/repos/${userName}/${repoName}/git/refs{/sha}`,
      git_tags_url: `https://api.github.com/repos/${userName}/${repoName}/git/tags{/sha}`,
      git_url: `git:github.com/${userName}/${repoName}.git`,
      issue_comment_url: `https://api.github.com/repos/${userName}/${repoName}/issues/comments{/number}`,
      issue_events_url: `https://api.github.com/repos/${userName}/${repoName}/issues/events{/number}`,
      issues_url: `https://api.github.com/repos/${userName}/${repoName}/issues{/number}`,
      keys_url: `https://api.github.com/repos/${userName}/${repoName}/keys{/key_id}`,
      labels_url: `https://api.github.com/repos/${userName}/${repoName}/labels{/name}`,
      languages_url: `https://api.github.com/repos/${userName}/${repoName}/languages`,
      merges_url: `https://api.github.com/repos/${userName}/${repoName}/merges`,
      milestones_url: `https://api.github.com/repos/${userName}/${repoName}/milestones{/number}`,
      notifications_url: `https://api.github.com/repos/${userName}/${repoName}/notifications{?since,all,participating}`,
      pulls_url: `https://api.github.com/repos/${userName}/${repoName}/pulls{/number}`,
      releases_url: `https://api.github.com/repos/${userName}/${repoName}/releases{/id}`,
      ssh_url: `git@github.com:${userName}/${repoName}.git`,
      stargazers_url: `https://api.github.com/repos/${userName}/${repoName}/stargazers`,
      statuses_url: `https://api.github.com/repos/${userName}/${repoName}/statuses/{sha}`,
      subscribers_url: `https://api.github.com/repos/${userName}/${repoName}/subscribers`,
      subscription_url: `https://api.github.com/repos/${userName}/${repoName}/subscription`,
      tags_url: `https://api.github.com/repos/${userName}/${repoName}/tags`,
      teams_url: `https://api.github.com/repos/${userName}/${repoName}/teams`,
      trees_url: `https://api.github.com/repos/${userName}/${repoName}/git/trees{/sha}`,
      clone_url: `https://github.com/${userName}/${repoName}.git`,
      mirror_url: `git:git.example.com/${userName}/${repoName}`,
      hooks_url: `https://api.github.com/repos/${userName}/${repoName}/hooks`,
      svn_url: `https://svn.github.com/${userName}/${repoName}`,
      homepage: "https://github.com",
      language: null,
      forks_count: faker.datatype.number({ min: 0, max: 20 }),
      stargazers_count: faker.datatype.number({ min: 30, max: 100 }),
      watchers_count: faker.datatype.number({ min: 30, max: 100 }),
      size: faker.datatype.number({ min: 50, max: 200 }),
      default_branch: baseBranch,
      open_issues_count: faker.datatype.number({ min: 0, max: 10 }),
      topics: ["octocat", "atom", "electron", "api"],
      has_issues: faker.datatype.boolean(),
      has_projects: faker.datatype.boolean(),
      has_wiki: faker.datatype.boolean(),
      has_pages: faker.datatype.boolean(),
      has_downloads: faker.datatype.boolean(),
      archived: faker.datatype.boolean(),
      disabled: faker.datatype.boolean(),
      pushed_at: faker.datatype.datetime().toISOString(),
      created_at: faker.datatype.datetime().toISOString(),
      updated_at: faker.datatype.datetime().toISOString(),
      permissions: {
        admin: faker.datatype.boolean(),
        push: faker.datatype.boolean(),
        pull: faker.datatype.boolean()
      },
      allow_rebase_merge: faker.datatype.boolean(),
      temp_clone_token: faker.datatype.string(30),
      allow_squash_merge: faker.datatype.boolean(),
      allow_merge_commit: faker.datatype.boolean(),
      forks: faker.datatype.number({ min: 0, max: 20 }),
      open_issues: faker.datatype.number({ min: 0, max: 20 }),
      license: {
        key: "mit",
        name: "MIT License",
        url: "https://api.github.com/licenses/mit",
        spdx_id: "MIT",
        node_id: "MDc6TGljZW5zZW1pdA=="
      },
      watchers: faker.datatype.number({ min: 1, max: 2000 })
    }
  });
}

// ------------------------------------------ //

interface BuildPullRequestUserArgs {
  userName?: string;
}

export function buildPullRequestUser({
  userName = faker.internet.userName()
}: BuildPullRequestUserArgs = {}): ReturnBuilderFunction<PullRequestUser> {
  return build<PullRequestUser>({
    fields: {
      avatar_url: `https://avatars.githubusercontent.com/u/29024606?v=4`,
      events_url: `https://api.github.com/users/${userName}/events{/privacy}`,
      followers_url: `https://api.github.com/users/${userName}/followers`,
      following_url: `https://api.github.com/users/${userName}/following{/other_user}`,
      gists_url: `https://api.github.com/users/${userName}/gists{/gist_id}`,
      gravatar_id: "",
      html_url: `https://github.com/${userName}`,
      id: faker.datatype.number({ min: 10000000, max: 99999999 }),
      login: userName,
      node_id: faker.datatype.string(20),
      organizations_url: `https://api.github.com/users/${userName}/orgs`,
      received_events_url: `https://api.github.com/users/${userName}/received_events`,
      repos_url: `https://api.github.com/users/${userName}/repos`,
      site_admin: faker.datatype.boolean(),
      starred_url: `https://api.github.com/users/${userName}/starred{/owner}{/repo}`,
      subscriptions_url: `https://api.github.com/users/${userName}/subscriptions`,
      type: "User",
      url: `https://api.github.com/users/${userName}`
    }
  });
}
