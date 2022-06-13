import minimatch from "minimatch";

export function checkAnyGlob(patterns: string[], fileNames: string[]): boolean {
  if (!patterns.length) {
    return true;
  }

  return patterns.some((pattern) => fileNames.some((fileName) => minimatch(fileName, pattern)));
}

export function checkEveryGlob(patterns: string[], fileNames: string[]): boolean {
  if (!patterns.length) {
    return true;
  }

  return patterns.every((pattern) => fileNames.every((fileName) => minimatch(fileName, pattern)));
}
