export const contasisSalesFields = [
  "ffechadoc D",
  "ffechaven D",
  "ccoddoc C(2)",
  "cserie C(20)",
  "cnumero C(20)",
  "ccodenti C(11)",
  "cdesenti C(100)",
  "ctipdoc C(1)",
  "ccodruc C(15)",
  "crazsoc C(100)",
  "nbase2 N(15,2)",
  "nbase1 N(15,2)",
  "nexo N(15,2)",
  "nina N(15,2)",
  "nisc N(15,2)",
  "nigv1 N(15,2)",
  "nicbpers N(15,2)",
  "nbase3 N(15,2)",
  "ntots N(15,2)",
  "ntc N(10,6)",
  "freffec D",
  "crefdoc C(2)",
  "crefser C(6)",
  "crefnum C(13)",
  "cmreg C(1)",
  "ndolar N(15,2)",
  "ffechaven2 D",
  "ccond C(3)",
  "ccodcos C(9)",
  "ccodcos2 C(9)",
  "cctabase C(20)",
  "cctaicbper C(20)",
  "cctaotrib C(20)",
  "cctatot C(20)",
  "nresp N(1)",
  "nporre N(5,2)",
  "nimpres N(15,2)",
  "cserre C(6)",
  "cnumre C(13)",
  "ffecre D",
  "ccodpresu C(10)",
  "nigv N(5,2)",
  "cglosa C(80)",
  "ccodpago C(3)",
  "nperdenre N(1)",
  "nbaseres N(15,2)",
  "cctaperc C(20)",
  "nflgtransgrat N(1)"
] as const;

export const salesFields = contasisSalesFields;

export type ContasisSalesTechnicalField = (typeof contasisSalesFields)[number];

export type ContasisSalesFieldName =
  ContasisSalesTechnicalField extends `${infer Name} ${string}` ? Name : never;

export const contasisSalesFieldNames = contasisSalesFields.map((field) =>
  field.split(" ")[0]
) as ContasisSalesFieldName[];
