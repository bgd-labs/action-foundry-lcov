import parse from "lcov-parse";

export type Lcov = {
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

/**
 * Promisified & typed version of lcov-parse
 * @param filePath
 * @returns
 */
export async function parseLcov(filePath: string): Promise<Lcov> {
  return new Promise((resolve, reject) => {
    parse(filePath, (err, data) => {
      resolve(data);
    });
  });
}
