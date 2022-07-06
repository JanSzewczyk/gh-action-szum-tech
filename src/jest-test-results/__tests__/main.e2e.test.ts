import { describe, expect, test, jest } from "@jest/globals";
import * as github from "@actions/github";
import * as core from "@actions/core";
import { OctokitClient } from "@types";
import { buildIssueComment } from "@tests/builders/comment.builder";
import { main } from "../main";
import { getParametersDescription } from "@utils/utils";
import { faker } from "@faker-js/faker";

const RESULT_FILE_PATH = "./src/tests/mocks/jest-test-results/jest-results-correct.json";
const EMPTY_RESULT_FILE_PATH = "./src/tests/mocks/jest-test-results/jest-results-empty.json";
const NOT_EXISTS_RESULT_FILE_PATH = "./src/tests/mocks/jest-test-results/not-exists-jest-results.json";

jest.mock("@actions/core");
jest.mock("@actions/github");

const mockedGetOctokit = github.getOctokit as jest.MockedFunction<typeof github.getOctokit>;
const mockedGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;
const mockedGetBooleanInput = core.getBooleanInput as jest.MockedFunction<typeof core.getBooleanInput>;

// Shallow clone original @actions/github context
const originalContext = { ...github.context };

const pullRequestNumber = 21;
const mockDate = new Date("2020-02-19");
const pullRequestSha = faker.git.commitSha();
const contextSha = faker.git.commitSha();
const issueCommentBuilder = buildIssueComment({ pullRequestNumber });

const testResultsComment = issueCommentBuilder({ traits: "jestTestResultMessage" });

function mockCoreInputs({
  token = "***",
  resultFile = RESULT_FILE_PATH,
  createPRComment = true,
  createStatusCheck = true
} = {}): void {
  mockedGetInput.mockImplementation((name) =>
    name === "GITHUB_TOKEN" ? token : name === "RESULTS_FILE" ? resultFile : ""
  );
  mockedGetBooleanInput.mockImplementation((name) =>
    name === "PR_COMMENT" ? createPRComment : name === "STATUS_CHECK" ? createStatusCheck : false
  );
}

