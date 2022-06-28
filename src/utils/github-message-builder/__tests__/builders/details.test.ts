import { describe, expect, test } from "@jest/globals";
import detailsBuilder, { buildDetails, buildSummary, DetailsBuilderReturnType } from "../../builders/details";

describe("Github Message Builder > Builders > Details", () => {
  test("buildDetails function, should return a built details", () => {
    const table = buildDetails("details_content");
    expect(table).toEqual("<details>\ndetails_content\n</details>");
  });

  test("buildSummary function, should return a built summary", () => {
    const summary = buildSummary("summary_content");
    expect(summary).toEqual("<summary>summary_content</summary>");
  });

  describe("detailsBuilder function", () => {
    test("should be initialize with empty array", () => {
      expect(detailsBuilder().get()).toEqual([]);
    });

    test("should return `null` during building `details` when no content", () => {
      expect(detailsBuilder().build()).toEqual(null);
    });

    test("should throw an error when try build `summary` two times", () => {
      const errorCall = (): DetailsBuilderReturnType => detailsBuilder().summary("summary").summary("summary");

      expect(errorCall).toThrowError();
      expect(errorCall).toThrowError(
        ["Github Message Builder > Builders > Details", "The summary has already been built."].join("\n")
      );
    });

    test("should throw an error when try build `details` in wrong order", () => {
      const errorCall = (): DetailsBuilderReturnType =>
        detailsBuilder()
          .body((messageBuilder) => messageBuilder().text("body text"))
          .summary("summary");

      expect(errorCall).toThrowError();
      expect(errorCall).toThrowError(
        ["Github Message Builder > Builders > Details", "Error building body, no summary building before body."].join(
          "\n"
        )
      );
    });

    test("should return build details correctly", () => {
      const details = detailsBuilder()
        .summary("some summary")
        .body((messageBuilder) => messageBuilder().h2("heading 2").text("some text"))
        .build();
      expect(details).toEqual("<details>\n<summary>some summary</summary>\n\n## heading 2\n\nsome text\n</details>");
    });

    test("should return build details with decorators correctly", () => {
      const details = detailsBuilder()
        .summary(({ italic }) => `some ${italic("summary")}`)
        .body((messageBuilder) =>
          messageBuilder()
            .h2("heading 2")
            .text(({ code }) => `some ${code("text")}`)
        )
        .build();
      expect(details).toEqual(
        "<details>\n<summary>some <i>summary</i></summary>\n\n## heading 2\n\nsome <code>text</code>\n</details>"
      );
    });

    test("should return build details with empty body", () => {
      const details = detailsBuilder()
        .summary(({ italic }) => `some ${italic("summary")}`)
        .body((messageBuilder) => messageBuilder())
        .build();
      expect(details).toEqual("<details>\n<summary>some <i>summary</i></summary>\n</details>");
    });
  });
});
