import { faker } from "@faker-js/faker";
import { build, oneOf, sequence } from "@jackfranklin/test-data-bot";

import { ReturnBuilderFunction } from "../types/builder";
import { SimpleUser } from "@types";

export function buildSimpleUser(): ReturnBuilderFunction<SimpleUser> {
  return build<SimpleUser>("SimpleUser", {
    fields: {
      login: sequence(() => faker.internet.userName()),
      id: sequence(() => faker.datatype.number({ min: 10000000, max: 99999999 })),
      node_id: sequence(() => faker.datatype.string(20)),
      avatar_url: sequence(() => faker.internet.url()),
      gravatar_id: "",
      url: "https://api.github.com/users/{login}",
      html_url: sequence(() => faker.internet.url()),
      followers_url: "https://api.github.com/users/{login}/followers",
      following_url: "https://api.github.com/users/{login}/following{/other_user}",
      gists_url: "https://api.github.com/users/{login}/gists{/gist_id}",
      starred_url: "https://api.github.com/users/{login}/starred{/owner}{/repo}",
      subscriptions_url: "https://api.github.com/users/{login}/subscriptions",
      organizations_url: "https://api.github.com/users/{login}/orgs",
      repos_url: "https://api.github.com/users/{login}/repos",
      events_url: "https://api.github.com/users/{login}/events{/privacy}",
      received_events_url: "https://api.github.com/users/{login}/received_events",
      type: oneOf("Bot", "User"),
      site_admin: false
    },
    postBuild: (simpleUser) => {
      const userLogin = encodeURIComponent(simpleUser.login);
      simpleUser.url = `https://api.github.com/users/${userLogin}`;
      simpleUser.followers_url = `https://api.github.com/users/${userLogin}/followers`;
      simpleUser.following_url = `https://api.github.com/users/${userLogin}/following{/other_user}`;
      simpleUser.gists_url = `https://api.github.com/users/${userLogin}/gists{/gist_id}`;
      simpleUser.starred_url = `https://api.github.com/users/${userLogin}/starred{/owner}{/repo}`;
      simpleUser.subscriptions_url = `https://api.github.com/users/${userLogin}/subscriptions`;
      simpleUser.organizations_url = `https://api.github.com/users/${userLogin}/orgs`;
      simpleUser.repos_url = `https://api.github.com/users/${userLogin}/repos`;
      simpleUser.events_url = `https://api.github.com/users/${userLogin}/events{/privacy}`;
      simpleUser.received_events_url = `https://api.github.com/users/${userLogin}/received_events`;

      return simpleUser;
    },
    traits: {
      githubBot: {
        overrides: {
          login: "github-actions[bot]",
          type: "Bot"
        }
      }
    }
  });
}
