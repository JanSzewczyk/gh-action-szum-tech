interface Decorators {
  code: (text: string) => string;
  italic: (text: string) => string;
  bold: (text: string) => string;
}

type ContentWithDecorators = ((decorators: Decorators) => string) | string;

interface GithubMessageBuilderType {
  watermark: (text: string) => GithubMessageBuilderType;
  text: (contentWithDecorators: ContentWithDecorators) => GithubMessageBuilderType;
  h1: (contentWithDecorators: ContentWithDecorators) => GithubMessageBuilderType;
  h2: (contentWithDecorators: ContentWithDecorators) => GithubMessageBuilderType;
  h3: (contentWithDecorators: ContentWithDecorators) => GithubMessageBuilderType;
  h4: (contentWithDecorators: ContentWithDecorators) => GithubMessageBuilderType;
  h5: (contentWithDecorators: ContentWithDecorators) => GithubMessageBuilderType;
  quote: (contentWithDecorators: ContentWithDecorators) => GithubMessageBuilderType;
  codeBlock: (code: string, language: "json") => GithubMessageBuilderType;
  hr: () => GithubMessageBuilderType;
  br: () => GithubMessageBuilderType;
  build: () => string;
  get: () => string[];
  add: (...contentToAdd: string[]) => GithubMessageBuilderType;
  toString: () => void;
}

export function githubMessageBuilder(content: string[] = []): GithubMessageBuilderType {
  function boldDecorator(text: string): string {
    return `<strong>${text}</strong>`;
  }

  function codeDecorator(text: string): string {
    return `<code>${text}</code>`;
  }

  function italicDecorator(text: string): string {
    return `<i>${text}</i>`;
  }

  function createTextWithDecorator(contentWithDecorators: ContentWithDecorators): string {
    if (typeof contentWithDecorators !== "string") {
      return contentWithDecorators({ bold: boldDecorator, code: codeDecorator, italic: italicDecorator });
    } else {
      return contentWithDecorators;
    }
  }

  return {
    watermark(text: string): GithubMessageBuilderType {
      content.push(`<!-- ${text} -->`);
      return githubMessageBuilder(content);
    },
    text(contentWithDecorators: ContentWithDecorators): GithubMessageBuilderType {
      content.push(createTextWithDecorator(contentWithDecorators));
      return githubMessageBuilder(content);
    },
    h1(contentWithDecorators: ContentWithDecorators): GithubMessageBuilderType {
      content.push(`# ${createTextWithDecorator(contentWithDecorators)}`);
      return githubMessageBuilder(content);
    },
    h2(contentWithDecorators: ContentWithDecorators): GithubMessageBuilderType {
      content.push(`## ${createTextWithDecorator(contentWithDecorators)}`);
      return githubMessageBuilder(content);
    },
    h3(contentWithDecorators: ContentWithDecorators): GithubMessageBuilderType {
      content.push(`### ${createTextWithDecorator(contentWithDecorators)}`);
      return githubMessageBuilder(content);
    },
    h4(contentWithDecorators: ContentWithDecorators): GithubMessageBuilderType {
      content.push(`#### ${createTextWithDecorator(contentWithDecorators)}`);
      return githubMessageBuilder(content);
    },
    h5(contentWithDecorators: ContentWithDecorators): GithubMessageBuilderType {
      content.push(`##### ${createTextWithDecorator(contentWithDecorators)}`);
      return githubMessageBuilder(content);
    },
    // TODO add multiline
    quote(contentWithDecorators: ContentWithDecorators): GithubMessageBuilderType {
      content.push(`<blockquote>${createTextWithDecorator(contentWithDecorators)}</blockquote>`);
      return githubMessageBuilder(content);
    },
    codeBlock(code: string, language: "json"): GithubMessageBuilderType {
      content.push(["```", `${language}\n`, code, "\n```"].join(""));
      return githubMessageBuilder(content);
    },
    hr(): GithubMessageBuilderType {
      content.push("---");
      return githubMessageBuilder(content);
    },
    br(): GithubMessageBuilderType {
      content.push("<br/>");
      return githubMessageBuilder(content);
    },

    build(): string {
      return content.join("\n\n");
    },
    add(...contentToAdd: string[]): GithubMessageBuilderType {
      content.push(...contentToAdd);
      return githubMessageBuilder(content);
    },
    get(): string[] {
      return content;
    },
    toString(): void {
      // eslint-disable-next-line no-console
      console.log(this.build);
    }
  };
}
