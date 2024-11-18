// src/lib.ts
function formatCoverage(coverage) {
  const percent = Number(coverage * 100).toLocaleString("en-US", {
    maximumFractionDigits: 2
  });
  let color = "red";
  if (coverage > 0.8) color = "orange";
  if (coverage > 0.95) color = "lightgreen";
  if (coverage === 1) color = "green";
  return "{\\\\color{" + color + "}" + percent + "\\\\\\\\%}";
}
var UP = `\u2191`;
var DOWN = `\u2193`;
function formatCoverageLine({ hit, found }, previousCoverage) {
  const coverage = getCoverage({ hit, found });
  const diff = !previousCoverage || coverage === previousCoverage ? 0 : (coverage - previousCoverage) / Math.abs(previousCoverage) * 100;
  let formattedString = formatCoverage(coverage);
  if (diff)
    formattedString = `^{${diff > 0 ? UP : DOWN}` + new Intl.NumberFormat("en-US", {
      maximumSignificantDigits: 2
    }).format(diff) + "\\\\\\\\%}" + formattedString;
  return `\\$${formattedString}\\$<br />\\$${hit} / ${found}\\$`;
}
function findFile(report, file) {
  return report.find((r) => r.file === file);
}
function getCoverage({ hit, found }) {
  return found == 0 ? 1 : hit / found;
}
function formatDetails(items, formatFn) {
  let content = items.map((item) => formatFn(item));
  if (items.length > 5)
    return content.slice(0, 5).join(", ") + ` and ${items.length - 5} more`;
  return content.join(", ");
}
function generateCoverageDiff(before, after, { rootUrl }) {
  let content = "| File | Line Coverage | Function Coverage | Branch Coverage |\n| --- | ---: | ---: | ---: |\n";
  for (const report of after) {
    const previousRunResult = findFile(before, report.file);
    const lineCoverage = formatCoverageLine(
      report.lines,
      previousRunResult ? getCoverage(previousRunResult.lines) : 0
    );
    const missedLines = formatDetails(
      report.lines.details.filter((line) => line.hit === 0),
      (line) => `[${line.line}](${rootUrl}${report.file}#L${line.line})`
    );
    const functionCoverage = formatCoverageLine(
      report.functions,
      previousRunResult ? getCoverage(previousRunResult.functions) : 0
    );
    const missedFunctions = formatDetails(
      report.functions.details.filter((line) => line.hit === 0),
      (line) => `[${line.name}](${rootUrl}${report.file}#L${line.line})`
    );
    const branchCoverage = formatCoverageLine(
      report.branches,
      previousRunResult ? getCoverage(previousRunResult.branches) : 0
    );
    content += `| ${report.file} | ${lineCoverage}<br />${missedLines} | ${functionCoverage}<br />${missedFunctions} | ${branchCoverage} |
`;
  }
  return content;
}
export {
  generateCoverageDiff
};
