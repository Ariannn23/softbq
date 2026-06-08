import type { SireSalesRecord } from "@softbq/sire";

import type { ContasisSalesFieldName } from "../fields/salesFields.js";
import { contasisSalesFieldNames } from "../fields/salesFields.js";

export type ContasisSalesValue = number | string;

export type ContasisSalesRow = Record<ContasisSalesFieldName, ContasisSalesValue>;

export type ContasisSalesClientConfig = {
  contasisEntityCode: string;
  contasisEntityDescription: string;
  defaultCondition: string;
  defaultIgvPercent: number;
  defaultPaymentMethod: string;
};

export type MapSalesToContasisInput = {
  client: ContasisSalesClientConfig;
  sales: SireSalesRecord[];
};

export function mapSalesToContasis(input: MapSalesToContasisInput): ContasisSalesRow[] {
  return input.sales.map((sale) => mapSaleToContasisRow(sale, input.client));
}

function mapSaleToContasisRow(
  sale: SireSalesRecord,
  client: ContasisSalesClientConfig
): ContasisSalesRow {
  const row = createEmptySalesRow();
  const dueDate = sale.dueDate || sale.issueDate;

  row.ffechadoc = sale.issueDate;
  row.ffechaven = sale.dueDate;
  row.ccoddoc = sale.documentType;
  row.cserie = sale.series;
  row.cnumero = sale.number;
  row.ccodenti = client.contasisEntityCode;
  row.cdesenti = client.contasisEntityDescription;
  row.ctipdoc = sale.customerDocumentType;
  row.ccodruc = sale.customerDocumentNumber;
  row.crazsoc = sale.customerName;
  row.nbase2 = sale.exportValue;
  row.nbase1 = sale.taxableBase;
  row.nexo = sale.exemptAmount;
  row.nina = sale.unaffectedAmount;
  row.nisc = sale.isc;
  row.nigv1 = sale.igv;
  row.nicbpers = sale.icbper;
  row.nbase3 = sale.otherTaxes;
  row.ntots = sale.total;
  row.ntc = sale.exchangeRate;
  row.freffec = sale.modifiedIssueDate;
  row.crefdoc = sale.modifiedDocumentType;
  row.crefser = sale.modifiedSeries;
  row.crefnum = sale.modifiedNumber;
  row.cmreg = mapCurrency(sale.currency);
  row.ndolar = sale.currency === "USD" ? sale.total : 0;
  row.ffechaven2 = dueDate;
  row.ccond = client.defaultCondition;
  row.ccodcos = "";
  row.ccodcos2 = "";
  row.cctabase = "";
  row.cctaicbper = "";
  row.cctaotrib = "";
  row.cctatot = "";
  row.nresp = 0;
  row.nporre = 0;
  row.nimpres = 0;
  row.cserre = "";
  row.cnumre = "";
  row.ffecre = "";
  row.ccodpresu = "";
  row.nigv = client.defaultIgvPercent;
  row.cglosa = buildGlosa(sale);
  row.ccodpago = client.defaultPaymentMethod;
  row.nperdenre = 0;
  row.nbaseres = 0;
  row.cctaperc = "";
  row.nflgtransgrat = sale.freeOperationsValue > 0 ? 1 : 0;

  return row;
}

function createEmptySalesRow(): ContasisSalesRow {
  return Object.fromEntries(
    contasisSalesFieldNames.map((field) => [field, ""])
  ) as ContasisSalesRow;
}

function mapCurrency(currency: string): string {
  if (currency === "PEN") {
    return "S";
  }

  if (currency === "USD") {
    return "D";
  }

  return "";
}

function buildGlosa(sale: SireSalesRecord): string {
  return `VENTA ${sale.series}-${sale.number}`.slice(0, 80);
}
