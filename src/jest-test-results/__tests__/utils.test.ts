import { describe, expect, test, jest } from "@jest/globals";
import { formatDate, readTestsResultsFromJSONFile } from "../utils";
import * as core from "@actions/core";
import { faker } from "@faker-js/faker";

jest.mock("@actions/core");

const PATH_TO_NOT_EXISTED_FILE = "/path/to/not/existed/file.json";
const PATH_TO_EMPTY_FILE = "/path/to/empty/file.json";
const PATH_TO_CORRECT_FILE = "/path/to/correct/file.json";

const FILE_CONTENT = faker.datatype.json();

const MOCK_FILE_INFO: Record<string, string> = {
  [PATH_TO_EMPTY_FILE]: "",
  [PATH_TO_CORRECT_FILE]: JSON.stringify(FILE_CONTENT)
};

jest.mock("fs", () => ({
  promises: {
    access: jest.fn()
  },
  readFileSync: (path: string) => MOCK_FILE_INFO[path] ?? null,
  existsSync: (fileName: string) => [PATH_TO_EMPTY_FILE, PATH_TO_CORRECT_FILE].includes(fileName)
}));

describe("Actions > Jest Test Results > Utils", () => {
  describe("readTestsResultsFromJSONFile()", () => {
    test("should return null when file not exists", () => {
      const response = readTestsResultsFromJSONFile(PATH_TO_NOT_EXISTED_FILE);
      expect(core.setFailed).toHaveBeenCalledTimes(1);
      expect(core.setFailed).toHaveBeenCalledWith(
        `The test results file '${PATH_TO_NOT_EXISTED_FILE}' does not exists. No Pull Request comment or status check will be created.`
      );
      expect(response).toBeNull();
    });

    test("should return null when file is empty", () => {
      const response = readTestsResultsFromJSONFile(PATH_TO_EMPTY_FILE);
      expect(core.setFailed).toHaveBeenCalledTimes(1);
      expect(core.setFailed).toHaveBeenCalledWith(
        `The test results file '${PATH_TO_EMPTY_FILE}' does not contain any data. No Pull Request comment or status check will be created.`
      );
      expect(response).toBeNull();
    });

    test("should return json content when file contain content", () => {
      const response = readTestsResultsFromJSONFile(PATH_TO_CORRECT_FILE);
      expect(response).toEqual(FILE_CONTENT);
    });
  });

  test("formatDate(), should return formatted date", () => {
    expect(formatDate(new Date(Date.UTC(96, 1, 2, 3, 4, 5)))).toEqual("2/2/1996, 03:04:05 UTC");
  });
});
