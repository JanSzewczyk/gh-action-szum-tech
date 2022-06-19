export enum JestResultStatus {
  FAILED = "failed",
  PASSED = "passed",
  PENDING = "pending"
}

export interface JestSnapshot {
  added: number;
  didUpdate: boolean;
  failure: boolean;
  filesAdded: number;
  filesRemoved: number;
  filesRemovedList: string[];
  filesUnmatched: number;
  filesUpdated: number;
  matched: number;
  total: number;
  unchecked: number;
  uncheckedKeysByFile: string[];
  unmatched: number;
  updated: number;
}

export interface JestTestResult {
  assertionResults: JestAssertionResult[];
  endTime: number;
  message: string;
  name: string;
  startTime: number;
  status: JestResultStatus;
  summary: string;
}

export interface JestAssertionResult {
  ancestorTitles: string[];
  duration: number;
  failureMessages: string[];
  fullName: string;
  location: null; // TODO find type
  status: JestResultStatus;
  title: string;
}

export interface JestResults {
  numFailedTestSuites: number;
  numFailedTests: number;
  numPassedTestSuites: number;
  numPassedTests: number;
  numPendingTestSuites: number;
  numPendingTests: number;
  numRuntimeErrorTestSuites: number;
  numTodoTests: number;
  numTotalTestSuites: number;
  numTotalTests: number;
  openHandles: [];
  snapshot: JestSnapshot;
  startTime: number;
  success: boolean;
  testResults: JestTestResult[];
  wasInterrupted: boolean;
}
