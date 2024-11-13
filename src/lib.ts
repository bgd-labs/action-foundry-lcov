import { Lcov } from "./lcov-parse";

function formatCoverage(coverage: number) {
  const percent = Number(coverage * 100).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
  let color = "red";
  if (coverage > 0.8) color = "orange";
  if (coverage > 0.95) color = "lightgreen";
  if (coverage === 1) color = "green";
  return "{\\\\color{" + color + "}" + percent + "\\\\\\\\%}";
}

type GetCoverageLineParams = {
  hit: number;
  found: number;
};

const UP = `↑`;
const DOWN = `↓`;

function formatCoverageLine(
  { hit, found }: GetCoverageLineParams,
  previousCoverage: number,
): string {
  const coverage = getCoverage({ hit, found });
  const diff =
    !previousCoverage || coverage === previousCoverage
      ? 0
      : ((coverage - previousCoverage) / Math.abs(previousCoverage)) * 100;
  let formattedString = formatCoverage(coverage);
  if (diff)
    formattedString =
      `^{${diff > 0 ? UP : DOWN}` +
      new Intl.NumberFormat("en-US", {
        maximumSignificantDigits: 2,
      }).format(diff) +
      "\\\\\\\\%}" +
      formattedString;

  return `\\$${formattedString}\\$<br />\\$${hit} / ${found}\\$`;
}

function findFile(report: Lcov, file: string) {
  return report.find((r) => r.file === file);
}

type GetCoverageParams = {
  hit: number;
  found: number;
};

function getCoverage({ hit, found }: GetCoverageParams) {
  return found == 0 ? 1 : hit / found;
}

type Options = {
  rootUrl: string;
};

export function generateCoverageDiff(
  before: Lcov,
  after: Lcov,
  { rootUrl }: Options,
) {
  let content =
    "| File | Line Coverage | Function Coverage | Branch Coverage |\n| --- | ---: | ---: | ---: |\n";
  for (const report of after) {
    const previousRunResult = findFile(before, report.file);
    const lineCoverage = formatCoverageLine(
      report.lines,
      previousRunResult ? getCoverage(previousRunResult.lines) : 0,
    );
    const missedLines = report.lines.details
      .filter((line) => line.hit === 0)
      .map((line) => `[${line.line}](${rootUrl}${report.file}#L${line.line})`)
      .join(", ");
    const functionCoverage = formatCoverageLine(
      report.functions,
      previousRunResult ? getCoverage(previousRunResult.functions) : 0,
    );
    const missedFunctions = report.functions.details
      .filter((line) => line.hit === 0)
      .map((line) => `[${line.name}](${rootUrl}${report.file}#L${line.line})`)
      .join("<br />");
    const branchCoverage = formatCoverageLine(
      report.branches,
      previousRunResult ? getCoverage(previousRunResult.branches) : 0,
    );

    content += `| ${report.file} | ${lineCoverage}<br />${missedLines} | ${functionCoverage}<br />${missedFunctions} | ${branchCoverage} |\n`;
  }
  return content;
}
