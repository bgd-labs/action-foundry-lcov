import { expect, it, describe } from "vitest";
import { generateCoverageDiff, generateTotalCoverage } from "./lib";
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
  it("should render total coverage without diff for empty root", async () => {
    expect(
      generateTotalCoverage([], await parseLcov("./mocks/lcov.info")),
    ).toMatchSnapshot();
  });
  it("should render total coverage with diff for existing root", async () => {
    expect(
      generateTotalCoverage(
        await parseLcov("./mocks/lcov.info.original"),
        await parseLcov("./mocks/lcov.info"),
      ),
    ).toMatchSnapshot();
  });
});
