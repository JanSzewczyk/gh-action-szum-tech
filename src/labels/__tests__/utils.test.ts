import * as core from "@actions/core";
import { expect, test, describe, jest } from "@jest/globals";
import {
  checkIfConfigFileIsSupported,
  filterFileNamesByPatterns,
  getLabelsDifferences,
  getPullRequestChangesReport,
  isFileConfigurationCorrect,
  mergeConfigurations,
  readConfigurationFile
} from "../utils";
import { buildPullRequestFile } from "@tests/builders/file.builder";
import { buildConfiguration, buildLabelConfiguration } from "@tests/builders/label-configuration.builder";
import { isEqual, xor } from "lodash-es";

const LABEL_CONFIGURATION = buildConfiguration()();

const PATH_TO_NOT_EXISTED_FILE = "/path/to/not/existed/file.yml";
const PATH_TO_EMPTY_FILE = "/path/to/empty/file.yml";
const PATH_TO_CORRECT_FILE = "/path/to/correct/file.yml";

const MOCK_FILE_INFO: Record<string, string> = {
  [PATH_TO_EMPTY_FILE]: "",
  [PATH_TO_CORRECT_FILE]: JSON.stringify(LABEL_CONFIGURATION)
};

jest.mock("fs", () => ({
  promises: {
    access: jest.fn()
  },
  readFileSync: (path: string) => MOCK_FILE_INFO[path] ?? null,
  existsSync: (fileName: string) => [PATH_TO_EMPTY_FILE, PATH_TO_CORRECT_FILE].includes(fileName)
}));

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

  describe("readConfigurationFile()", () => {
    test("should return null when file not exists", () => {
      const result = readConfigurationFile(PATH_TO_NOT_EXISTED_FILE);

      expect(core.info).toHaveBeenCalledWith("Reading labels configuration from file...");
      expect(core.error).toHaveBeenCalledWith(
        `The label configuration file '${PATH_TO_NOT_EXISTED_FILE}' does not exists.`
      );
      expect(core.info).toHaveBeenCalledTimes(1);
      expect(core.error).toHaveBeenCalledTimes(1);

      expect(result).toBeNull();
    });

    test("should return null when file is empty", () => {
      const response = readConfigurationFile(PATH_TO_EMPTY_FILE);

      expect(core.info).toHaveBeenCalledWith("Reading labels configuration from file...");
      expect(core.error).toHaveBeenCalledWith(
        `The label configuration file '${PATH_TO_EMPTY_FILE}' does not contain any data.`
      );
      expect(core.info).toHaveBeenCalledTimes(1);
      expect(core.error).toHaveBeenCalledTimes(1);

      expect(response).toBeNull();
    });

    test("should return raw configuration when file contain content", () => {
      const response = readConfigurationFile(PATH_TO_CORRECT_FILE);

      expect(core.info).toHaveBeenCalledWith("Reading labels configuration from file...");
      expect(core.info).toHaveBeenCalledWith(
        `The label configuration file '${PATH_TO_CORRECT_FILE}' has been loaded successfully.`
      );
      expect(core.info).toHaveBeenCalledTimes(2);

      expect(response).toEqual(LABEL_CONFIGURATION);
    });
  });

  describe("isFileConfigurationCorrect()", () => {
    test("should return configuration, when it is correct", () => {
      expect(isFileConfigurationCorrect(LABEL_CONFIGURATION)).toEqual(LABEL_CONFIGURATION);
    });

    test("should return 'false', when  configuration is not correct", () => {
      expect(
        isFileConfigurationCorrect({
          labels: [
            {
              name: ""
            }
          ]
        })
      ).toBeFalsy();
      expect(isFileConfigurationCorrect("")).toBeFalsy();
      expect(isFileConfigurationCorrect({ some: [] })).toBeFalsy();
    });
  });

  describe("mergeConfigurations()", () => {
    const baseLabelConfigLabels = ["label_1", "label_2", "label_3", "label_4", "label_5"];
    const baseLabelConfig = baseLabelConfigLabels.map((labelName) =>
      buildLabelConfiguration()({
        overrides: {
          name: labelName
        }
      })
    );

    test("should return empty array, when 'baseConfig' and 'newConfig' are empty", () => {
      const result = mergeConfigurations([], []);
      expect(result).toEqual([]);
    });

    test("should return 'newConfig', when 'baseConfig' is empty", () => {
      const result = mergeConfigurations([], baseLabelConfig);

      expect(result.length).toEqual(5);
      expect(
        xor(
          result.map((labelConfig) => labelConfig.name),
          baseLabelConfigLabels
        ).length
      ).toEqual(0);
    });

    test("should return 'baseConfig', when 'newConfig' is empty", () => {
      const result = mergeConfigurations(baseLabelConfig, []);

      expect(result.length).toEqual(5);
      expect(
        xor(
          result.map((labelConfig) => labelConfig.name),
          baseLabelConfigLabels
        ).length
      ).toEqual(0);
    });

    test("should return config array, when merging 'baseConfig' with 'newConfig'", () => {
      const newLabelConfigLabels = ["label_6", "label_7"];
      const newLabelConfig = newLabelConfigLabels.map((labelName) =>
        buildLabelConfiguration()({
          overrides: {
            name: labelName
          }
        })
      );

      const result = mergeConfigurations(baseLabelConfig, newLabelConfig);

      expect(result.length).toEqual(7);
      expect(
        xor(
          result.map((labelConfig) => labelConfig.name),
          [...baseLabelConfigLabels, ...newLabelConfigLabels]
        ).length
      ).toEqual(0);
    });

    test("should return array with overwritten configurations, when merging 'baseConfig' with 'newConfig'", () => {
      const newLabelConfigLabels = ["label_4", "label_1", "label_6"];
      const newLabelConfig = newLabelConfigLabels.map((labelName) =>
        buildLabelConfiguration()({
          overrides: {
            name: labelName
          }
        })
      );

      const result = mergeConfigurations(baseLabelConfig, newLabelConfig);

      expect(result.length).toEqual(6);
      expect(
        xor(
          result.map((labelConfig) => labelConfig.name),
          [...baseLabelConfigLabels, "label_6"]
        ).length
      ).toEqual(0);
      expect(
        isEqual(
          result.find((c) => c.name === "label_1"),
          newLabelConfig.find((c) => c.name === "label_1")
        )
      ).toBeTruthy();
      expect(
        isEqual(
          result.find((c) => c.name === "label_4"),
          newLabelConfig.find((c) => c.name === "label_4")
        )
      ).toBeTruthy();
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
