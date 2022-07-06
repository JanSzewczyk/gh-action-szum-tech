import { describe, expect, test, jest } from "@jest/globals";
import * as github from "@actions/github";
import * as core from "@actions/core";
import { createPullRequestComment } from "../main";
import { OctokitClient } from "@types";

jest.mock("@actions/core");
jest.mock("@actions/github");

const mockedOctokit = github.getOctokit as jest.MockedFunction<typeof github.getOctokit>;

describe("Jest Test Results Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedOctokit.mockReset(); // one of them <---
    mockedOctokit.mockClear();
  });

  test("placeholder test22 2 2", async () => {
    github.context.eventName = "pull_request";
    github.context.payload = {
      pull_request: {
        number: 23
      }
    };

    const listComments = jest.fn().mockReturnValue({ data: [{ a: "dasda" }] });
    listComments.mockClear();

    const octokit = {
      rest: {
        issues: {
          listComments
        }
      }
    } as unknown as OctokitClient;

    mockedOctokit.mockImplementation(() => octokit);

    const octokitClient = github.getOctokit("token");
    await createPullRequestComment(octokitClient, "Some Message");

    expect(core.info).toHaveBeenCalledWith("Creating or updating Pull Request comment...");
    expect(core.info).toHaveBeenCalledWith("Checking for existing comment on Pull Request....");
    expect(core.info).toHaveBeenCalledWith(`Finished getting comments for Pull Request #${23}.`);
  });

  test("placeholder t 2", async () => {
    github.context.eventName = "pull_request";
    github.context.payload = {
      pull_request: {
        number: 23
      }
    };

    const listComments = jest.fn().mockReturnValue({ data: [{ sss: "dasda" }] });
    listComments.mockClear();

    // const octokit = {
    //   rest: {
    //     issues: {
    //       listComments
    //     }
    //   }
    // } as unknown as OctokitClient;
    //
    // mockedOctokit.mockImplementation(() => octokit);

    const octokitClient = github.getOctokit("token");
    await createPullRequestComment(octokitClient, "Some Message");

    expect(core.info).toHaveBeenCalledWith("Creating or updating Pull Request comment...");
    expect(core.info).toHaveBeenCalledWith("Checking for existing comment on Pull Request....");
    expect(core.info).toHaveBeenCalledWith(`Finished getting comments for Pull Request #${23}.`);
  });
});
