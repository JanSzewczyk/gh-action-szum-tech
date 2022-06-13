import { PullRequestFile } from "../../types";
import * as core from "@actions/core";
import { getPullRequestChangesReport } from "../utils";

const ignoredFiles: string[] = ["yarn.lock", "package-lock.json"];
const ignoredDirectory: string[] = ["lib/", "dist/"];

export function getPullRequestSizeLabel(changedFiles: PullRequestFile[]): void {
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
}

export function filterFileNames(fileNames: string[]): string[] {
  return fileNames.filter(
    (fileName) => !ignoredFiles.includes(fileName) && ignoredDirectory.every((dirName) => !fileName.startsWith(dirName))
  );
}