describe("Jest Test Results Action E2E", () => {
  beforeEach(() => {
    // Reset mocks
    mockedGetOctokit.mockReset();
    mockedGetInput.mockReset();
    mockedGetBooleanInput.mockReset();

    // Restore original @actions/github context
    Object.defineProperty(github, "context", {
      value: originalContext
    });
  });

  describe("happy path", () => {
    describe("default config", () => {
      test("should create PR comment and status check when 'eventName' is 'pull_request'", async () => {
        // Mock Github context
        github.context.eventName = "pull_request";
        github.context.sha = contextSha;
        github.context.payload = {
          pull_request: {
            head: { sha: pullRequestSha },
            number: pullRequestNumber
          }
        };

        // Mock GitHub rest function
        const listComments = jest.fn().mockReturnValue({
          data: Array(3)
            .fill(undefined)
            .map(() => issueCommentBuilder())
        });
        const createComment = jest.fn().mockReturnValue({ data: testResultsComment, status: 201 });
        const create = jest.fn().mockReturnValue({ data: testResultsComment, status: 201 });
        const octokit = {
          rest: {
            issues: {
              listComments,
              createComment
            },
            checks: {
              create
            }
          }
        } as unknown as OctokitClient;
        mockedGetOctokit.mockImplementation(() => octokit);

        // Mock core inputs
        mockCoreInputs();

        // Mock Date
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        await main();

        expect(core.info).toHaveBeenCalledWith(
          getParametersDescription({
            GITHUB_TOKEN: "***",
            RESULTS_FILE: RESULT_FILE_PATH,
            PR_COMMENT: true,
            STATUS_CHECK: true
          })
        );
        expect(core.info).toHaveBeenCalledWith("Reading test results from file...");
        expect(core.info).toHaveBeenCalledWith("Building GitHub message...");
        expect(core.info).toHaveBeenCalledWith("Building GitHub message...");
        expect(core.info).toHaveBeenCalledWith(
          `Processing 'Jest Test Results Action E2E happy path should create PR comment and status check when 'eventName' is 'pull_request'' test...`
        );
        expect(core.info).toHaveBeenCalledWith(`Processing 'Jest Test Results Action E2E should ' test...`);

        expect(core.info).toHaveBeenCalledWith("Creating or updating Pull Request comment...");
        expect(core.info).toHaveBeenCalledWith("Checking for existing comment on Pull Request....");
        expect(listComments).toBeCalledTimes(1);
        expect(core.info).toHaveBeenCalledWith(`Finished getting comments for Pull Request #${pullRequestNumber}.`);
        expect(core.info).toHaveBeenCalledWith(`A jest tests result comment was not found.`);
        expect(core.info).toHaveBeenCalledWith(`Creating a new Pull Request comment...`);
        expect(createComment).toBeCalledTimes(1);
        expect(core.info).toHaveBeenCalledWith(`Pull Request #${testResultsComment.id} comment was created.`);

        expect(core.info).toHaveBeenCalledWith("Creating Status Check...");
        expect(core.info).toHaveBeenCalledWith(
          `Creating Status Check for GitSha: #${pullRequestSha} on a '${github.context.eventName}' event`
        );
        expect(core.info).toHaveBeenCalledWith(`Checking time: ${mockDate.toUTCString()}`);
        expect(create).toBeCalledTimes(1);
        expect(core.info).toHaveBeenCalledWith(
          `Status Check #${testResultsComment.id} was created with response status 201.`
        );
        expect(core.info).toBeCalledTimes(15);
      });

      test("should should skip PR comment and create status check when 'eventName' is not 'pull_request'", async () => {
        // Mock Github context
        github.context.eventName = "issue";
        github.context.sha = contextSha;

        // Mock GitHub rest function
        const create = jest.fn().mockReturnValue({ data: testResultsComment, status: 201 });
        const octokit = {
          rest: {
            checks: {
              create
            }
          }
        } as unknown as OctokitClient;
        mockedGetOctokit.mockImplementation(() => octokit);

        // Mock core inputs
        mockCoreInputs();

        // Mock Date
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        await main();

        expect(core.info).toHaveBeenCalledWith(
          getParametersDescription({
            GITHUB_TOKEN: "***",
            RESULTS_FILE: RESULT_FILE_PATH,
            PR_COMMENT: true,
            STATUS_CHECK: true
          })
        );
        expect(core.info).toHaveBeenCalledWith("Reading test results from file...");
        expect(core.info).toHaveBeenCalledWith("Building GitHub message...");
        expect(core.info).toHaveBeenCalledWith(
          `Processing 'Jest Test Results Action E2E happy path should create PR comment and status check when 'eventName' is 'pull_request'' test...`
        );
        expect(core.info).toHaveBeenCalledWith(`Processing 'Jest Test Results Action E2E should ' test...`);

        expect(core.info).toHaveBeenCalledWith("Creating or updating Pull Request comment...");
        expect(core.info).toHaveBeenCalledWith(
          "This event was not triggered by a `pull_request` event. No comment will be created or updated."
        );

        expect(core.info).toHaveBeenCalledWith("Creating Status Check...");
        expect(core.info).toHaveBeenCalledWith(
          `Creating Status Check for GitSha: #${contextSha} on a '${github.context.eventName}' event`
        );
        expect(core.info).toHaveBeenCalledWith(`Checking time: ${mockDate.toUTCString()}`);
        expect(create).toBeCalledTimes(1);
        expect(core.info).toHaveBeenCalledWith(
          `Status Check #${testResultsComment.id} was created with response status 201.`
        );
        expect(core.info).toBeCalledTimes(11);
      });
    });

    test("should create only PR comment", async () => {
      // Mock Github context
      github.context.eventName = "pull_request";
      github.context.sha = contextSha;
      github.context.payload = {
        pull_request: {
          head: { sha: pullRequestSha },
          number: pullRequestNumber
        }
      };

      // Mock GitHub rest function
      const listComments = jest.fn().mockReturnValue({
        data: Array(3)
          .fill(undefined)
          .map(() => issueCommentBuilder())
      });
      const createComment = jest.fn().mockReturnValue({ data: testResultsComment, status: 201 });
      const octokit = {
        rest: {
          issues: {
            listComments,
            createComment
          }
        }
      } as unknown as OctokitClient;
      mockedGetOctokit.mockImplementation(() => octokit);

      // Mock core inputs
      mockCoreInputs({
        createStatusCheck: false
      });

      await main();

      expect(core.info).toHaveBeenCalledWith(
        getParametersDescription({
          GITHUB_TOKEN: "***",
          RESULTS_FILE: RESULT_FILE_PATH,
          PR_COMMENT: true,
          STATUS_CHECK: false
        })
      );
      expect(core.info).toHaveBeenCalledWith("Reading test results from file...");
      expect(core.info).toHaveBeenCalledWith("Building GitHub message...");
      expect(core.info).toHaveBeenCalledWith(
        `Processing 'Jest Test Results Action E2E happy path should create PR comment and status check when 'eventName' is 'pull_request'' test...`
      );
      expect(core.info).toHaveBeenCalledWith(`Processing 'Jest Test Results Action E2E should ' test...`);

      expect(core.info).toHaveBeenCalledWith("Creating or updating Pull Request comment...");
      expect(core.info).toHaveBeenCalledWith("Checking for existing comment on Pull Request....");
      expect(listComments).toBeCalledTimes(1);
      expect(core.info).toHaveBeenCalledWith(`Finished getting comments for Pull Request #${pullRequestNumber}.`);
      expect(core.info).toHaveBeenCalledWith(`A jest tests result comment was not found.`);
      expect(core.info).toHaveBeenCalledWith(`Creating a new Pull Request comment...`);
      expect(createComment).toBeCalledTimes(1);
      expect(core.info).toHaveBeenCalledWith(`Pull Request #${testResultsComment.id} comment was created.`);
      expect(core.info).toBeCalledTimes(11);
    });

    test("should create only status check", async () => {
      // Mock Github context
      github.context.eventName = "pull_request";
      github.context.sha = contextSha;
      github.context.payload = {
        pull_request: {
          head: { sha: pullRequestSha },
          number: pullRequestNumber
        }
      };

      // Mock GitHub rest function
      const create = jest.fn().mockReturnValue({ data: testResultsComment, status: 201 });
      const octokit = {
        rest: {
          checks: {
            create
          }
        }
      } as unknown as OctokitClient;
      mockedGetOctokit.mockImplementation(() => octokit);

      // Mock core inputs
      mockCoreInputs({
        createPRComment: false
      });

      // Mock Date
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      await main();

      expect(core.info).toHaveBeenCalledWith(
        getParametersDescription({
          GITHUB_TOKEN: "***",
          RESULTS_FILE: RESULT_FILE_PATH,
          PR_COMMENT: false,
          STATUS_CHECK: true
        })
      );
      expect(core.info).toHaveBeenCalledWith("Reading test results from file...");
      expect(core.info).toHaveBeenCalledWith("Building GitHub message...");
      expect(core.info).toHaveBeenCalledWith(
        `Processing 'Jest Test Results Action E2E happy path should create PR comment and status check when 'eventName' is 'pull_request'' test...`
      );
      expect(core.info).toHaveBeenCalledWith(`Processing 'Jest Test Results Action E2E should ' test...`);

      expect(core.info).toHaveBeenCalledWith("Creating Status Check...");
      expect(core.info).toHaveBeenCalledWith(
        `Creating Status Check for GitSha: #${pullRequestSha} on a '${github.context.eventName}' event`
      );
      expect(core.info).toHaveBeenCalledWith(`Checking time: ${mockDate.toUTCString()}`);
      expect(create).toBeCalledTimes(1);
      expect(core.info).toHaveBeenCalledWith(
        `Status Check #${testResultsComment.id} was created with response status 201.`
      );
      expect(core.info).toBeCalledTimes(9);
    });

    test("should not create PR comment or status check", async () => {
      // Mock Github context
      github.context.eventName = "pull_request";
      github.context.sha = contextSha;
      github.context.payload = {
        pull_request: {
          head: { sha: pullRequestSha },
          number: pullRequestNumber
        }
      };

      // Mock core inputs
      mockCoreInputs({
        createPRComment: false,
        createStatusCheck: false
      });

      await main();

      expect(core.info).toHaveBeenCalledWith(
        getParametersDescription({
          GITHUB_TOKEN: "***",
          RESULTS_FILE: RESULT_FILE_PATH,
          PR_COMMENT: false,
          STATUS_CHECK: false
        })
      );
      expect(core.info).toHaveBeenCalledWith("Reading test results from file...");
      expect(core.info).toHaveBeenCalledWith("Building GitHub message...");
      expect(core.info).toHaveBeenCalledWith(
        `Processing 'Jest Test Results Action E2E happy path should create PR comment and status check when 'eventName' is 'pull_request'' test...`
      );
      expect(core.info).toHaveBeenCalledWith(`Processing 'Jest Test Results Action E2E should ' test...`);

      expect(core.info).toBeCalledTimes(5);
    });
  });

  describe("sad path", () => {
    test("should failed when test results file doesn't exists", async () => {
      // Mock Github context
      github.context.eventName = "pull_request";
      github.context.sha = contextSha;
      github.context.payload = {
        pull_request: {
          head: { sha: pullRequestSha },
          number: pullRequestNumber
        }
      };

      // Mock core inputs
      mockCoreInputs({
        resultFile: NOT_EXISTS_RESULT_FILE_PATH
      });

      await main();

      expect(core.info).toHaveBeenCalledWith(
        getParametersDescription({
          GITHUB_TOKEN: "***",
          RESULTS_FILE: NOT_EXISTS_RESULT_FILE_PATH,
          PR_COMMENT: true,
          STATUS_CHECK: true
        })
      );
      expect(core.info).toHaveBeenCalledWith("Reading test results from file...");
      expect(core.setFailed).toHaveBeenCalledWith(
        `The test results file '${NOT_EXISTS_RESULT_FILE_PATH}' does not exists. No Pull Request comment or status check will be created.`
      );

      expect(core.info).toBeCalledTimes(2);
      expect(core.setFailed).toBeCalledTimes(1);
    });

    test("should failed when test results file is empty", async () => {
      // Mock Github context
      github.context.eventName = "pull_request";
      github.context.sha = contextSha;
      github.context.payload = {
        pull_request: {
          head: { sha: pullRequestSha },
          number: pullRequestNumber
        }
      };

      // Mock core inputs
      mockCoreInputs({
        resultFile: EMPTY_RESULT_FILE_PATH
      });

      await main();

      expect(core.info).toHaveBeenCalledWith(
        getParametersDescription({
          GITHUB_TOKEN: "***",
          RESULTS_FILE: EMPTY_RESULT_FILE_PATH,
          PR_COMMENT: true,
          STATUS_CHECK: true
        })
      );
      expect(core.info).toHaveBeenCalledWith("Reading test results from file...");
      expect(core.setFailed).toHaveBeenCalledWith(
        `The test results file '${EMPTY_RESULT_FILE_PATH}' does not contain any data. No Pull Request comment or status check will be created.`
      );

      expect(core.info).toBeCalledTimes(2);
      expect(core.setFailed).toBeCalledTimes(1);
    });
  });
});
