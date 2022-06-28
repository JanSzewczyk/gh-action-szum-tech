import textWithDecoratorBuilder, { TextWithDecoratorBuilderArgs, Decorators } from "./builders/decorators";
import {
  buildBr,
  buildCodeBlock,
  buildH1,
  buildH2,
  buildH3,
  buildH4,
  buildH5,
  buildHr,
  buildQuote,
  buildWatermark
} from "./builders/common";

interface DecoratorsAndElements extends Decorators {
  codeBlock: (code: string, language: "json" | string) => string;
}

export type ContentWithDecoratorsAndElements = ((decoratorsAndElements: DecoratorsAndElements) => string) | string;

export interface GithubMessageBuilderReturnType {
  watermark: (text: string) => GithubMessageBuilderReturnType;
  text: (contentWithDecorators: TextWithDecoratorBuilderArgs) => GithubMessageBuilderReturnType;
  h1: (contentWithDecorators: TextWithDecoratorBuilderArgs) => GithubMessageBuilderReturnType;
  h2: (contentWithDecorators: TextWithDecoratorBuilderArgs) => GithubMessageBuilderReturnType;
  h3: (contentWithDecorators: TextWithDecoratorBuilderArgs) => GithubMessageBuilderReturnType;
  h4: (contentWithDecorators: TextWithDecoratorBuilderArgs) => GithubMessageBuilderReturnType;
  h5: (contentWithDecorators: TextWithDecoratorBuilderArgs) => GithubMessageBuilderReturnType;
  quote: (contentWithDecorators: TextWithDecoratorBuilderArgs) => GithubMessageBuilderReturnType;
  codeBlock: (code: string, language: "json" | string) => GithubMessageBuilderReturnType;
  hr: () => GithubMessageBuilderReturnType;
  br: () => GithubMessageBuilderReturnType;
  build: () => string;
  get: () => string[];
  add: (...contentToAdd: string[]) => GithubMessageBuilderReturnType;
  toString: () => void;
}

export type GithubMessageBuilderType = typeof githubMessageBuilder;

export function githubMessageBuilder(content: string[] = []): GithubMessageBuilderReturnType {
  return {
    watermark(text: string): GithubMessageBuilderReturnType {
      content.push(buildWatermark(text));
      return githubMessageBuilder(content);
    },
    text(contentWithDecorators: TextWithDecoratorBuilderArgs): GithubMessageBuilderReturnType {
      content.push(textWithDecoratorBuilder(contentWithDecorators));
      return githubMessageBuilder(content);
    },
    h1(contentWithDecorators: TextWithDecoratorBuilderArgs): GithubMessageBuilderReturnType {
      content.push(buildH1(textWithDecoratorBuilder(contentWithDecorators)));
      return githubMessageBuilder(content);
    },
    h2(contentWithDecorators: TextWithDecoratorBuilderArgs): GithubMessageBuilderReturnType {
      content.push(buildH2(textWithDecoratorBuilder(contentWithDecorators)));
      return githubMessageBuilder(content);
    },
    h3(contentWithDecorators: TextWithDecoratorBuilderArgs): GithubMessageBuilderReturnType {
      content.push(buildH3(textWithDecoratorBuilder(contentWithDecorators)));
      return githubMessageBuilder(content);
    },
    h4(contentWithDecorators: TextWithDecoratorBuilderArgs): GithubMessageBuilderReturnType {
      content.push(buildH4(textWithDecoratorBuilder(contentWithDecorators)));
      return githubMessageBuilder(content);
    },
    h5(contentWithDecorators: TextWithDecoratorBuilderArgs): GithubMessageBuilderReturnType {
      content.push(buildH5(textWithDecoratorBuilder(contentWithDecorators)));
      return githubMessageBuilder(content);
    },
    quote(contentWithDecorators: TextWithDecoratorBuilderArgs): GithubMessageBuilderReturnType {
      content.push(buildQuote(textWithDecoratorBuilder(contentWithDecorators)));
      return githubMessageBuilder(content);
    },
    codeBlock(code: string, language: "json" | string): GithubMessageBuilderReturnType {
      content.push(buildCodeBlock(code, language));
      return githubMessageBuilder(content);
    },
    hr(): GithubMessageBuilderReturnType {
      content.push(buildHr());
      return githubMessageBuilder(content);
    },
    br(): GithubMessageBuilderReturnType {
      content.push(buildBr());
      return githubMessageBuilder(content);
    },

    // --------------------------------------- //

    // TODO change to `string | null` as return type
    build(): string {
      return content.join("\n\n");
    },
    add(...contentToAdd: string[]): GithubMessageBuilderReturnType {
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
