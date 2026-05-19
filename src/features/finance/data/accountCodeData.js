export const ACCOUNT_CODE_STORAGE_KEY = "bumi.finance.account-codes";

export const accountCodeSeedRecords = [
  {
    id: "ACC-4110-001",
    accountCode: "4110-001",
    accountName: "Revenue Freight Darat",
    category: "Revenue",
    group: "Freight",
    currency: "Multi Currency",
    status: "Active",
    notes: "Dipakai untuk line item trucking, FTL, dan LTL.",
    rowCells: ["Revenue", "Freight", "Multi Currency", "Active"],
    details: [
      { label: "Account Code", value: "4110-001" },
      { label: "Account Name", value: "Revenue Freight Darat" },
      { label: "Category", value: "Revenue" },
      { label: "Usage", value: "Quotation dan invoice line untuk jasa darat" },
    ],
  },
  {
    id: "ACC-4110-002",
    accountCode: "4110-002",
    accountName: "Revenue Freight Laut",
    category: "Revenue",
    group: "Freight",
    currency: "Multi Currency",
    status: "Active",
    notes: "Dipakai untuk ocean freight export/import/domestic.",
    rowCells: ["Revenue", "Freight", "Multi Currency", "Active"],
    details: [
      { label: "Account Code", value: "4110-002" },
      { label: "Account Name", value: "Revenue Freight Laut" },
      { label: "Category", value: "Revenue" },
      { label: "Usage", value: "Quotation dan invoice line untuk jasa laut" },
    ],
  },
  {
    id: "ACC-4110-003",
    accountCode: "4110-003",
    accountName: "Revenue Freight Udara",
    category: "Revenue",
    group: "Freight",
    currency: "USD",
    status: "Active",
    notes: "Dipakai untuk air freight dan express cargo.",
    rowCells: ["Revenue", "Freight", "USD", "Active"],
    details: [
      { label: "Account Code", value: "4110-003" },
      { label: "Account Name", value: "Revenue Freight Udara" },
      { label: "Category", value: "Revenue" },
      { label: "Usage", value: "Quotation dan invoice line untuk jasa udara" },
    ],
  },
  {
    id: "ACC-4120-001",
    accountCode: "4120-001",
    accountName: "Revenue Handling & THC",
    category: "Revenue",
    group: "Ancillary",
    currency: "Multi Currency",
    status: "Active",
    notes: "Dipakai untuk THC, warehouse handling, stuffing, stripping.",
    rowCells: ["Revenue", "Ancillary", "Multi Currency", "Active"],
    details: [
      { label: "Account Code", value: "4120-001" },
      { label: "Account Name", value: "Revenue Handling & THC" },
      { label: "Category", value: "Revenue" },
      { label: "Usage", value: "Line charges untuk handling dan terminal" },
    ],
  },
  {
    id: "ACC-4120-002",
    accountCode: "4120-002",
    accountName: "Revenue Customs Clearance",
    category: "Revenue",
    group: "Ancillary",
    currency: "IDR",
    status: "Active",
    notes: "Dipakai untuk custom clearance, PIB, SPPB, dan jasa customs broker.",
    rowCells: ["Revenue", "Ancillary", "IDR", "Active"],
    details: [
      { label: "Account Code", value: "4120-002" },
      { label: "Account Name", value: "Revenue Customs Clearance" },
      { label: "Category", value: "Revenue" },
      { label: "Usage", value: "Line charges untuk customs clearance" },
    ],
  },
  {
    id: "ACC-4120-003",
    accountCode: "4120-003",
    accountName: "Revenue Documentation Fee",
    category: "Revenue",
    group: "Ancillary",
    currency: "Multi Currency",
    status: "Active",
    notes: "Dipakai untuk admin dokumen, BL, AWB, surat jalan, dan dokumen proyek.",
    rowCells: ["Revenue", "Ancillary", "Multi Currency", "Active"],
    details: [
      { label: "Account Code", value: "4120-003" },
      { label: "Account Name", value: "Revenue Documentation Fee" },
      { label: "Category", value: "Revenue" },
      { label: "Usage", value: "Line charges untuk administrasi dokumen" },
    ],
  },
];

export const accountCodeFormDefaults = {
  accountCode: "",
  accountName: "",
  category: "Revenue",
  group: "Freight",
  currency: "Multi Currency",
  status: "Active",
  notes: "",
};

export function createAccountCodeRecordFromForm(formData) {
  return {
    id: `ACC-${formData.accountCode}`,
    accountCode: formData.accountCode,
    accountName: formData.accountName,
    category: formData.category,
    group: formData.group,
    currency: formData.currency,
    status: formData.status,
    notes: formData.notes || "-",
    rowCells: [formData.category, formData.group, formData.currency, formData.status],
    details: [
      { label: "Account Code", value: formData.accountCode },
      { label: "Account Name", value: formData.accountName },
      { label: "Category", value: formData.category },
      { label: "Usage", value: formData.notes || "-" },
    ],
  };
}

export function getAccountCodeOptions(records) {
  return records
    .filter((record) => record.status !== "Archived")
    .map((record) => ({
      accountCode: record.accountCode,
      accountName: record.accountName,
      category: record.category,
      group: record.group,
      currency: record.currency,
    }));
}