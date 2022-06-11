import { PullRequestFile } from "../../types";
import { PullRequestChangesReport, PullRequestSizeLabel } from "../types";
import * as core from "@actions/core";

const ignoredFiles: string[] = ["yarn.lock", "package-lock.json"];
const ignoredDirectory: string[] = ["lib/", "dist/"];

export function getPullRequestSizeLabel(changedFiles: PullRequestFile[]): PullRequestSizeLabel {
  core.info("\nProcessing Pull Request Changes Report...");

  const fileNames = changedFiles.map((file) => file.filename);
  const filteredFileNames = filterFileNames(fileNames);
  const filteredFiles = changedFiles.filter((file) => filteredFileNames.includes(file.filename));
  const pullRequestReport = getPullRequestChangesReport(filteredFiles);

  core.info("Report details:");
  core.info(`\t* ${filteredFiles.length} file(s)`);
  core.info(`\t* ${pullRequestReport.additions} addition(s)`);
  core.info(`\t* ${pullRequestReport.changes} change(s)`);
  core.info(`\t* ${pullRequestReport.deletions} deletion(s)`);

  return getSizeLabel(pullRequestReport.changes);
}

export function filterFileNames(fileNames: string[]): string[] {
  return fileNames.filter(
    (fileName) => !ignoredFiles.includes(fileName) && ignoredDirectory.every((dirName) => !fileName.startsWith(dirName))
  );
}

export function getPullRequestChangesReport(files: PullRequestFile[]): PullRequestChangesReport {
  let pullRequestReport: PullRequestChangesReport = {
    additions: 0,
    changes: 0,
    deletions: 0
  };

  pullRequestReport = files.reduce((acc, file) => {
    acc.additions += file.additions;
    acc.changes += file.changes;
    acc.deletions += file.deletions;
    return acc;
  }, pullRequestReport);

  return pullRequestReport;
}

export function getSizeLabel(changes: number): PullRequestSizeLabel {
  if (changes < 32) return PullRequestSizeLabel.SMALL;
  if (changes < 128) return PullRequestSizeLabel.MEDIUM;
  if (changes < 512) return PullRequestSizeLabel.LARGE;
  if (changes < 1024) return PullRequestSizeLabel.X_LARGE;

  return PullRequestSizeLabel.MEGALODON;
}
