import { existsSync } from "fs";
import { getInput, setOutput } from "@actions/core";
import { context } from "@actions/github";
import { generateCoverageDiff, generateTotalCoverage } from "./lib";
import { parseLcov } from "./lcov-parse";
import { execSync } from "child_process";

const root = getInput("ROOT_REPORT_PATH");
const current = getInput("REPORT_PATH");
const command = getInput("COVERAGE_COMMAND");

if (command && command != "false") {
  try {
    execSync(command);
  } catch (err) {
    console.log("output", err);
    console.log("sdterr", (err as any).stderr.toString());
    process.exit(1);
  }
}

const rootExists = root && existsSync(root);
const currentExists = current && existsSync(current);

if (!currentExists) throw new Error("gas report not found");

async function main() {
  const before = rootExists ? await parseLcov(root) : [];
  const after = await parseLcov(current);
  const content = generateCoverageDiff(before, after, {
    rootUrl: `${context.payload.repository?.html_url}/blob/${context.sha}/`,
  });
  const totalCoverage = generateTotalCoverage(before, after);

  setOutput(
    "report",
    `<details><summary>:crystal_ball: <strong>Coverage report</strong> ${totalCoverage}</summary>\n\n${content}\n\n</details>`,
  );
}
main();
