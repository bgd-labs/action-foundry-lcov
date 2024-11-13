"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/lib.ts
var lib_exports = {};
__export(lib_exports, {
  generateCoverageDiff: () => generateCoverageDiff
});
module.exports = __toCommonJS(lib_exports);
function formatCoverage(coverage) {
  const percent = Number(coverage * 100).toLocaleString("en-US", {
    maximumFractionDigits: 2
  });
  let color = "red";
  if (coverage > 0.8) color = "orange";
  if (coverage > 0.95) color = "lightgreen";
  if (coverage === 1) color = "green";
  return "{\\color{" + color + "}" + percent + "%}";
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
    }).format(diff) + "%}" + formattedString;
  return `$${formattedString}$<br />$${hit} / ${found}$`;
}
function findFile(report, file) {
  return report.find((r) => r.file === file);
}
function getCoverage({ hit, found }) {
  return found == 0 ? 1 : hit / found;
}
function generateCoverageDiff(before, after) {
  let content = "| File | Line Coverage | Function Coverage | Branch Coverage |\n| --- | ---: | ---: | ---: |\n";
  for (const report of after) {
    const previousRunResult = findFile(before, report.file);
    const lineCoverage = formatCoverageLine(
      report.lines,
      previousRunResult ? getCoverage(previousRunResult.lines) : 0
    );
    const missedLines = report.lines.details.filter((line) => line.hit === 0).map((line) => `[${line.line}](${report.file}#L${line.line})`).join(",");
    const functionCoverage = formatCoverageLine(
      report.functions,
      previousRunResult ? getCoverage(previousRunResult.functions) : 0
    );
    const missedFunctions = report.functions.details.filter((line) => line.hit === 0).map((line) => `[${line.name}](${report.file}#L${line.line})`).join(",");
    const branchCoverage = formatCoverageLine(
      report.branches,
      previousRunResult ? getCoverage(previousRunResult.branches) : 0
    );
    content += `| ${report.file} | ${lineCoverage}<br />${missedLines} | ${functionCoverage}<br />${missedFunctions} | ${branchCoverage} |
`;
  }
  return content;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateCoverageDiff
});
