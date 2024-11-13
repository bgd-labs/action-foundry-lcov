import { expect, it, describe } from "vitest";
import { generateCoverageDiff } from "./lib";
import { parseLcov } from "./lcov-parse";

describe("lib", () => {
  it("should generate a well formatted coverage report with empty root", async () => {
    expect(
      generateCoverageDiff([], await parseLcov("./mocks/lcov.info"), {
        rootUrl: "https://github.com/",
      }),
    ).toMatchSnapshot();
  });
  it("should generate a well formatted report with existing root", async () => {
    expect(
      generateCoverageDiff(
        await parseLcov("./mocks/lcov.info.original"),
        await parseLcov("./mocks/lcov.info"),
        {
          rootUrl: "https://github.com/",
        },
      ),
    ).toMatchSnapshot();
  });
});
