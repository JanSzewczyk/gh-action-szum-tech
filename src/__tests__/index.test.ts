import { expect, test, describe, jest } from "@jest/globals";
import { main } from "../index";
import { info } from "@actions/core";

jest.mock("@actions/core", () => ({
  info: jest.fn()
}));

describe("Greetings Action", () => {
  test("should show to lines of text", () => {
    main();
    expect(info).toHaveBeenCalledTimes(2);
    expect(info).toHaveBeenCalledWith("Greetings users");
    expect(info).toHaveBeenCalledWith("\nHave a good hacking!!");
  });
});
