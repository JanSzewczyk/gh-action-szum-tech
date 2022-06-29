import { describe, expect, test } from "@jest/globals";
import {
  buildBr,
  buildCodeBlock,
  buildH1,
  buildH2,
  buildH3,
  buildH4,
  buildH5,
  buildHr,
  buildWatermark
} from "../../builders/common";

describe("Github Message Builder > Builders > Common", () => {
  test("buildCodeBlock(), should return a built code style", () => {
    const someObject = {
      field: "aaa",
      field2: "bbb"
    };
    const codeBlock = buildCodeBlock(JSON.stringify(someObject, undefined, 2), "json");
    expect(codeBlock).toEqual('```json\n{\n  "field": "aaa",\n  "field2": "bbb"\n}\n```');
  });

  test("buildWatermark(), should return a built watermark", () => {
    const message = "watermark test message";
    const watermark = buildWatermark(message);
    expect(watermark).toEqual(`<!-- ${message} -->`);
  });

  test("buildH1(), should return a built heading level 1", () => {
    const headingMessage = "Heading message";
    const h1 = buildH1(headingMessage);
    expect(h1).toEqual(`# ${headingMessage}`);
  });

  test("buildH2(), should return a built heading level 2", () => {
    const headingMessage = "Heading message";
    const h2 = buildH2(headingMessage);
    expect(h2).toEqual(`## ${headingMessage}`);
  });

  test("buildH3(), should return a built heading level 3", () => {
    const headingMessage = "Heading message";
    const h3 = buildH3(headingMessage);
    expect(h3).toEqual(`### ${headingMessage}`);
  });

  test("buildH4(), should return a built heading level 4", () => {
    const headingMessage = "Heading message";
    const h4 = buildH4(headingMessage);
    expect(h4).toEqual(`#### ${headingMessage}`);
  });

  test("buildH5(), should return a built heading level 5", () => {
    const headingMessage = "Heading message";
    const h5 = buildH5(headingMessage);
    expect(h5).toEqual(`##### ${headingMessage}`);
  });

  test("buildHr(), should return a built hr", () => {
    const hr = buildHr();
    expect(hr).toEqual("---");
  });

  test("buildBr(), should return a built br", () => {
    const br = buildBr();
    expect(br).toEqual("<br/>");
  });
});
