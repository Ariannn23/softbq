import type { SirePurchaseRecord } from "@softbq/sire";

import type { ContasisPurchaseFieldName } from "../fields/purchaseFields.js";
import { contasisPurchaseFieldNames } from "../fields/purchaseFields.js";
import { sanitizeBusinessName } from "../utils/sanitize.js";

export type ContasisPurchaseValue = number | string;

export type ContasisPurchaseRow = Record<ContasisPurchaseFieldName, ContasisPurchaseValue>;

export type ContasisPurchaseClientConfig = {
  contasisEntityCode: string;
  contasisEntityDescription: string;
  defaultCondition: string;
  defaultGoodsServicesClassification: string;
  defaultIgvPercent: number;
  defaultPaymentMethod: string;
  purchasesBaseAccount: string;
  purchasesTotalAccount: string;
};

export type MapPurchasesToContasisInput = {
  client: ContasisPurchaseClientConfig;
  purchases: SirePurchaseRecord[];
};

export function mapPurchasesToContasis(
  input: MapPurchasesToContasisInput
): ContasisPurchaseRow[] {
  return input.purchases.map((purchase) =>
    mapPurchaseToContasisRow(purchase, input.client)
  );
}

function mapPurchaseToContasisRow(
  purchase: SirePurchaseRecord,
  client: ContasisPurchaseClientConfig
): ContasisPurchaseRow {
  const row = createEmptyPurchaseRow();

  row.ffechadoc = purchase.issueDate;
  row.ffechaven = "";
  row.ccoddoc = purchase.documentType;
  row.ccoddas = purchase.damDsiCode;
  row.cyeardas = purchase.year;
  row.cserie = purchase.series;
  row.cnumero = purchase.number;
  row.ccodenti = client.contasisEntityCode;
  row.cdesenti = client.contasisEntityDescription;
  row.ctipdoc = purchase.supplierDocumentType;
  row.ccodruc = purchase.supplierDocumentNumber;
  row.crazsoc = sanitizeBusinessName(purchase.supplierName);
  row.ccodclas =
    purchase.goodsServicesClassification || client.defaultGoodsServicesClassification;
  row.nbase1 = purchase.taxableBaseDg;
  row.nigv1 = purchase.igvDg;
  row.nbase2 = purchase.taxableBaseDgng;
  row.nigv2 = purchase.igvDgng;
  row.nbase3 = purchase.taxableBaseDng;
  row.nigv3 = purchase.igvDng;
  row.nina = purchase.nonTaxedAcquisitionValue;
  row.nisc = purchase.isc;
  row.nicbper = purchase.icbper;
  row.nexo = purchase.otherCharges;
  row.ntots = purchase.total;
  row.cdocnodom = "";
  row.cnumdere = "";
  row.ffecre = "";
  row.ntc = purchase.exchangeRate || 1;
  row.freffec = purchase.modifiedIssueDate;
  row.crefdoc = purchase.modifiedDocumentType;
  row.crefser = purchase.modifiedSeries;
  row.crefnum = purchase.modifiedNumber;
  row.cmreg = mapCurrency(purchase.currency);
  row.ndolar = purchase.currency === "USD" ? purchase.exchangeRate : "";
  row.ffechaven2 = purchase.issueDate;
  row.ccond = client.defaultCondition;
  row.cctabase = client.purchasesBaseAccount;
  row.cctaicbper = "";
  row.cctaotrib = "";
  row.cctatot = client.purchasesTotalAccount;
  row.ccodcos = "";
  row.ccodcos2 = "";
  row.nresp = "";
  row.nporre = "";
  row.nimpres = "";
  row.cserre = "";
  row.cnumre = "";
  row.ffecre2 = "";
  row.ccodpresu = "";
  row.nigv = client.defaultIgvPercent;
  row.cglosa = buildGlosa(purchase);
  row.nperdenre = "";
  row.nbaseres = "";
  row.cigvxacre = "";
  row.ccodpago = client.defaultPaymentMethod;

  return row;
}

function createEmptyPurchaseRow(): ContasisPurchaseRow {
  return Object.fromEntries(
    contasisPurchaseFieldNames.map((field) => [field, ""])
  ) as ContasisPurchaseRow;
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

function buildGlosa(purchase: SirePurchaseRecord): string {
  return `COMPRA ${purchase.series}-${purchase.number}`.slice(0, 50);
}
