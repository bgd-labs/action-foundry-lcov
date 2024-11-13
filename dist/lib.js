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
  }) + "\\%";
  let color = "red";
  if (coverage > 0.8) color = "orange";
  if (coverage > 0.95) color = "lightgreen";
  if (coverage === 1) color = "green";
  return "\\$\\${\\color{" + color + "}" + percent + "\\$\\$";
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
function generateCoverageDiff(before, after) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateCoverageDiff
});
