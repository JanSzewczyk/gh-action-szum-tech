import * as core from "@actions/core";
import { expect, test, describe, jest } from "@jest/globals";
import {
  checkIfConfigFileIsSupported,
  filterFileNamesByPatterns,
  getLabelsDifferences,
  getPullRequestChangesReport,
  isFileConfigurationCorrect
} from "../utils";
import { buildPullRequestFile } from "@tests/builders/file.builder";

jest.mock("@actions/core");

describe("Actions > Labels > Utils", () => {
  describe("checkIfConfigFileIsSupported()", () => {
    test("should return 'false', when path is empty", () => {
      const result = checkIfConfigFileIsSupported("");

      expect(core.info).toHaveBeenCalledWith("Checking if the labels configuration file is supported...");
      expect(core.error).toHaveBeenCalledWith("Labels configuration file path does not exist.");

      expect(core.info).toHaveBeenCalledTimes(1);
      expect(core.error).toHaveBeenCalledTimes(1);
      expect(result).toBeFalsy();
    });

    test("should return 'false', when file extension is not supported", () => {
      const result = checkIfConfigFileIsSupported("./some/path/to/file.js");

      expect(core.info).toHaveBeenCalledWith("Checking if the labels configuration file is supported...");
      expect(core.error).toHaveBeenCalledWith("Labels configuration file 'file.js' is not supported by action.");

      expect(core.info).toHaveBeenCalledTimes(1);
      expect(core.error).toHaveBeenCalledTimes(1);
      expect(result).toBeFalsy();
    });

    test("should return 'true', when file extension is 'yml'", () => {
      const result = checkIfConfigFileIsSupported("./some/path/to/file.yml");

      expect(core.info).toHaveBeenCalledWith("Checking if the labels configuration file is supported...");
      expect(core.info).toHaveBeenCalledWith("Labels configuration file 'file.yml' is supported by action.");

      expect(core.info).toHaveBeenCalledTimes(2);
      expect(result).toBeTruthy();
    });

    test("should return 'true', when file extension is 'yaml'", () => {
      const result = checkIfConfigFileIsSupported("file.yaml");

      expect(core.info).toHaveBeenCalledWith("Checking if the labels configuration file is supported...");
      expect(core.info).toHaveBeenCalledWith("Labels configuration file 'file.yaml' is supported by action.");

      expect(core.info).toHaveBeenCalledTimes(2);
      expect(result).toBeTruthy();
    });
  });

  describe("isFileConfigurationCorrect()", () => {
    test("", () => {
      const result = isFileConfigurationCorrect({ labels: [] });

      expect(result).toBeTruthy();
    });
  });

  describe("mergeConfigurations()", () => {
    test("", () => {
      const result = isFileConfigurationCorrect({ labels: [] });

      expect(result).toBeTruthy();
    });
  });

  describe("getLabelsDifferences function", () => {
    const pullRequestLabels = [
      "label_1",
      "label_2",
      "supported_label_1",
      "label_3",
      "supported_label_3",
      "supported_label_2"
    ];
    const supportedLabels = ["supported_label_1", "supported_label_2", "supported_label_3", "supported_label_4"];

    test("should return differences", () => {
      const detectedLabels = ["supported_label_3", "supported_label_4"];

      const labelDiff = getLabelsDifferences(pullRequestLabels, detectedLabels, supportedLabels);

      expect(labelDiff.add).toEqual(["supported_label_4"]);
      expect(labelDiff.delete).toEqual(["supported_label_1", "supported_label_2"]);
    });

    test("should return differences without unsupported label", () => {
      const detectedLabels = ["supported_label_3", "supported_label_4", "unsupported_label"];

      const labelDiff = getLabelsDifferences(pullRequestLabels, detectedLabels, supportedLabels);

      expect(labelDiff.add).toEqual(["supported_label_4"]);
      expect(labelDiff.delete).toEqual(["supported_label_1", "supported_label_2"]);
    });

    test("should return no difference", () => {
      const detectedLabels = ["supported_label_1", "supported_label_3", "supported_label_2"];

      const labelDiff = getLabelsDifferences(pullRequestLabels, detectedLabels, supportedLabels);

      expect(labelDiff.add).toEqual([]);
      expect(labelDiff.delete).toEqual([]);
    });
  });

  describe("getPullRequestChangesReport function", () => {
    const fileBuilder = buildPullRequestFile();

    test("should return pull request changes report", () => {
      const prFiles = [
        {
          additions: 123,
          changes: 146,
          deletions: 23
        },
        {
          additions: 12,
          changes: 112,
          deletions: 100
        },
        {
          additions: 0,
          changes: 23,
          deletions: 23
        }
      ].map((config) =>
        fileBuilder({
          overrides: config
        })
      );

      expect(getPullRequestChangesReport(prFiles)).toEqual({
        additions: 135,
        changes: 281,
        deletions: 146
      });
    });

    test("should return empty pull request changes report when no files", () => {
      expect(getPullRequestChangesReport([])).toEqual({
        additions: 0,
        changes: 0,
        deletions: 0
      });
    });
  });

  describe("filterFileNamesByPatterns function", () => {
    const fileNames: string[] = [
      "package.json",
      "some-file.ts",
      "some-file.test.ts",
      "src/some-file.ts",
      "src/some-file.test.ts"
    ];

    test("should return file names list filtered by one pattern", () => {
      const ignorePatterns: string[] = ["*.ts"];

      expect(filterFileNamesByPatterns(fileNames, ignorePatterns)).toEqual([
        "package.json",
        "src/some-file.ts",
        "src/some-file.test.ts"
      ]);
    });

    test("should return file names list filtered by directory pattern", () => {
      const fileList: string[] = [
        ".github/workflows/action.yml",
        "file-one.js",
        "src/file.js",
        "file.config.js",
        "src/components/component.ts"
      ];
      const ignorePatterns: string[] = [".github/{*,**/*}", "src/{*,**/*}"];

      expect(filterFileNamesByPatterns(fileList, ignorePatterns)).toEqual(["file-one.js", "file.config.js"]);
    });

    test("should return empty list when all file names match to patterns", () => {
      const ignorePatterns: string[] = ["{**/*,*}.ts", "package.json"];

      expect(filterFileNamesByPatterns(fileNames, ignorePatterns)).toEqual([]);
    });

    test("should return same list when there is no pattern", () => {
      const ignorePatterns: string[] = [];

      expect(filterFileNamesByPatterns(fileNames, ignorePatterns)).toEqual(fileNames);
    });
  });
});
