import { describe, expect, test } from "@jest/globals";
import textWithDecoratorBuilder, { boldDecorator, codeDecorator, italicDecorator } from "../../builders/decorators";

describe("Github Message Builder > Builders > Decorators", () => {
  test("boldDecorator(), should return a built text with `bold` style", () => {
    const bold = boldDecorator("bold_text");
    expect(bold).toEqual("<strong>bold_text</strong>");
  });

  test("codeDecorator(), should return a built text with `code` style", () => {
    const code = codeDecorator("code_text");
    expect(code).toEqual("<code>code_text</code>");
  });

  test("italicDecorator function, should return a built text with `italic` style", () => {
    const italic = italicDecorator("italic_text");
    expect(italic).toEqual("<i>italic_text</i>");
  });

  describe("textWithDecoratorBuilder()", () => {
    test("should return a built text without any decorators", () => {
      const text = textWithDecoratorBuilder("some_text");
      expect(text).toEqual("some_text");
    });

    test("should return a built text with decorators", () => {
      const textWithDecorators = textWithDecoratorBuilder(
        ({ italic, code, bold }) =>
          `Lorem ipsum ${italic("dolor sit amet,")} consectetur adipiscing elit, ${code(
            "sed do eiusmod"
          )} tempor incididunt ut labore ${bold("et dolore magna aliqua")}.`
      );
      expect(textWithDecorators).toEqual(
        "Lorem ipsum <i>dolor sit amet,</i> consectetur adipiscing elit, <code>sed do eiusmod</code> tempor incididunt ut labore <strong>et dolore magna aliqua</strong>."
      );
    });
  });
});
