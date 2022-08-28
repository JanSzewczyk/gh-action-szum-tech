import { describe, expect, test } from "@jest/globals";

import { getParametersDescription } from "@utils/utils";

describe("Utils", () => {
  describe("getParametersDescription()", () => {
    test("should return description with parameters", () => {
      expect(
        getParametersDescription({
          numeric_param: 123,
          string_param: "some string",
          null_param: null,
          boolean_param: false
        })
      ).toEqual(
        "PARAMETERS\n" +
          "----------\n" +
          "numeric_param  : 123\n" +
          "string_param   : some string\n" +
          "null_param     : null\n" +
          "boolean_param  : false\n" +
          "----------"
      );
    });

    test("should return description without parameters", () => {
      expect(getParametersDescription()).toEqual("PARAMETERS\n----------\n----------");
    });
  });
});
