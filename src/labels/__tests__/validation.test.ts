import { describe, expect, test } from "@jest/globals";
import { checkAnyGlob, checkEveryGlob, checkSize, validateLabel } from "../validation";
import { LabelSizeValidationType, LabelValidation } from "../types";
import { buildPullRequestFile } from "../../tests/builders/file.builder";

const pullRequestFileBuilder = buildPullRequestFile();

const fileConfiguration = [
  {
    filename: ".github/workflows/action.yml",
    additions: 24,
    changes: 24,
    deletions: 0
  },
  {
    filename: "file-one.js",
    additions: 30,
    changes: 40,
    deletions: 10
  },
  {
    filename: "src/file.js",
    additions: 15,
    changes: 75,
    deletions: 60
  },
  {
    filename: "file.config.js",
    additions: 0,
    changes: 10,
    deletions: 10
  },
  {
    filename: "src/components/component.ts",
    additions: 150,
    changes: 160,
    deletions: 10
  }
];

describe("Labels Action Validation", () => {
  describe("validateLabel function", () => {
    const prFiles = fileConfiguration.map((config) =>
      pullRequestFileBuilder({
        overrides: config
      })
    );

    test("should return true when label configuration is undefined", () => {
      expect(validateLabel(prFiles)).toBeTruthy();
    });

    test("should return true when label configuration is empty", () => {
      expect(validateLabel(prFiles, {})).toBeTruthy();
    });

    describe("configuration fields:", () => {
      describe("'any'", () => {
        test("should return true when pattern matches to any file name", () => {
          const labelValidation: LabelValidation = {
            any: ["{*,**/*}.ts"]
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });

        test("should return true when not all patterns match to file names", () => {
          const labelValidation: LabelValidation = {
            any: ["*.js", "*.json"]
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });

        test("should return false when no pattern match to file names", () => {
          const labelValidation: LabelValidation = {
            any: ["*.java", "src/*.json"]
          };

          expect(validateLabel(prFiles, labelValidation)).toBeFalsy();
        });

        test("should return false when pattern match to ignored file names", () => {
          const labelValidation: LabelValidation = {
            ignoreFiles: ["*.js"],
            any: ["*.js"]
          };

          expect(validateLabel(prFiles, labelValidation)).toBeFalsy();
        });

        test("should return true when pattern matches part of ignored filenames", () => {
          const labelValidation: LabelValidation = {
            ignoreFiles: ["file-one.js"],
            any: ["*.js"]
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });
      });

      describe("'every'", () => {
        test("should return true when patterns match to all file names", () => {
          const labelValidation: LabelValidation = {
            every: ["{*,**/*}.{js,ts}", ".github/**/*.yml"]
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });

        test("should return false when not all patterns match to file names", () => {
          const labelValidation: LabelValidation = {
            every: ["{*,**/*}.{js,ts}"]
          };

          expect(validateLabel(prFiles, labelValidation)).toBeFalsy();
        });

        test("should return false when no pattern match to file names", () => {
          const labelValidation: LabelValidation = {
            every: ["*.java", "src/*.json"]
          };

          expect(validateLabel(prFiles, labelValidation)).toBeFalsy();
        });

        test("should return false when pattern match to ignored file names", () => {
          const labelValidation: LabelValidation = {
            ignoreFiles: ["*.js"],
            every: ["*.js"]
          };

          expect(validateLabel(prFiles, labelValidation)).toBeFalsy();
        });

        test("should return true when pattern matches part of ignored filenames", () => {
          const labelValidation: LabelValidation = {
            ignoreFiles: [".github/{**/*,*}", "src/{*,**/*}"],
            every: ["*.js"]
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });
      });

      describe("'changes'", () => {
        test("'equal', should return true when changes are equal as in configuration", () => {
          const labelValidation: LabelValidation = {
            changes: {
              equal: 309
            }
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });

        test("'less', should return true when changes are less", () => {
          const labelValidation: LabelValidation = {
            changes: {
              less: 400
            }
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });

        test("'lessOrEqual', should return true when changes are less or equal", () => {
          const labelValidation: LabelValidation = {
            changes: {
              lessOrEqual: 309
            }
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });

        test("'greater', should return true when changes are greater", () => {
          const labelValidation: LabelValidation = {
            changes: {
              greater: 234
            }
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });

        test("'greaterOrEqual', should return true when changes are greater or equal", () => {
          const labelValidation: LabelValidation = {
            changes: {
              greaterOrEqual: 309
            }
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });
      });

      describe("'additions'", () => {
        test("'equal', should return true when additions are equal as in configuration", () => {
          const labelValidation: LabelValidation = {
            additions: {
              equal: 219
            }
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });

        test("'less', should return true when additions are less", () => {
          const labelValidation: LabelValidation = {
            additions: {
              less: 400
            }
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });

        test("'lessOrEqual', should return true when additions are less or equal", () => {
          const labelValidation: LabelValidation = {
            additions: {
              lessOrEqual: 219
            }
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });

        test("'greater', should return true when additions are greater", () => {
          const labelValidation: LabelValidation = {
            additions: {
              greater: 200
            }
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });

        test("'greaterOrEqual', should return true when additions are greater or equal", () => {
          const labelValidation: LabelValidation = {
            additions: {
              greaterOrEqual: 219
            }
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });
      });

      describe("'deletions'", () => {
        test("'equal', should return true when deletions are equal as in configuration", () => {
          const labelValidation: LabelValidation = {
            deletions: {
              equal: 90
            }
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });

        test("'less', should return true when deletions are less", () => {
          const labelValidation: LabelValidation = {
            deletions: {
              less: 400
            }
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });

        test("'lessOrEqual', should return true when deletions are less or equal", () => {
          const labelValidation: LabelValidation = {
            deletions: {
              lessOrEqual: 219
            }
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });

        test("'greater', should return true when deletions are greater", () => {
          const labelValidation: LabelValidation = {
            deletions: {
              greater: 80
            }
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });

        test("'greaterOrEqual', should return true when deletions are greater or equal", () => {
          const labelValidation: LabelValidation = {
            deletions: {
              greaterOrEqual: 90
            }
          };

          expect(validateLabel(prFiles, labelValidation)).toBeTruthy();
        });
      });
    });
  });

  describe("checkSize function", () => {
    describe(`check ${LabelSizeValidationType.EQUAL} validation`, () => {
      test("should return true, when validation is correct", () => {
        expect(checkSize(123, LabelSizeValidationType.EQUAL, 123)).toBeTruthy();
      });

      test("should return false, when validation is invalid", () => {
        expect(checkSize(123, LabelSizeValidationType.EQUAL, 23)).toBeFalsy();
      });
    });

    describe(`check ${LabelSizeValidationType.GREATER} validation`, () => {
      test("should return true, when validation is correct", () => {
        expect(checkSize(123, LabelSizeValidationType.GREATER, 34)).toBeTruthy();
      });

      test("should return false, when validation is invalid", () => {
        expect(checkSize(123, LabelSizeValidationType.GREATER, 432)).toBeFalsy();
      });
    });

    describe(`check ${LabelSizeValidationType.GREATER_OR_EQUAL} validation`, () => {
      test("should return true, when validation is correct", () => {
        expect(checkSize(123, LabelSizeValidationType.GREATER_OR_EQUAL, 34)).toBeTruthy();
      });

      test("should return true when validating a boundary value", () => {
        expect(checkSize(12, LabelSizeValidationType.GREATER_OR_EQUAL, 12)).toBeTruthy();
      });

      test("should return false, when validation is invalid", () => {
        expect(checkSize(123, LabelSizeValidationType.GREATER_OR_EQUAL, 432)).toBeFalsy();
      });
    });

    describe(`check ${LabelSizeValidationType.LESS} validation`, () => {
      test("should return true, when validation is correct", () => {
        expect(checkSize(12, LabelSizeValidationType.LESS, 34)).toBeTruthy();
      });

      test("should return false, when validation is invalid", () => {
        expect(checkSize(23, LabelSizeValidationType.LESS, 12)).toBeFalsy();
      });
    });

    describe(`check ${LabelSizeValidationType.LESS_OR_EQUAL} validation`, () => {
      test("should return true, when validation is correct", () => {
        expect(checkSize(12, LabelSizeValidationType.LESS_OR_EQUAL, 34)).toBeTruthy();
      });

      test("should return true when validating a boundary value", () => {
        expect(checkSize(12, LabelSizeValidationType.LESS_OR_EQUAL, 12)).toBeTruthy();
      });

      test("should return false, when validation is invalid", () => {
        expect(checkSize(23, LabelSizeValidationType.LESS_OR_EQUAL, 12)).toBeFalsy();
      });
    });
  });

  describe("checkAnyGlob function", () => {
    describe("files validation", () => {
      test("should return true when pattern matches to any filename", () => {
        const fileNames = ["package.json", "some-file.ts", "some-file.test.ts"];
        const patterns = ["*.ts"];

        expect(checkAnyGlob(patterns, fileNames)).toBeTruthy();
      });

      test("should return false when pattern matches to no filename", () => {
        const fileNames = ["package.json", "some-file.ts", "some-file.test.ts"];
        const patterns = ["*.java"];

        expect(!checkAnyGlob(patterns, fileNames)).toBeTruthy();
      });

      test("should return true when pattern matches to any filename inside directory", () => {
        const fileNames = ["package.json", "some-file.ts", "src/some-file.test.ts"];
        const patterns = ["**/*.+(test|spec).ts"];

        expect(checkAnyGlob(patterns, fileNames)).toBeTruthy();
      });

      test("should return true when pattern is same like some file name", () => {
        const fileNames = ["package.json", "some-file.ts", "src/some-file.test.ts"];
        const patterns = ["some-file.ts"];

        expect(checkAnyGlob(patterns, fileNames)).toBeTruthy();
      });

      test("should return false when there is no filenames", () => {
        const fileNames: string[] = [];
        const patterns = ["**/*.{test,spec}.ts"];

        expect(!checkAnyGlob(patterns, fileNames)).toBeTruthy();
      });

      test("should return false when there is no pattern", () => {
        const fileNames = ["package.json", "some-file.ts", "src/some-file.test.ts"];
        const patterns: string[] = [];

        expect(checkAnyGlob(patterns, fileNames)).toBeTruthy();
      });
    });

    describe("directory validation", () => {
      test("should return true when pattern matches to any dir", () => {
        const fileNames = ["package.json", "some-file.ts", "src/some-file.test.ts"];
        const patterns = ["src/*"];

        expect(checkAnyGlob(patterns, fileNames)).toBeTruthy();
      });

      test("should return false when pattern matches to no filename", () => {
        const fileNames = ["package.json", "some-file.ts", "some-file.test.ts"];
        const patterns = ["src/*"];

        expect(!checkAnyGlob(patterns, fileNames)).toBeTruthy();
      });

      test("should return true when pattern matches to any directory inside other", () => {
        const fileNames = ["package.json", "src/dir/some-file.ts", "src/some-file.test.ts"];
        const patterns = ["src/dir/*"];

        expect(checkAnyGlob(patterns, fileNames)).toBeTruthy();
      });

      test("should return false when there is no filenames", () => {
        const fileNames: string[] = [];
        const patterns = ["src/*"];

        expect(!checkAnyGlob(patterns, fileNames)).toBeTruthy();
      });

      test("should return false when there is no pattern", () => {
        const fileNames = ["package.json", "some-file.ts", "src/some-file.test.ts"];
        const patterns: string[] = [];

        expect(checkAnyGlob(patterns, fileNames)).toBeTruthy();
      });
    });
  });

  describe("checkEveryGlob function", () => {
    describe("files validation", () => {
      test("should return true when pattern matches to all filenames", () => {
        const fileNames = [
          ".github/workflows/action.yml",
          "file-one.js",
          "src/file.js",
          "file.config.js",
          "src/components/component.ts"
        ];
        const patterns = ["**/*.ts", "{*,**/*}.js", ".github/**/*.yml"];

        expect(checkEveryGlob(patterns, fileNames)).toBeTruthy();
      });

      test("should return false when pattern matches to not all filenames", () => {
        const fileNames = ["package.json", "some-file.ts", "some-file.test.ts"];
        const patterns = ["*.ts"];

        expect(checkEveryGlob(patterns, fileNames)).toBeFalsy();
      });

      test("should return true when pattern matches to all filename inside directory", () => {
        const fileNames = ["config/package.json", "config/some-file.ts", "src/some-file.test.ts"];
        const patterns = ["**/*.+(test|spec).ts", "**/*.json", "**/*.ts"];

        expect(checkEveryGlob(patterns, fileNames)).toBeTruthy();
      });

      test("should return false when there is no filenames", () => {
        const fileNames: string[] = [];
        const patterns = ["**/*.{test,spec}.ts"];

        expect(checkEveryGlob(patterns, fileNames)).toBeFalsy();
      });

      test("should return false when there is no pattern", () => {
        const fileNames = ["package.json", "some-file.ts", "src/some-file.test.ts"];
        const patterns: string[] = [];

        expect(checkEveryGlob(patterns, fileNames)).toBeTruthy();
      });
    });

    describe("directory validation", () => {
      test("should return true when pattern matches to filenames", () => {
        const fileNames = ["config/package.json", "config/some-file.ts", "src/some-file.test.ts"];
        const patterns = ["src/*", "config/*"];

        expect(checkEveryGlob(patterns, fileNames)).toBeTruthy();
      });

      test("should return false when pattern not matches to all filenames", () => {
        const fileNames = ["package.json", "some-file.ts", "some-file.test.ts"];
        const patterns = ["src/*"];

        expect(checkEveryGlob(patterns, fileNames)).toBeFalsy();
      });

      test("should return true when pattern matches to any directory inside other", () => {
        const fileNames = ["config/package.json", "src/dir/some-file.ts", "test/some-file.test.ts"];
        const patterns = ["src/dir/*", "config/*", "test/*"];

        expect(checkEveryGlob(patterns, fileNames)).toBeTruthy();
      });

      test("should return false when there is no filenames", () => {
        const fileNames: string[] = [];
        const patterns = ["src/*"];

        expect(checkEveryGlob(patterns, fileNames)).toBeFalsy();
      });

      test("should return false when there is no pattern", () => {
        const fileNames = ["package.json", "some-file.ts", "src/some-file.test.ts"];
        const patterns: string[] = [];

        expect(checkEveryGlob(patterns, fileNames)).toBeTruthy();
      });
    });
  });
});
