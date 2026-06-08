import ExcelJS from "exceljs";
import path from "node:path";
import util from "node:util";

async function inspectFile(filePath: string) {
  console.log(`\n--- Inspecting: ${filePath} ---`);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  workbook.eachSheet((worksheet, sheetId) => {
    console.log(`\nSheet Name: ${worksheet.name}`);
    console.log(`Row count: ${worksheet.rowCount}`);

    const headerRow = worksheet.getRow(1);
    const firstDataRow = worksheet.getRow(2);

    const headers: Record<number, string> = {};
    const firstData: Record<string, any> = {};

    headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      headers[colNumber] = cell.text;
    });

    console.log(`\nHeaders (Fila 1):`);
    console.log(headers);

    firstDataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const headerName = headers[colNumber] || `Col_${colNumber}`;
      firstData[headerName] = {
        value: cell.value,
        type: cell.type,
        numFmt: cell.numFmt,
      };
    });

    // console.log(`\nFirst Data Row (Fila 2):`);
    // console.log(util.inspect(firstData, { showHidden: false, depth: null, colors: true }));
  });
}

async function main() {
  await inspectFile("C:\\Users\\arian\\arian\\Escritorio\\Formato Ventas_INTERCABLE.xlsx");
  await inspectFile("C:\\Users\\arian\\arian\\Escritorio\\Formato Compras_INTERCABLE.xlsx");
}

main().catch(console.error);
