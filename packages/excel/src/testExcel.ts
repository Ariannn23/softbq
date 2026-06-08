import path from "node:path";
import { fileURLToPath } from "node:url";

import { writeContasisSalesExcel } from "./writeContasisSalesExcel.js";
import { writeContasisPurchasesExcel } from "./writeContasisPurchasesExcel.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const outputDir = path.resolve(__dirname, "../../../storage/outputs");

  // Generar 10 ventas (5 SOLES, 5 DOLARES)
  const salesRows = Array.from({ length: 10 }).map((_, i) => {
    const isUsd = i >= 5;
    return {
      ffechadoc: `0${(i % 9) + 1}/05/2026`,
      ffechaven: "",
      ccoddoc: "01",
      cserie: "F001",
      cnumero: `00010${i}`,
      ccodenti: "00001",
      cdesenti: "CLIENTE DE PRUEBA",
      ctipdoc: "6",
      ccodruc: "20100010000",
      crazsoc: "EMPRESA ABC SAC",
      nbase2: 0,
      nbase1: isUsd ? 0 : 100,
      nexo: 0,
      nina: 0,
      nisc: 0,
      nigv1: isUsd ? 0 : 18,
      nicbpers: 0,
      nbase3: 0,
      ntots: isUsd ? 380 : 118,
      ntc: isUsd ? 3.80000 : 1,
      freffec: "",
      crefdoc: "",
      crefser: "",
      crefnum: "",
      cmreg: isUsd ? "D" : "S",
      ndolar: isUsd ? 100 : "",
      ffechaven2: `0${(i % 9) + 1}/05/2026`,
      ccond: "01",
      ccodcos: "",
      ccodcos2: "",
      cctabase: "",
      cctaicbper: "",
      cctaotrib: "",
      cctatot: "",
      nresp: "",
      nporre: "",
      nimpres: "",
      cserre: "",
      cnumre: "",
      ffecre: "",
      ccodpresu: "",
      nigv: 18,
      cglosa: "VENTA DE MERCADERIA",
      ccodpago: "008",
      nperdenre: "",
      nbaseres: "",
      cctaperc: "",
      nflgtransgrat: ""
    };
  });

  const salesOutput = await writeContasisSalesExcel({
    ruc: "20612316750",
    period: "202605",
    rows: salesRows,
    outputDir,
  });
  console.log("Sales written to:", salesOutput.outputPath);

  // Generar 10 compras (5 SOLES, 5 DOLARES)
  const purchaseRows = Array.from({ length: 10 }).map((_, i) => {
    const isUsd = i >= 5;
    return {
      ffechadoc: `0${(i % 9) + 1}/05/2026`,
      ffechaven: "",
      ccoddoc: "01",
      ccoddas: "",
      cyeardas: "",
      cserie: "F001",
      cnumero: `00090${i}`,
      ccodenti: "00005",
      cdesenti: "PROVEEDOR PRUEBA",
      ctipdoc: "6",
      ccodruc: "20200020000",
      crazsoc: "DISTRIBUIDORA XYZ EIRL",
      ccodclas: "1",
      nbase1: isUsd ? 0 : 200,
      nigv1: isUsd ? 0 : 36,
      nbase2: 0,
      nigv2: 0,
      nbase3: 0,
      nigv3: 0,
      nina: 0,
      nisc: 0,
      nicbper: 0,
      nexo: 0,
      ntots: isUsd ? 760 : 236,
      cdocnodom: "",
      cnumdere: "",
      ffecre: "",
      ntc: isUsd ? 3.80000 : 1,
      freffec: "",
      crefdoc: "",
      crefser: "",
      crefnum: "",
      cmreg: isUsd ? "D" : "S",
      ndolar: isUsd ? 200 : "",
      ffechaven2: `0${(i % 9) + 1}/05/2026`,
      ccond: "01",
      cctabase: "",
      cctaicbper: "",
      cctaotrib: "",
      cctatot: "",
      ccodcos: "",
      ccodcos2: "",
      nresp: "",
      nporre: "",
      nimpres: "",
      cserre: "",
      cnumre: "",
      ffecre2: "",
      ccodpresu: "",
      nigv: 18,
      cglosa: "COMPRA DE INSUMOS",
      nperdenre: "",
      nbaseres: "",
      cigvxacre: "",
      ccodpago: "008"
    };
  });

  const purchasesOutput = await writeContasisPurchasesExcel({
    ruc: "20612316750",
    period: "202605",
    rows: purchaseRows,
    outputDir,
  });
  console.log("Purchases written to:", purchasesOutput.outputPath);
}

main().catch(console.error);
