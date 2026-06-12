import ExcelJS from "exceljs";

async function generate() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Clientes");

  sheet.columns = [
    { header: "RUC", key: "ruc", width: 15 },
    { header: "Razon social", key: "businessName", width: 30 },
    { header: "Nombre corto", key: "shortName", width: 20 },
    { header: "Codigo entidad Contasis", key: "contasisEntityCode", width: 20 },
    { header: "Descripcion entidad Contasis", key: "contasisEntityDescription", width: 30 },
    { header: "Condicion por defecto", key: "defaultCondition", width: 20 },
    { header: "Código de pago por defecto", key: "defaultPaymentMethod", width: 25 },
    { header: "IGV por defecto", key: "defaultIgvPercent", width: 15 },
    { header: "Honorarios mensuales", key: "monthlyFee", width: 20 },
    { header: "Declara PLAME", key: "hasPlame", width: 15 },
    { header: "Declara AFPNET", key: "hasAfpnet", width: 15 },
    { header: "Declara ITAN", key: "hasItan", width: 15 },
    { header: "Declara DAOT", key: "hasDaot", width: 15 },
    { header: "Declara PDT 710", key: "hasPdt710", width: 15 },
    { header: "Cuenta de Ventas", key: "salesAccount", width: 20 },
    { header: "Cuenta de Compras", key: "purchasesAccount", width: 20 }
  ];

  sheet.getRow(1).font = { bold: true };

  await workbook.xlsx.writeFile("apps/web/public/formato_clientes.xlsx");
  console.log("File created!");
}

generate();
