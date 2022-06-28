import { describe, expect, test } from "@jest/globals";
import tableBuilder, { buildTable, buildTd, buildTh, buildTr, tableRowBuilder } from "../../builders/table";

describe("Github Message Builder > Builders > Table", () => {
  test("buildTable function, return a built table", () => {
    const table = buildTable("table_content");
    expect(table).toEqual("<table>\ntable_content\n</table>");
  });

  test("buildTr function, return a built table row", () => {
    const tr = buildTr("row_content");
    expect(tr).toEqual("<tr>\nrow_content\n</tr>");
  });

  test("buildTh function, return a built table header", () => {
    const th = buildTh("table_header_content");
    expect(th).toEqual("<th>table_header_content</th>");
  });

  test("buildTd function, return a built table data", () => {
    const td = buildTd("table_data_content");
    expect(td).toEqual("<td>table_data_content</td>");
  });

  describe("tableRowBuilder function", () => {
    test("should be initialize with empty array", () => {
      expect(tableRowBuilder().get()).toEqual([]);
    });

    test("should return `null` during building `table row` when no content", () => {
      expect(tableRowBuilder().build()).toEqual(null);
    });

    test("should return a built table row", () => {
      const tableRow = tableRowBuilder().th("cell_1").th("cell_2");
      expect(tableRow.build()?.startsWith("<tr>")).toBeTruthy();
      expect(tableRow.build()?.endsWith("</tr>")).toBeTruthy();
    });

    test("should return a built table row with 2 `th` columns", () => {
      const tableRow = tableRowBuilder().th("cell_1").th("cell_2");
      expect(tableRow.get().length).toEqual(2);
      expect(tableRow.get().every((i) => i.startsWith("<th>") && i.endsWith("</th>"))).toBeTruthy();
      expect(tableRow.build()).toEqual("<tr>\n<th>cell_1</th>\n<th>cell_2</th>\n</tr>");
    });

    test("should return a built table row with 2 `td` columns", () => {
      const tableRow = tableRowBuilder().td("cell_1").td("cell_2");
      expect(tableRow.get().length).toEqual(2);
      expect(tableRow.get().every((i) => i.startsWith("<td>") && i.endsWith("</td>"))).toBeTruthy();
      expect(tableRow.build()).toEqual("<tr>\n<td>cell_1</td>\n<td>cell_2</td>\n</tr>");
    });

    test("should return a built table row with `td` and `th` columns", () => {
      const tableRow = tableRowBuilder().td("cell_1").th("cell_2");
      expect(tableRow.get().length).toEqual(2);
      expect(
        tableRow
          .get()
          .every((i) => (i.startsWith("<td>") && i.endsWith("</td>")) || (i.startsWith("<th>") && i.endsWith("</th>")))
      ).toBeTruthy();
      expect(tableRow.build()).toEqual("<tr>\n<td>cell_1</td>\n<th>cell_2</th>\n</tr>");
    });
  });

  describe("tableBuilder function", () => {
    test("should be initialize with empty array", () => {
      expect(tableBuilder().get()).toEqual([]);
    });

    test("should return `null` during building `table` when no content", () => {
      expect(tableBuilder().build()).toEqual(null);
    });

    test("should return a built table with table header and row data", () => {
      const table = tableBuilder()
        .body((rowBuilder) => [rowBuilder().th("header_1").th("header_2"), rowBuilder().td("cell_1").td("cell_2")])
        .build();

      expect(table).toEqual(
        "<table>\n<tr>\n<th>header_1</th>\n<th>header_2</th>\n</tr>\n<tr>\n<td>cell_1</td>\n<td>cell_2</td>\n</tr>\n</table>"
      );
    });

    test("should return a built table without no data row", () => {
      const table = tableBuilder()
        .body((rowBuilder) => [rowBuilder(), rowBuilder().td("cell_1").td("cell_2")])
        .build();

      expect(table).toEqual("<table>\n<tr>\n<td>cell_1</td>\n<td>cell_2</td>\n</tr>\n</table>");
    });
  });
});
