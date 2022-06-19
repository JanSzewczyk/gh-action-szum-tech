import * as core from "@actions/core";
import * as fs from "fs";
import { JestAssertionResult, JestResults, JestResultStatus, JestTestResult } from "./types";

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
  return `
  # Jest Test Results  ${buildTestBadge(jestResults)}
  ${buildTestDurationDetails(jestResults)}
  ${buildTestCounters(jestResults)}
  ${buildTestResults(jestResults)}
  `;
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
    <summary><strong>Duration: ${duration} second(s)</strong></summary>
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
  return `
  <details>
    <summary><strong>Status: ${jestResults.success ? "Passed" : "Failed"} | Total Tests: ${
    jestResults.numTotalTests
  } | Passed: ${jestResults.numPassedTests} | Failed: ${jestResults.numFailedTests}</strong></summary>
    <br/>
    <table>
      <tr>
         <th>Total Test Suites</th>
         <td>${jestResults.numTotalTestSuites}</td>
      </tr>
      <tr>
         <th>Total Tests</th>
         <td>${jestResults.numTotalTests}</td>
      </tr>
      <tr>
         <th>Failed Test Suites</th>
         <td>${jestResults.numFailedTestSuites}</td>    
      </tr>
      <tr>
         <th>Failed Tests</th>
         <td>${jestResults.numFailedTests}</td>    
      </tr>
      <tr>
         <th>Passed Test Suites</th>
         <td>${jestResults.numPassedTestSuites}</td>    
      </tr>
      <tr>
         <th>Passed Tests</th>
         <td>${jestResults.numPassedTests}</td>    
      </tr>
      <tr>
         <th>Pending Test Suites</th>
         <td>${jestResults.numPendingTestSuites}</td>    
      </tr>
      <tr>
         <th>Pending Tests</th>
         <td>${jestResults.numPendingTestSuites}</td>    
      </tr>
      <tr>
         <th>Runtime Error Test Suites</th>
         <td>${jestResults.numRuntimeErrorTestSuites}</td>    
      </tr>
      <tr>
         <th>TODO Tests</th>
         <td>${jestResults.numTodoTests}</td>    
      </tr>
    </table>
  </details>
  `.trim();
}

function buildTestResults(jestResults: JestResults): string {
  if (!jestResults.numFailedTests || jestResults.testResults.length === 0) {
    return buildNoTestResultsMessage();
  } else {
    const failedTests = findFailedTests(jestResults.testResults);

    let failedTestMessage = "";
    failedTests.forEach((failedTest) => {
      failedTestMessage += buildFailedTestRsultMessage(failedTest);
    });

    return failedTestMessage.trim();
  }
}

function buildNoTestResultsMessage(): string {
  return `
  ## :grey_question: Test Results
  There were no test results to report.
  `.trim();
}

export function findFailedTests(testResults: JestTestResult[]): JestAssertionResult[] {
  return testResults
    .map((o) => o.assertionResults)
    .flat()
    .filter((a) => a && a.status === JestResultStatus.FAILED);
}

function buildFailedTestRsultMessage(failedTest: JestAssertionResult): string {
  const message = failedTest.failureMessages.join("\n").replace(/\\u001b\[\d{1,2}m/gi, "");

  return `
  <details>
    <summary>:x: ${failedTest.fullName}</summary>    
    <table>
      <tr>
         <th>Title</th>
         <td><code>${failedTest.title}</code></td>
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
        <td><pre>${message}</pre></td>
      </tr>
    </table>
  </details>
  `.trim();
}
