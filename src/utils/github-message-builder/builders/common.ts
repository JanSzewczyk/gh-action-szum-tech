export function buildWatermark(content: string): string {
  return `<!-- ${content} -->`;
}

export function buildCodeBlock(code: string, language: "json" | string): string {
  return `\`\`\`${language}\n${code}\n\`\`\``;
}

export function buildH1(content: string): string {
  return `# ${content}`;
}

export function buildH2(content: string): string {
  return `## ${content}`;
}

export function buildH3(content: string): string {
  return `### ${content}`;
}

export function buildH4(content: string): string {
  return `#### ${content}`;
}

export function buildH5(content: string): string {
  return `##### ${content}`;
}

export function buildQuote(content: string): string {
  return `<blockquote>${content}</blockquote>`;
}

export function buildHr(): string {
  return "---";
}

export function buildBr(): string {
  return "<br/>";
}
