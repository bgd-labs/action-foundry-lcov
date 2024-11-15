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

export { generateCoverageDiff };
