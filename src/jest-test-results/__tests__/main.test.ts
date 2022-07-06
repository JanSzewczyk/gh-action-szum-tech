import { describe, expect, test, jest } from "@jest/globals";
import * as github from "@actions/github";
import * as core from "@actions/core";
import { createPullRequestComment, createStatusCheck } from "../main";
import { OctokitClient } from "@types";
import { buildIssueComment } from "@tests/builders/comment.builder";
import { faker } from "@faker-js/faker";
import { JestResults } from "../types";

jest.mock("@actions/core");
jest.mock("@actions/github");

const mockedOctokit = github.getOctokit as jest.MockedFunction<typeof github.getOctokit>;

// Shallow clone original @actions/github context
const originalContext = { ...github.context };

const pullRequestNumber = 21;
const issueCommentBuilder = buildIssueComment({ pullRequestNumber });

const testResultsComment = issueCommentBuilder({ traits: "jestTestResultMessage" });

const jestTestResultsMessage = "Jest Test Results some message";

describe("Jest Test Results Action", () => {
  beforeEach(() => {
    mockedOctokit.mockReset();

    // Restore original @actions/github context
    Object.defineProperty(github, "context", {
      value: originalContext
    });
  });

  describe("createPullRequestComment()", () => {
    test("should skip when 'eventName' is not 'pull_request'", async () => {
      // Mock Github context
      github.context.eventName = "issue";

      const octokitClient = mockedOctokit("token");
      await createPullRequestComment(octokitClient, jestTestResultsMessage);

      expect(core.info).toHaveBeenCalledWith("Creating or updating Pull Request comment...");
      expect(core.info).toHaveBeenCalledWith(
        "This event was not triggered by a `pull_request` event. No comment will be created or updated."
      );
      expect(core.info).toBeCalledTimes(2);
    });

    test("should create new Pull Request comment when 'eventName' is 'pull_request' and there is no message before", async () => {
      // Mock Github context
      github.context.eventName = "pull_request";
      github.context.payload = {
        pull_request: {
          number: pullRequestNumber
        }
      };

      // Mock Github rest function
      const listComments = jest.fn().mockReturnValue({
        data: Array(3)
          .fill(undefined)
          .map(() => issueCommentBuilder())
      });
      // listComments.mockClear();
      const createComment = jest.fn().mockReturnValue({ data: testResultsComment, status: 201 });
      // createComment.mockClear();
      const octokit = {
        rest: {
          issues: {
            listComments,
            createComment
          }
        }
      } as unknown as OctokitClient;
      mockedOctokit.mockImplementation(() => octokit);

      const octokitClient = mockedOctokit("token");
      await createPullRequestComment(octokitClient, jestTestResultsMessage);

      expect(core.info).toHaveBeenCalledWith("Creating or updating Pull Request comment...");
      expect(core.info).toHaveBeenCalledWith("Checking for existing comment on Pull Request....");
      expect(listComments).toBeCalledTimes(1);
      expect(core.info).toHaveBeenCalledWith(`Finished getting comments for Pull Request #${pullRequestNumber}.`);
      expect(core.info).toHaveBeenCalledWith(`A jest tests result comment was not found.`);
      expect(core.info).toHaveBeenCalledWith(`Creating a new Pull Request comment...`);
      expect(createComment).toBeCalledTimes(1);
      expect(core.info).toHaveBeenCalledWith(`Pull Request #${testResultsComment.id} comment was created.`);
      expect(core.info).toBeCalledTimes(6);
    });

    test("should update Pull Request comment when 'eventName' is 'pull_request' and there is no message before", async () => {
      // Mock Github context
      github.context.eventName = "pull_request";
      github.context.payload = {
        pull_request: {
          number: pullRequestNumber
        }
      };

      // Mock Github rest function
      const listComments = jest.fn().mockReturnValue({
        data: [
          ...Array(3)
            .fill(undefined)
            .map(() => issueCommentBuilder()),
          testResultsComment
        ]
      });
      const updateComment = jest.fn().mockReturnValue({ data: testResultsComment, status: 200 });
      const octokit = {
        rest: {
          issues: {
            listComments,
            updateComment
          }
        }
      } as unknown as OctokitClient;
      mockedOctokit.mockImplementation(() => octokit);

      const octokitClient = mockedOctokit("token");
      await createPullRequestComment(octokitClient, jestTestResultsMessage);

      expect(core.info).toHaveBeenCalledWith("Creating or updating Pull Request comment...");
      expect(core.info).toHaveBeenCalledWith("Checking for existing comment on Pull Request....");
      expect(core.info).toHaveBeenCalledWith(`Finished getting comments for Pull Request #${pullRequestNumber}.`);
      expect(listComments).toBeCalledTimes(1);
      expect(core.info).toHaveBeenCalledWith("A jest tests result comment was found.");
      expect(core.info).toHaveBeenCalledWith(`Updating existing Pull Request #${testResultsComment.id} comment...`);
      expect(updateComment).toBeCalledTimes(1);
      expect(core.info).toHaveBeenCalledWith(`Pull Request #${testResultsComment.id} comment was updated.`);
      expect(core.info).toBeCalledTimes(6);
    });
  });

  describe("createStatusCheck()", () => {
    const mockDate = new Date("2020-02-19");

    const pullRequestSha = faker.git.commitSha();
    const contextSha = faker.git.commitSha();

    test("should create check when 'eventName' is 'pull_request'", async () => {
      // Mock Github context
      github.context.eventName = "pull_request";
      github.context.payload = {
        pull_request: {
          head: { sha: pullRequestSha },
          number: pullRequestNumber
        }
      };

      /**
       * TODO create builder
       *
       * Mock jest result
       */
      const jestResult = {
        success: true
      } as JestResults;

      // Mock Date
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const create = jest.fn().mockReturnValue({ data: testResultsComment, status: 201 });

      const octokit = {
        rest: {
          checks: {
            create
          }
        }
      } as unknown as OctokitClient;
      mockedOctokit.mockImplementation(() => octokit);

      const octokitClient = mockedOctokit("token");
      await createStatusCheck(octokitClient, jestResult, jestTestResultsMessage);

      expect(core.info).toHaveBeenCalledWith("Creating Status Check...");
      expect(core.info).toHaveBeenCalledWith(
        `Creating Status Check for GitSha: #${pullRequestSha} on a '${github.context.eventName}' event`
      );
      expect(core.info).toHaveBeenCalledWith(`Checking time: ${mockDate.toUTCString()}`);
      expect(create).toBeCalledTimes(1);
      expect(core.info).toHaveBeenCalledWith(
        `Status Check #${testResultsComment.id} was created with response status 201.`
      );
      expect(core.info).toBeCalledTimes(4);
    });

    test("should create check when 'eventName' is not 'pull_request'", async () => {
      // Mock Github context
      github.context.eventName = "issue";
      github.context.sha = contextSha;

      /**
       * TODO create builder
       *
       * Mock jest result
       */
      const jestResult = {
        success: true
      } as JestResults;

      // Mock Date
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const create = jest.fn().mockReturnValue({ data: testResultsComment, status: 201 });

      const octokit = {
        rest: {
          checks: {
            create
          }
        }
      } as unknown as OctokitClient;
      mockedOctokit.mockImplementation(() => octokit);

      const octokitClient = mockedOctokit("token");
      await createStatusCheck(octokitClient, jestResult, jestTestResultsMessage);

      expect(core.info).toHaveBeenCalledWith("Creating Status Check...");
      expect(core.info).toHaveBeenCalledWith(
        `Creating Status Check for GitSha: #${contextSha} on a '${github.context.eventName}' event`
      );
      expect(core.info).toHaveBeenCalledWith(`Checking time: ${mockDate.toUTCString()}`);
      expect(create).toBeCalledTimes(1);
      expect(core.info).toHaveBeenCalledWith(
        `Status Check #${testResultsComment.id} was created with response status 201.`
      );
      expect(core.info).toBeCalledTimes(4);
    });
  });
});
