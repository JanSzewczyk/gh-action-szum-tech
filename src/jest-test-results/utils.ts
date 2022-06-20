import * as core from "@actions/core";
import * as fs from "fs";
import { JestAssertionResult, JestResults, JestResultStatus, JestTestResult } from "./types";
import { githubMessageBuilder } from "../utils/github-message-builder";

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

export function createTestReportMessage(jestResults: JestResults): string {
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

function buildTestDurationDetails(jestResults: JestResults): string {
  const startDate = jestResults.startTime;
  const endDate = jestResults.testResults
    .map((m) => m.endTime)
    .sort((a, b) => {
      return b - a;
    })[0];

  const duration = (endDate - startDate) / 1000;

  return `
  <details>  
    <summary>Duration: <strong>${duration} second(s)</strong></summary>
    <br/>
    <table>
      <tr>
          <th>Start</th>
          <td><code>${formatDate(new Date(startDate))}</code></td>
      </tr>
      <tr>
          <th>Finish</th>
          <td><code>${formatDate(new Date(endDate))}</code></td>    
      </tr>
      <tr>
          <th>Duration</th>
          <td><code>${duration} second(s)</code></td>
      </tr>
    </table>
  </details>
  `.trim();
}

function buildTestCounters(jestResults: JestResults): string {
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

  return `
  <details>
    <summary>Status: <strong>${jestResults.success ? "Passed" : "Failed"}</strong> | Total Tests: <strong>${
    jestResults.numTotalTests
  }</strong> | Passed: <strong>${jestResults.numPassedTests}</strong> | Failed: <strong>${
    jestResults.numFailedTests
  }</summary>
    <br/>
    <table>
    ${counterRows
      .filter((r) => r.value)
      .map((c) => `<tr><th>${c.label}</th><td>${c.value}</td></tr>`)
      .join("\n")}
    </table>
  </details>
  `.trim();
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
    .quote("There were no test results to report.\n\nAll tests passed.\n\n:v:")
    .get();
}

export function findFailedTests(testResults: JestTestResult[]): JestAssertionResult[] {
  return testResults
    .map((o) => o.assertionResults)
    .flat()
    .filter((a) => a && a.status === JestResultStatus.FAILED);
}

function buildFailedTestResultMessage(failedTest: JestAssertionResult): string {
  core.info(`Processing '${failedTest.fullName}' test...`);

  const message = failedTest.failureMessages.join("\n").replace(/\\u001b\[\d{1,2}m/gi, "");

  return `
  <details>
    <summary><i>:x: ${failedTest.fullName}</i></summary>    
    <table>
      <tr>
         <th>Title</th>
         <td>${failedTest.title}</td>
      </tr>
      <tr>
        <th>Ancestor Titles</th>
        <td>${failedTest.ancestorTitles.join(" / ")}</td>
      </tr>
      <tr>
         <th>Status</th>
         <td><code>${failedTest.status}</code></td>
      </tr>
      <tr>
         <th>Location</th>
         <td><code>${failedTest.location}</code></td>
      </tr>
      <tr>
        <th>Failure Messages</th>
<td><pre>
${message}
</pre></td>
      </tr>
    </table>
  </details>
  `.trim();
}
