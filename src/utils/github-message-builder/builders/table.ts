import { ReturnBuilderType } from "../types";

export function buildTable(content: string): string {
  return ["<table>", content, "</table>"].join("\n");
}

export function buildTr(content: string): string {
  return ["<tr>", content, "</tr>"].join("\n");
}

export function buildTh(content: string): string {
  return ["<th>", content, "</th>"].join("");
}

export function buildTd(content: string): string {
  return ["<td>", content, "</td>"].join("");
}

interface TableRowBuilderReturnType extends ReturnBuilderType {
  th: (text: string) => TableRowBuilderReturnType;
  td: (text: string) => TableRowBuilderReturnType;
}

type TableRowBuilderType = typeof tableRowBuilder;

export function tableRowBuilder(content: string[] = []): TableRowBuilderReturnType {
  return {
    th(text: string): TableRowBuilderReturnType {
      content.push(buildTh(text));
      return tableRowBuilder(content);
    },
    td(text: string): TableRowBuilderReturnType {
      content.push(buildTd(text));
      return tableRowBuilder(content);
    },

    // --------------------------------------- //

    build(): string | null {
      return content.length ? buildTr(content.join("\n")) : null;
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

export interface TableBuilderReturnType extends ReturnBuilderType {
  body: (row: (rowBuilder: TableRowBuilderType) => TableRowBuilderReturnType[]) => TableBuilderReturnType;
}

export type TableBuilderType = typeof tableBuilder;

export default function tableBuilder(content: string[] = []): TableBuilderReturnType {
  return {
    body(row: (rowBuilder: TableRowBuilderType) => TableRowBuilderReturnType[]): TableBuilderReturnType {
      content.push(
        ...(row(tableRowBuilder)
          .map((row) => row.build())
          .filter((r) => r !== null) as string[])
      );
      return tableBuilder(content);
    },

    // --------------------------------------- //

    build(): string | null {
      return content.length ? buildTable(content.join("\n")) : null;
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
