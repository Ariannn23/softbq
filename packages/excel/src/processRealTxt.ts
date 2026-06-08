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
            contasisEntityDescription: "MI EMPRESA",
            defaultCondition: "CON",
            defaultIgvPercent: 18,
            defaultPaymentMethod: "008",
            defaultGoodsServicesClassification: "0"
          },
          purchases
        });
        
        console.log("Mapped " + contasisRows.length + " purchases to Contasis format.");
        
        const ruc = "20612316750"; // Use a dummy RUC for test
        const period = "202605"; // Use a dummy period
        await writeContasisPurchasesExcel({
          ruc,
          period,
          rows: contasisRows,
          outputDir,
        });
        console.log("Purchases written to " + outputDir + "\n");
      } else if (fileType === "sales") {
        const sales = normalizeSales(rawTable);
        const contasisRows = mapSalesToContasis({
          client: {
            contasisEntityCode: "01",
            contasisEntityDescription: "MI EMPRESA",
            defaultCondition: "CON",
            defaultIgvPercent: 18,
            defaultPaymentMethod: "008",
            defaultGoodsServicesClassification: "0"
          },
          sales
        });

        console.log("Mapped " + contasisRows.length + " sales to Contasis format.");

        const ruc = "20612316750"; // Use a dummy RUC for test
        const period = "202605"; // Use a dummy period
        await writeContasisSalesExcel({
          ruc,
          period,
          rows: contasisRows,
          outputDir,
        });
        console.log("Sales written to " + outputDir + "\n");
      } else {
        console.log("Could not detect file type or unsupported format.\n");
      }
    } catch (err) {
      console.error("Error processing " + filePath + ":", err);
    }
  }
}

main().catch(console.error);
