export function getParametersDescription(parameters: Record<string, string | boolean>): string {
  function getMaxParameterNameLength(): number {
    return Math.max(...Object.keys(parameters).map((name) => name.length));
  }
  const nameLength = getMaxParameterNameLength() + 2;
  return [
    "PARAMETERS",
    "----------",
    ...Object.keys(parameters).map((name) => `${name + " ".repeat(nameLength - name.length)}: ${parameters[name]}`),
    "----------"
  ].join("\n");
}
