import { readFile } from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";
import { detectSireFileType, parseSireTxt, normalizePurchases, normalizeSales } from "@softbq/sire";
import { mapPurchasesToContasis, mapSalesToContasis } from "@softbq/contasis";
import { writeContasisPurchasesExcel, writeContasisSalesExcel } from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const outputDir = path.resolve(__dirname, "../../../storage/outputs");

  const files = [
    "C:\\\\Users\\\\arian\\\\arian\\\\Escritorio\\\\20612316750-20260608-1121-propuesta.txt",
    "C:\\\\Users\\\\arian\\\\arian\\\\Escritorio\\\\LE206123167502026060014040001EXP2.txt"
  ];

  for (const filePath of files) {
    try {
      console.log("Processing file: " + filePath);
      const txtContent = await readFile(filePath, "utf-8");
      
      const rawTable = parseSireTxt(txtContent);
      console.log("Parsed " + rawTable.rows.length + " rows.");

      const fileType = detectSireFileType(rawTable.headers);
      console.log("Detected file type: " + fileType);

      if (fileType === "purchases") {
        const purchases = normalizePurchases(rawTable);
        const contasisRows = mapPurchasesToContasis({
          client: {
            contasisEntityCode: "01",
            contasisEntityDescription: "MI ORGANIZACIÓN",
            defaultCondition: "01",
            defaultIgvPercent: 18,
            defaultPaymentMethod: "008"
          },
          purchases
        });
        
        console.log("Mapped " + contasisRows.length + " purchases to Contasis format.");
        
        const fileName = "COMPRAS_CONTASIS_REAL_" + path.basename(filePath) + ".xlsx";
        await writeContasisPurchasesExcel({
          fileName,
          rows: contasisRows,
          outputDir,
        });
        console.log("Purchases written to " + fileName + "\\n");
      } else if (fileType === "sales") {
        const sales = normalizeSales(rawTable);
        const contasisRows = mapSalesToContasis({
          client: {
            contasisEntityCode: "01",
            contasisEntityDescription: "MI ORGANIZACIÓN",
            defaultCondition: "01",
            defaultIgvPercent: 18,
            defaultPaymentMethod: "008"
          },
          sales
        });

        console.log("Mapped " + contasisRows.length + " sales to Contasis format.");

        const fileName = "VENTAS_CONTASIS_REAL_" + path.basename(filePath) + ".xlsx";
        await writeContasisSalesExcel({
          fileName,
          rows: contasisRows,
          outputDir,
        });
        console.log("Sales written to " + fileName + "\n");
      } else {
        console.log("Could not detect file type or unsupported format.\n");
      }
    } catch (err) {
      console.error("Error processing " + filePath + ":", err);
    }
  }
}

main().catch(console.error);
