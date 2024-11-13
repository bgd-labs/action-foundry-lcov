// src/lib.ts
function formatCoverage(coverage) {
  const percent = Number(coverage * 100).toLocaleString("en-US", {
    maximumFractionDigits: 2
  }) + "\\\\%";
  if (coverage === 1) return `$\${\\\\color{green}${percent}}$$`;
  if (coverage > 0.95) return `$\${\\\\color{lightgreen}${percent}}$$`;
  if (coverage > 0.8) return `$\${\\\\color{orange}${percent}}$$`;
  return `$\${\\\\color{red}${percent}}$$`;
}
function getCoverageLine({
  hit,
  found
}) {
  let percent = found == 0 ? 1 : hit / found;
  return `${formatCoverage(percent)}<br />${hit} / ${found}`;
}
function findFile(report, file) {
  return report.find((r) => r.file === file);
}
async function generateCoverageDiff(before, after) {
  let content = "| File | Line Coverage | Function Coverage | Branch Coverage |\n| --- | ---: | ---: | ---: |\n";
  for (const report of after) {
    const previousRunResult = findFile(before, report.file);
    const lineCoverage = getCoverageLine(report.lines);
    const functionCoverage = getCoverageLine(report.functions);
    const branchCoverage = getCoverageLine(report.branches);
    content += `| ${report.file} | ${lineCoverage} | ${functionCoverage} | ${branchCoverage} |
`;
  }
  return content;
}
export {
  generateCoverageDiff
};
