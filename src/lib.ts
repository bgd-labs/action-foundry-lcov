import { Lcov } from "./lcov-parse";

function formatCoverage(coverage: number) {
  const percent = Number(coverage * 100).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
  let color = "red";
  if (coverage > 0.8) color = "orange";
  if (coverage > 0.95) color = "lightgreen";
  if (coverage === 1) color = "green";
  return "\\$\\${\\\\\\\\color{" + color + "}" + percent + "\\\\\\\\%}\\$\\$";
}

function getCoverageLine({
  hit,
  found,
}: {
  hit: number;
  found: number;
}): string {
  let percent = found == 0 ? 1 : hit / found;
  return `${formatCoverage(percent)}<br />${hit} / ${found}`;
}

function findFile(report: Lcov, file: string) {
  return report.find((r) => r.file === file);
}

export function generateCoverageDiff(before: Lcov, after: Lcov) {
  let content =
    "| File | Line Coverage | Function Coverage | Branch Coverage |\n| --- | ---: | ---: | ---: |\n";
  for (const report of after) {
    const previousRunResult = findFile(before, report.file);
    // do sth
    const lineCoverage = getCoverageLine(report.lines);
    const functionCoverage = getCoverageLine(report.functions);
    const branchCoverage = getCoverageLine(report.branches);

    content += `| ${report.file} | ${lineCoverage} | ${functionCoverage} | ${branchCoverage} |\n`;
  }
  return content;
}
