import * as Papa from "papaparse";

/**
 * Capitalize camel case
 * @param str - The string to capitalize
 * @returns The capitalized string
 */
function capitalizeCamelCase(str: string): string {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Export a file
 * @param content - The content to export
 * @param filename - The filename
 * @returns The CSV content
 */
export function exportFile(content: Array<Record<string, unknown>>, filename: string): string {
  const formattedContent = content.map((item) => {
    return Object.fromEntries(Object.entries(item).map(([key, value]) => [capitalizeCamelCase(key), value]));
  });

  const csvContent = Papa.unparse(formattedContent, {
    quotes: true,
    delimiter: ",",
    header: true,
  });

  // UTF-8 would generally be more space-efficient than UTF-16 for BMP characters,
  // but excel requires a BOM to be able to interpret the file encoding.
  // Since UTF-8 should not use BOM in most cases, we are exporting it as UTF-16.
  // See: https://stackoverflow.com/questions/2223882/whats-the-difference-between-utf-8-and-utf-8-with-bom
  const utf16BOM = "\ufeff";
  const blob = new Blob([utf16BOM + csvContent], { type: "text/csv;charset=utf-16" });

  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = filename;
  downloadLink.click();

  return csvContent;
}
