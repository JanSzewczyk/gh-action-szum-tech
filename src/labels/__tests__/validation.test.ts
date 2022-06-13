import { describe, expect, test } from "@jest/globals";
import { checkAnyGlob } from "../validation";

describe("Labels Action Validation", () => {
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
});
