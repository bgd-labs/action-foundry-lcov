type Lcov = {
    title: string;
    file: string;
    lines: {
        found: number;
        hit: number;
        details: {
            line: number;
            hit: number;
        }[];
    };
    functions: {
        found: number;
        hit: number;
        details: {
            name: string;
            line: number;
            hit: number;
        }[];
    };
    branches: {
        found: number;
        hit: number;
        details: {
            line: number;
            block: number;
            branch: number;
            taken: number;
        }[];
    };
}[];

type Options = {
    rootUrl: string;
};
declare function generateCoverageDiff(before: Lcov, after: Lcov, { rootUrl }: Options): string;
/**
 * aggregated line coverage over all files of a report
 */
declare function getTotalCoverage(report: Lcov): number;
/**
 * renders the total line coverage of `after` and, if `before` is not empty,
 * the difference in percentage points to `before`
 */
declare function generateTotalCoverage(before: Lcov, after: Lcov): string;

export { generateCoverageDiff, generateTotalCoverage, getTotalCoverage };
