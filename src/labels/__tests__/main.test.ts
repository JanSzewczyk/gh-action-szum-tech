import { describe, expect, test, jest } from "@jest/globals";
import { getLabelConfiguration } from "../main";
import * as core from "@actions/core";
import { defaultConfiguration } from "../constants";
import { buildConfiguration } from "@tests/builders/label-configuration.builder";

jest.mock("@actions/core");

const LABEL_CONFIGURATION = buildConfiguration()({ traits: "defineLabels" });

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

describe("Jest Test Results Action", () => {
  describe("getLabelConfiguration()", () => {
    test("should return default configuration, when not set custom configuration file", () => {
      const labelConfiguration = getLabelConfiguration(null, false);

      expect(core.info).toHaveBeenCalledWith(`Getting labels configuration....`);
      expect(core.info).toHaveBeenCalledWith(`The source of labels configuration is the only DEFAULT configuration.`);
      expect(core.info).toHaveBeenCalledTimes(2);

      expect(labelConfiguration.length).toEqual(defaultConfiguration.labels.length);
    });

    test("should return default configuration, when set custom configuration file that not exist", () => {
      const labelConfiguration = getLabelConfiguration(PATH_TO_NOT_EXISTED_FILE, false);

      expect(core.info).toHaveBeenCalledWith(`Getting labels configuration....`);
      expect(core.info).toHaveBeenCalledWith(`Custom label configuration is supported.`);
      expect(core.info).toHaveBeenCalledWith(
        `Getting custom labels configuration from file '${PATH_TO_NOT_EXISTED_FILE}'...`
      );
      expect(core.info).toHaveBeenCalledWith("Checking if the labels configuration file is supported...");
      expect(core.info).toHaveBeenCalledWith(`Labels configuration file 'file.yml' is supported by action.`);
      expect(core.info).toHaveBeenCalledWith("Reading labels configuration from file...");
      expect(core.error).toHaveBeenCalledWith(
        `The label configuration file '${PATH_TO_NOT_EXISTED_FILE}' does not exists.`
      );
      expect(core.warning).toHaveBeenCalledWith(
        "Custom labels configuration file is not supported by an action. DEFAULT labels configuration will be used."
      );
      expect(core.info).toHaveBeenCalledWith(`The source of labels configuration is the only DEFAULT configuration.`);

      expect(core.info).toBeCalledTimes(7);
      expect(core.warning).toBeCalledTimes(1);
      expect(core.error).toBeCalledTimes(1);

      expect(labelConfiguration.length).toEqual(defaultConfiguration.labels.length);
    });

    test("should return default configuration, when set custom configuration file that is empty", () => {
      const labelConfiguration = getLabelConfiguration(PATH_TO_EMPTY_FILE, false);

      expect(core.info).toHaveBeenCalledWith(`Getting labels configuration....`);
      expect(core.info).toHaveBeenCalledWith(`Custom label configuration is supported.`);
      expect(core.info).toHaveBeenCalledWith(
        `Getting custom labels configuration from file '${PATH_TO_EMPTY_FILE}'...`
      );
      expect(core.info).toHaveBeenCalledWith("Checking if the labels configuration file is supported...");
      expect(core.info).toHaveBeenCalledWith(`Labels configuration file 'file.yml' is supported by action.`);
      expect(core.info).toHaveBeenCalledWith("Reading labels configuration from file...");
      expect(core.error).toHaveBeenCalledWith(
        `The label configuration file '${PATH_TO_EMPTY_FILE}' does not contain any data.`
      );
      expect(core.warning).toHaveBeenCalledWith(
        "Custom labels configuration file is not supported by an action. DEFAULT labels configuration will be used."
      );
      expect(core.info).toHaveBeenCalledWith(`The source of labels configuration is the only DEFAULT configuration.`);

      expect(core.info).toBeCalledTimes(7);
      expect(core.warning).toBeCalledTimes(1);
      expect(core.error).toBeCalledTimes(1);

      expect(labelConfiguration.length).toEqual(defaultConfiguration.labels.length);
    });

    test("should return configuration build of default and custom configuration, when set custom configuration file", () => {
      const labelConfiguration = getLabelConfiguration(PATH_TO_CORRECT_FILE, false);

      expect(core.info).toHaveBeenCalledWith(`Getting labels configuration....`);
      expect(core.info).toHaveBeenCalledWith(`Custom label configuration is supported.`);
      expect(core.info).toHaveBeenCalledWith(
        `Getting custom labels configuration from file '${PATH_TO_CORRECT_FILE}'...`
      );
      expect(core.info).toHaveBeenCalledWith("Checking if the labels configuration file is supported...");
      expect(core.info).toHaveBeenCalledWith(`Labels configuration file 'file.yml' is supported by action.`);
      expect(core.info).toHaveBeenCalledWith("Reading labels configuration from file...");
      expect(core.info).toHaveBeenCalledWith(
        `The label configuration file '${PATH_TO_CORRECT_FILE}' has been loaded successfully.`
      );
      expect(core.info).toHaveBeenCalledWith("Checking custom configuration correctness...");
      expect(core.info).toHaveBeenCalledWith("Custom configuration is correct.");
      expect(core.info).toHaveBeenCalledWith(
        `The source of labels configuration is configuration created from DEFAULT and CUSTOM configuration.`
      );

      expect(core.info).toBeCalledTimes(10);

      expect(labelConfiguration.length).toEqual(16);
    });

    test("should return custom configuration, when set custom configuration file and default configuration is disabled", () => {
      const labelConfiguration = getLabelConfiguration(PATH_TO_CORRECT_FILE, true);

      expect(core.info).toHaveBeenCalledWith(`Getting labels configuration....`);
      expect(core.info).toHaveBeenCalledWith(`Custom label configuration is supported.`);
      expect(core.info).toHaveBeenCalledWith(
        `Getting custom labels configuration from file '${PATH_TO_CORRECT_FILE}'...`
      );
      expect(core.info).toHaveBeenCalledWith("Checking if the labels configuration file is supported...");
      expect(core.info).toHaveBeenCalledWith(`Labels configuration file 'file.yml' is supported by action.`);
      expect(core.info).toHaveBeenCalledWith("Reading labels configuration from file...");
      expect(core.info).toHaveBeenCalledWith(
        `The label configuration file '${PATH_TO_CORRECT_FILE}' has been loaded successfully.`
      );
      expect(core.info).toHaveBeenCalledWith("Checking custom configuration correctness...");
      expect(core.info).toHaveBeenCalledWith("Custom configuration is correct.");
      expect(core.info).toHaveBeenCalledWith(`The source of labels configuration is the only CUSTOM configuration.`);

      expect(core.info).toBeCalledTimes(10);

      expect(labelConfiguration.length).toEqual(5);
    });

    test("should return empty config, when set custom configuration file not exist and default configuration is disabled", () => {
      const labelConfiguration = getLabelConfiguration(PATH_TO_NOT_EXISTED_FILE, true);

      expect(core.info).toHaveBeenCalledWith(`Getting labels configuration....`);
      expect(core.info).toHaveBeenCalledWith(`Custom label configuration is supported.`);
      expect(core.info).toHaveBeenCalledWith(
        `Getting custom labels configuration from file '${PATH_TO_NOT_EXISTED_FILE}'...`
      );
      expect(core.info).toHaveBeenCalledWith("Checking if the labels configuration file is supported...");
      expect(core.info).toHaveBeenCalledWith(`Labels configuration file 'file.yml' is supported by action.`);
      expect(core.info).toHaveBeenCalledWith("Reading labels configuration from file...");
      expect(core.error).toHaveBeenCalledWith(
        `The label configuration file '${PATH_TO_NOT_EXISTED_FILE}' does not exists.`
      );
      expect(core.setFailed).toHaveBeenCalledWith(
        "Custom labels configuration file is not supported by an action and DEFAULT configuration is disabled. No label will be changed."
      );

      expect(core.info).toBeCalledTimes(6);
      expect(core.error).toBeCalledTimes(1);
      expect(core.setFailed).toBeCalledTimes(1);

      expect(labelConfiguration.length).toEqual(0);
    });
  });
});
