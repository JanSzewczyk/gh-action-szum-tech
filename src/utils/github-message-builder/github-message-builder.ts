import textWithDecoratorBuilder, { TextWithDecoratorBuilderArgs } from "./builders/decorators";
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
import tableBuilder, { TableBuilderReturnType, TableBuilderType } from "./builders/table";
import { ReturnBuilderType } from "./types";
import detailsBuilder, { DetailsBuilderReturnType, DetailsBuilderType } from "./builders/details";

export interface GithubMessageBuilderReturnType extends ReturnBuilderType {
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
  table: (table: (tableBuilder: TableBuilderType) => TableBuilderReturnType) => GithubMessageBuilderReturnType;
  details: (
    details: (detailsBuilder: DetailsBuilderType) => DetailsBuilderReturnType
  ) => GithubMessageBuilderReturnType;
  add: (...contentToAdd: string[]) => GithubMessageBuilderReturnType;
}

export type GithubMessageBuilderType = typeof githubMessageBuilder;

export default function githubMessageBuilder(content: string[] = []): GithubMessageBuilderReturnType {
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
    table(table: (tableBuilder: TableBuilderType) => TableBuilderReturnType): GithubMessageBuilderReturnType {
      const t = table(tableBuilder).build();
      if (t) {
        content.push(t);
      }
      return githubMessageBuilder(content);
    },
    details(details: (detailsBuilder: DetailsBuilderType) => DetailsBuilderReturnType): GithubMessageBuilderReturnType {
      const d = details(detailsBuilder).build();
      if (d) {
        content.push(d);
      }
      return githubMessageBuilder(content);
    },

    // --------------------------------------- //

    build(): string | null {
      return content.length ? content.join("\n\n") : null;
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
