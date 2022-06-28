import { ReturnBuilderType } from "../types";
import {
  githubMessageBuilder,
  GithubMessageBuilderType,
  GithubMessageBuilderReturnType
} from "../github-message-builder";
import textWithDecoratorBuilder, { TextWithDecoratorBuilderArgs } from "./decorators";

export function buildDetails(content: string): string {
  return ["<details>", content, "</details>"].join("\n");
}

export function buildSummary(content: string): string {
  return ["<summary>", content, "</summary>"].join("");
}

export interface DetailsBuilderReturnType extends ReturnBuilderType {
  summary: (summary: TextWithDecoratorBuilderArgs) => DetailsBuilderReturnType;
  body: (
    body: (messageBuilder: GithubMessageBuilderType) => GithubMessageBuilderReturnType
  ) => DetailsBuilderReturnType;
}

export type DetailsBuilderType = typeof detailsBuilder;

export default function detailsBuilder(content: string[] = []): DetailsBuilderReturnType {
  function checkSummaryPosition(c: string[]): boolean {
    if (c.length) {
      return c[0].startsWith("<summary>") && c[0].endsWith("</summary>");
    }
    return false;
  }

  return {
    summary(summary: TextWithDecoratorBuilderArgs): DetailsBuilderReturnType {
      if (content.length) {
        throw new Error(
          [
            "Github Message Builder > Builders > Details",
            checkSummaryPosition(content)
              ? "The summary has already been built."
              : "Error building summary, the summary function must be called first."
          ].join("\n")
        );
      }

      content.push(buildSummary(textWithDecoratorBuilder(summary)));
      return detailsBuilder(content);
    },
    body(body: (messageBuilder: GithubMessageBuilderType) => GithubMessageBuilderReturnType): DetailsBuilderReturnType {
      if (!checkSummaryPosition(content)) {
        throw new Error(
          ["Github Message Builder > Builders > Details", "Error building body, no summary building before body."].join(
            "\n"
          )
        );
      }

      const b = body(githubMessageBuilder).build();
      if (b) {
        content.push(b);
      }
      return detailsBuilder(content);
    },

    // --------------------------------------- //

    build(): string | null {
      return content.length ? buildDetails(content.join("\n\n")) : null;
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
