import { expect, test, describe } from "@jest/globals";
import { getLabelsDifferences } from "./index";

describe("Label Action", () => {
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
      expect(labelDiff.remove).toEqual(["supported_label_1", "supported_label_2"]);
    });

    test("should return differences without unsupported label", () => {
      const detectedLabels = ["supported_label_3", "supported_label_4", "unsupported_label"];

      const labelDiff = getLabelsDifferences(pullRequestLabels, detectedLabels, supportedLabels);

      expect(labelDiff.add).toEqual(["supported_label_4"]);
      expect(labelDiff.remove).toEqual(["supported_label_1", "supported_label_2"]);
    });

    test("should return no difference", () => {
      const detectedLabels = ["supported_label_1", "supported_label_3", "supported_label_2"];

      const labelDiff = getLabelsDifferences(pullRequestLabels, detectedLabels, supportedLabels);

      expect(labelDiff.add).toEqual([]);
      expect(labelDiff.remove).toEqual([]);
    });
  });
});
