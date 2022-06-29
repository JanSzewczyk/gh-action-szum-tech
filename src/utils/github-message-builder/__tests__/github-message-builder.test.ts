import { describe, expect, test } from "@jest/globals";
import githubMessageBuilder from "../github-message-builder";

describe("Github Message Builder", () => {
  test("should be initialize with empty array", () => {
    expect(githubMessageBuilder().get()).toEqual([]);
  });

  test("should return `null` during building message when no content", () => {
    expect(githubMessageBuilder().build()).toEqual(null);
  });

  test("should return built text", () => {
    const message = "text test message";
    const messageBuilder = githubMessageBuilder().text(message);

    expect(messageBuilder.get().length).toEqual(1);
    expect(messageBuilder.build()).toEqual(message);
  });

  test("should return built header 1", () => {
    const message = "h1 test message";
    const messageBuilder = githubMessageBuilder().h1(message);

    expect(messageBuilder.get().length).toEqual(1);
    expect(messageBuilder.build()?.startsWith("# ")).toBeTruthy();
  });

  test("should return built header 2", () => {
    const message = "h2 test message";
    const messageBuilder = githubMessageBuilder().h2(message);

    expect(messageBuilder.get().length).toEqual(1);
    expect(messageBuilder.build()?.startsWith("## ")).toBeTruthy();
  });

  test("should return built header 3", () => {
    const message = "h3 test message";
    const messageBuilder = githubMessageBuilder().h3(message);

    expect(messageBuilder.get().length).toEqual(1);
    expect(messageBuilder.build()?.startsWith("### ")).toBeTruthy();
  });

  test("should return built header 4", () => {
    const message = "h4 test message";
    const messageBuilder = githubMessageBuilder().h4(message);

    expect(messageBuilder.get().length).toEqual(1);
    expect(messageBuilder.build()?.startsWith("#### ")).toBeTruthy();
  });

  test("should return built header 5", () => {
    const message = "h5 test message";
    const messageBuilder = githubMessageBuilder().h5(message);

    expect(messageBuilder.get().length).toEqual(1);
    expect(messageBuilder.build()?.startsWith("##### ")).toBeTruthy();
  });

  test("should return built quote", () => {
    const message = "quote test message";
    const messageBuilder = githubMessageBuilder().quote(message);

    expect(messageBuilder.get().length).toEqual(1);
    expect(messageBuilder.build()).toEqual(`<blockquote>${message}</blockquote>`);
  });

  test("should return built horizontal role", () => {
    const messageBuilder = githubMessageBuilder().hr();

    expect(messageBuilder.get().length).toEqual(1);
    expect(messageBuilder.build()).toEqual("---");
  });

  test("should return built watermark", () => {
    const message = "watermark test message";
    const messageBuilder = githubMessageBuilder().watermark(message);

    expect(messageBuilder.get().length).toEqual(1);
    expect(messageBuilder.build()).toEqual(`<!-- ${message} -->`);
  });

  test("should return built code block", () => {
    const someObject = {
      field: "aaa",
      field2: "bbb"
    };
    const messageBuilder = githubMessageBuilder().codeBlock(JSON.stringify(someObject, undefined, 2), "json");

    expect(messageBuilder.get().length).toEqual(1);
    expect(messageBuilder.build()).toEqual('```json\n{\n  "field": "aaa",\n  "field2": "bbb"\n}\n```');
  });

  test("should return built table", () => {
    const messageBuilder = githubMessageBuilder().table((tableBuilder) =>
      tableBuilder().body((rowBuilder) => [
        rowBuilder().th("label_1").td("data_1"),
        rowBuilder().th("label_2").td("data_2")
      ])
    );

    expect(messageBuilder.get().length).toEqual(1);
    expect(messageBuilder.build()).toEqual(
      "<table>\n<tr>\n<th>label_1</th>\n<td>data_1</td>\n</tr>\n<tr>\n<th>label_2</th>\n<td>data_2</td>\n</tr>\n</table>"
    );
  });

  test("should return built details", () => {
    const messageBuilder = githubMessageBuilder().details((detailsBuilder) =>
      detailsBuilder()
        .summary("summary")
        .body((messageBuilder) => messageBuilder().h1("some title").text("some text"))
    );

    expect(messageBuilder.get().length).toEqual(1);
    expect(messageBuilder.build()).toEqual(
      "<details>\n<summary>summary</summary>\n\n# some title\n\nsome text\n</details>"
    );
  });
});
