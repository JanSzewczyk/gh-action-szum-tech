import * as core from "@actions/core";
import * as fs from "fs";
import { JestAssertionResult, JestResults, JestResultStatus, JestTestResult } from "./types";
import githubMessageBuilder from "../utils/github-message-builder/github-message-builder";
import { codeDecorator, detailsBuilder } from "../utils/github-message-builder";

export async function readTestsResultsFromJSONFile(fileName: string): Promise<JestResults | null> {
  core.info("Reading test results from file...");

  if (fs.existsSync(fileName)) {
    const raw = fs.readFileSync(fileName, "utf8");

    if (!raw) {
      core.setFailed(
        `The test results file '${fileName}' does not contain any data. No Pull Request comment or status check will be created.`
      );
      return null;
    }

    return JSON.parse(raw);
  } else {
    core.setFailed(
      `The test results file '${fileName}' does not exists. No Pull Request comment or status check will be created.`
    );
    return null;
  }
}

export function createTestReportMessage(jestResults: JestResults): string | null {
  return githubMessageBuilder()
    .watermark("szum-tech/jest-test-results")
    .h1(`Jest Test Results  ${buildTestBadge(jestResults)}`)
    .add(buildTestDurationDetails(jestResults))
    .add(buildTestCounters(jestResults))
    .hr()
    .add(...buildTestResults(jestResults))
    .build();
}

export function buildTestBadge(jestResults: JestResults): string {
  const totalTestsCount = jestResults.numTotalTests;
  const passedTestsCount = jestResults.numPassedTests;
  const failedTestsCount = jestResults.numFailedTests;

  const badgeText =
    failedTestsCount > 0
      ? `${`${failedTestsCount}/${totalTestsCount}`}`
      : `${`${passedTestsCount}/${totalTestsCount}`}`;
  const badgeStatusText = failedTestsCount > 0 || !jestResults.success ? "FAILED" : "PASSED";
  const badgeColor = failedTestsCount > 0 || !jestResults.success ? "red" : "brightgreen";

  return `![Generic badge](https://img.shields.io/badge/${badgeText}-${badgeStatusText}-${badgeColor}.svg)`;
}

function formatDate(dateToFormat: Date): string {
  return new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZoneName: "short"
  }).format(dateToFormat);
}

function buildTestDurationDetails(jestResults: JestResults): string | null {
  const startDate = jestResults.startTime;
  const endDate = jestResults.testResults
    .map((m) => m.endTime)
    .sort((a, b) => {
      return b - a;
    })[0];

  const duration = (endDate - startDate) / 1000;

  return detailsBuilder()
    .summary(({ bold }) => `Duration: ${bold(`${duration} second(s)`)}`)
    .body((messageBuilder) =>
      messageBuilder()
        .br()
        .table((tableBuilder) =>
          tableBuilder().body((rowBuilder) => [
            rowBuilder()
              .th("Start")
              .td(codeDecorator(formatDate(new Date(startDate)))),
            rowBuilder()
              .th("Finish")
              .td(codeDecorator(formatDate(new Date(endDate)))),
            rowBuilder()
              .th("Duration")
              .td(codeDecorator(`${duration} second(s)`))
          ])
        )
    )
    .build();
}

function buildTestCounters(jestResults: JestResults): string | null {
  const counterRows = [
    {
      label: "Total Test Suites",
      value: jestResults.numTotalTestSuites
    },
    {
      label: "Total Tests",
      value: jestResults.numTotalTests
    },
    {
      label: "Failed Test Suites",
      value: jestResults.numFailedTestSuites
    },
    {
      label: "Failed Tests",
      value: jestResults.numFailedTests
    },
    {
      label: "Passed Test Suites",
      value: jestResults.numPassedTestSuites
    },
    {
      label: "Pending Test Suites",
      value: jestResults.numPendingTestSuites
    },
    {
      label: "Pending Tests",
      value: jestResults.numPendingTestSuites
    },
    {
      label: "Runtime Error Test Suites",
      value: jestResults.numRuntimeErrorTestSuites
    },
    {
      label: "TODO Tests",
      value: jestResults.numTodoTests
    }
  ];

  return detailsBuilder()
    .summary(
      ({ bold }) =>
        `Status: ${bold(jestResults.success ? "Passed" : "Failed")} | Total Tests: ${bold(
          `${jestResults.numTotalTests}`
        )} | Passed: ${bold(`${jestResults.numPassedTests}`)} | Failed: ${bold(`${jestResults.numFailedTests}`)}`
    )
    .body((messageBuilder) =>
      messageBuilder()
        .br()
        .table((tableBuilder) =>
          tableBuilder().body((rowBuilder) =>
            counterRows.filter((r) => r.value).map((r) => rowBuilder().th(r.label).td(`${r.value}`))
          )
        )
    )
    .build();
}

function buildTestResults(jestResults: JestResults): string[] {
  if (!jestResults.numFailedTests || jestResults.testResults.length === 0) {
    return buildNoTestResultsMessage();
  } else {
    const failedTests = findFailedTests(jestResults.testResults);

    const failedTestMessageBuilder = githubMessageBuilder()
      .h2(":interrobang: Failed Test Results")
      .quote("Below are the results of the failed tests.")
      .br();

    failedTests.forEach((failedTest) => {
      failedTestMessageBuilder.add(buildFailedTestResultMessage(failedTest));
    });

    return failedTestMessageBuilder.get();
  }
}

function buildNoTestResultsMessage(): string[] {
  return githubMessageBuilder()
    .h2(":white_check_mark: Test Results")
    .quote("There were no test results to report.\n\nAll tests passed :v:")
    .get();
}

export function findFailedTests(testResults: JestTestResult[]): JestAssertionResult[] {
  return testResults
    .map((o) => o.assertionResults)
    .flat()
    .filter((a) => a && a.status === JestResultStatus.FAILED);
}

function buildFailedTestResultMessage(failedTest: JestAssertionResult): string | null {
  core.info(`Processing '${failedTest.fullName}' test...`);

  const message = failedTest.failureMessages.join("\n").replace(/\\u001b\[\d{1,2}m/gi, "");

  return detailsBuilder()
    .summary(({ italic }) => italic(`:x: ${failedTest.fullName}`))
    .body((messageBuilder) =>
      messageBuilder().table((tableBuilder) =>
        tableBuilder().body((rowBuilder) => [
          rowBuilder().th("Title").td(failedTest.title),
          rowBuilder().th("Ancestor Titles").td(failedTest.ancestorTitles.join(" / ")),
          rowBuilder().th("Status").td(codeDecorator(failedTest.status)),
          rowBuilder()
            .th("Location")
            .td(failedTest.location ? codeDecorator(failedTest.location) : ""),
          rowBuilder().th("Failure Messages").td(`<pre>\n${message}\n</pre>`)
        ])
      )
    )
    .build();
}
