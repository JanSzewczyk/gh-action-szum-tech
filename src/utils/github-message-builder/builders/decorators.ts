export function boldDecorator(text: string): string {
  return `<strong>${text}</strong>`;
}

export function codeDecorator(text: string): string {
  return `<code>${text}</code>`;
}

export function italicDecorator(text: string): string {
  return `<i>${text}</i>`;
}

export interface Decorators {
  code: (text: string) => string;
  italic: (text: string) => string;
  bold: (text: string) => string;
}

export type TextWithDecoratorBuilderArgs = ((decorators: Decorators) => string) | string;
export type TextWithDecoratorBuilderType = typeof textWithDecoratorBuilder;

export default function textWithDecoratorBuilder(contentWithDecorators: TextWithDecoratorBuilderArgs): string {
  if (typeof contentWithDecorators !== "string") {
    return contentWithDecorators({ bold: boldDecorator, code: codeDecorator, italic: italicDecorator });
  } else {
    return contentWithDecorators;
  }
}
