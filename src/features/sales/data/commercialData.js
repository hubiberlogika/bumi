import { accountCodeSeedRecords, getAccountCodeOptions } from "@/features/finance/data/accountCodeData";

export const quotationStats = [
  { label: "Quotation Aktif", value: "18", change: "5 perlu follow-up" },
  { label: "Waiting Approval", value: "4", change: "1 di atas threshold" },
  { label: "Customer Approved", value: "9", change: "6 siap convert" },
];

export const QUOTATION_STORAGE_KEY = "bumi.quotations.records";

const defaultAccountOptions = getAccountCodeOptions(accountCodeSeedRecords);

export function formatFinancialNumberInput(value) {
  const sanitizedValue = String(value || "")
    .replace(/,/g, "")
    .replace(/[^\d.]/g, "")
    .replace(/(\..*)\./g, "$1");

  if (!sanitizedValue) return "";

  const [integerPart, decimalPart] = sanitizedValue.split(".");
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (decimalPart !== undefined) {
    return `${formattedIntegerPart}.${decimalPart}`;
  }

  return formattedIntegerPart;
}

function createQuotationLineItem(overrides = {}, accountOptions = defaultAccountOptions) {
  const fallbackAccount = accountOptions[0] || defaultAccountOptions[0];

  return {
    id: overrides.id || `line-${Math.random().toString(36).slice(2, 9)}`,
    accountCode: overrides.accountCode || fallbackAccount.accountCode,
    accountName: overrides.accountName || fallbackAccount.accountName,
    description: overrides.description || "",
    quantity: overrides.quantity || "1",
    unitPrice: formatFinancialNumberInput(overrides.unitPrice || ""),
    currency: overrides.currency || "IDR",
    exchangeRate: formatFinancialNumberInput(overrides.exchangeRate || "1.0000"),
  };
}

export const quotationFormDefaults = {
  quotationTitle: "",
  quotationNumber: "Auto generate saat disimpan",
  customer: "",
  route: "",
  validUntil: "",
  sales: "",
  status: "Draft",
  mode: "Darat",
  cargo: "",
  itemLines: [createQuotationLineItem({}, defaultAccountOptions)],
};

function getStatusColor(status) {
  if (status === "In Operation") return "blue";
  if (status === "Customer Approved") return "green";
  if (status === "Waiting Approval") return "yellow";
  if (status === "Sent") return "blue";
  return "slate";
}

function getNextStep(status) {
  if (status === "In Operation") {
    return "Sudah diteruskan ke Operations untuk proses shipment dan monitoring eksekusi.";
  }

  if (status === "Customer Approved") {
    return "Siap diteruskan ke Operations untuk shipment dan Finance untuk billing planning.";
  }

  if (status === "Waiting Approval") {
    return "Menunggu approval internal sebelum dikirim ke customer.";
  }

  if (status === "Sent") {
    return "Menunggu respons customer untuk revisi atau approval.";
  }

  return "Lengkapi detail commercial lalu kirim quotation ke customer.";
}

function formatSellingAmount(currency, amount) {
  if (!amount) return "-";
  return `${currency} ${amount}`;
}

function parseNumericValue(value) {
  const numericValue = Number(String(value || "0").replace(/,/g, ""));
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function formatNumberDisplay(value) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function getNormalizedItemLines(itemLines = [], accountOptions = defaultAccountOptions) {
  const fallbackAccount = accountOptions[0] || defaultAccountOptions[0];
  const baseItems = itemLines.length > 0 ? itemLines : [createQuotationLineItem({}, accountOptions)];

  return baseItems.map((itemLine) => {
    const account = accountOptions.find((option) => option.accountCode === itemLine.accountCode);

    return {
      ...createQuotationLineItem({}, accountOptions),
      ...itemLine,
      accountCode: itemLine.accountCode || account?.accountCode || fallbackAccount.accountCode,
      accountName: itemLine.accountName || account?.accountName || fallbackAccount.accountName,
    };
  });
}

function getLineTotal(itemLine) {
  return parseNumericValue(itemLine.quantity) * parseNumericValue(itemLine.unitPrice);
}

function getSellingSummary(itemLines) {
  const totalsByCurrency = itemLines.reduce((currencyMap, itemLine) => {
    const currency = itemLine.currency || "IDR";
    const currentAmount = currencyMap.get(currency) || 0;

    currencyMap.set(currency, currentAmount + getLineTotal(itemLine));
    return currencyMap;
  }, new Map());

  return Array.from(totalsByCurrency.entries())
    .map(([currency, total]) => formatSellingAmount(currency, formatNumberDisplay(total)))
    .join(" + ");
}

function getAccountCodeSummary(itemLines) {
  const accountCodes = [...new Set(itemLines.map((itemLine) => itemLine.accountCode).filter(Boolean))];

  if (accountCodes.length === 0) return "-";
  if (accountCodes.length === 1) return accountCodes[0];
  return `${accountCodes[0]} +${accountCodes.length - 1}`;
}

function getItemLabelSummary(itemLines) {
  if (itemLines.length === 0) return "-";
  if (itemLines.length === 1) return itemLines[0].description || itemLines[0].accountName || "1 item";
  return `${itemLines[0].description || itemLines[0].accountName || "1 item"} +${itemLines.length - 1} item`;
}

function getRateSummary(itemLines) {
  const distinctRates = [...new Set(itemLines.map((itemLine) => itemLine.exchangeRate || "1.0000"))];

  if (distinctRates.length === 1) return distinctRates[0];
  return `${distinctRates[0]} +${distinctRates.length - 1} rate`;
}

function createQuotationNumber(existingRecords = []) {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear());
  const prefix = `BMI/`;
  const matchingRecords = existingRecords.filter((record) => {
    const quotationNumber = record.quotationNumber || record.title || "";
    const segments = quotationNumber.split("/");

    return segments.length === 4 && segments[0] === "BMI" && segments[2] === month && segments[3] === year;
  });

  const nextCounter = String(matchingRecords.length + 1).padStart(3, "0");

  return `${prefix}${nextCounter}/${month}/${year}`;
}

function createQuotationRecord(formData, quotationNumber, accountOptions = defaultAccountOptions) {
  const normalizedItems = getNormalizedItemLines(formData.itemLines, accountOptions);
  const quotationTitle = formData.quotationTitle || getItemLabelSummary(normalizedItems) || "Quotation Baru";
  const customerName = formData.customer || "Customer baru";
  const sellingAmount = getSellingSummary(normalizedItems);

  return {
    id: quotationNumber,
    title: quotationTitle,
    subtitle: customerName,
    quotationNumber,
    quotationTitle,
    status: formData.status,
    statusColor: getStatusColor(formData.status),
    itemLines: normalizedItems,
    rowCells: [getItemLabelSummary(normalizedItems), formData.route || "-", getAccountCodeSummary(normalizedItems), sellingAmount || "-", formData.validUntil || "-"],
    details: [
      { label: "Quotation Number", value: quotationNumber },
      { label: "Customer", value: customerName },
      { label: "Items", value: `${normalizedItems.length} line item` },
      { label: "Account Ref", value: getAccountCodeSummary(normalizedItems) },
      { label: "Route", value: formData.route || "-" },
      { label: "Selling", value: sellingAmount },
      { label: "Rate", value: getRateSummary(normalizedItems) },
      { label: "Valid Until", value: formData.validUntil || "-" },
      { label: "Sales", value: formData.sales || "-" },
    ],
    summary: {
      mode: formData.mode || "-",
      cargo: formData.cargo || getItemLabelSummary(normalizedItems),
      customer: customerName,
      itemDescription: getItemLabelSummary(normalizedItems),
      currency: normalizedItems[0]?.currency || "IDR",
      exchangeRate: getRateSummary(normalizedItems),
      nextStep: getNextStep(formData.status),
    },
  };
}

export function createQuotationRecordFromForm(formData, existingRecords = [], accountOptions = defaultAccountOptions) {
  return createQuotationRecord(formData, createQuotationNumber(existingRecords), accountOptions);
}

export function updateQuotationRecordFromForm(record, formData, accountOptions = defaultAccountOptions) {
  return createQuotationRecord(formData, record.quotationNumber || record.id, accountOptions);
}

export function markQuotationInOperation(record) {
  return {
    ...record,
    status: "In Operation",
    statusColor: getStatusColor("In Operation"),
    summary: {
      ...record.summary,
      nextStep: getNextStep("In Operation"),
    },
  };
}

export const quotationRecords = [
  {
    id: "QUO-2605-021",
    title: "FCL Consumer Goods Balikpapan",
    subtitle: "PT Sumber Lintas Nusantara",
    quotationNumber: "BMI/001/05/2026",
    quotationTitle: "FCL Consumer Goods Balikpapan",
    status: "Waiting Approval",
    statusColor: "yellow",
    itemLines: [
      createQuotationLineItem({
        id: "line-bmi-001-1",
        accountCode: "4110-002",
        accountName: "Revenue Freight Laut",
        description: "Ocean Freight 1x20 FT",
        quantity: "1",
        unitPrice: "42000000",
        currency: "IDR",
        exchangeRate: "1.0000",
      }),
      createQuotationLineItem({
        id: "line-bmi-001-2",
        accountCode: "4120-001",
        accountName: "Revenue Handling & THC",
        description: "THC dan handling origin",
        quantity: "1",
        unitPrice: "6500000",
        currency: "IDR",
        exchangeRate: "1.0000",
      }),
    ],
    rowCells: ["Ocean Freight 1x20 FT +1 item", "Jakarta -> Balikpapan", "4110-002 +1", "IDR 48,500,000", "22 Mei 2026"],
    details: [
      { label: "Quotation Number", value: "BMI/001/05/2026" },
      { label: "Customer", value: "PT Sumber Lintas Nusantara" },
      { label: "Items", value: "2 line item" },
      { label: "Account Ref", value: "4110-002 +1" },
      { label: "Route", value: "Jakarta -> Balikpapan" },
      { label: "Selling", value: "IDR 48.500.000" },
      { label: "Rate", value: "1.0000" },
      { label: "Valid Until", value: "22 Mei 2026" },
      { label: "Sales", value: "Rina" },
    ],
    summary: {
      mode: "Laut",
      cargo: "1x20 FT - consumer goods",
      customer: "PT Sumber Lintas Nusantara",
      itemDescription: "Ocean Freight 1x20 FT +1 item",
      currency: "IDR",
      exchangeRate: "1.0000",
      nextStep: "Manager approval sebelum diteruskan ke booking vendor.",
    },
  },
  {
    id: "QUO-2605-018",
    title: "FTL Material Project Banjarmasin",
    subtitle: "PT Delta Samudra Kargo",
    quotationNumber: "BMI/002/05/2026",
    quotationTitle: "FTL Material Project Banjarmasin",
    status: "Sent",
    statusColor: "blue",
    itemLines: [
      createQuotationLineItem({
        id: "line-bmi-002-1",
        accountCode: "4110-001",
        accountName: "Revenue Freight Darat",
        description: "FTL trucking project cargo",
        quantity: "1",
        unitPrice: "28000000",
        currency: "IDR",
        exchangeRate: "1.0000",
      }),
      createQuotationLineItem({
        id: "line-bmi-002-2",
        accountCode: "4120-003",
        accountName: "Revenue Documentation Fee",
        description: "Admin surat jalan dan dokumen proyek",
        quantity: "1",
        unitPrice: "3200000",
        currency: "IDR",
        exchangeRate: "1.0000",
      }),
    ],
    rowCells: ["FTL trucking project cargo +1 item", "Surabaya -> Banjarmasin", "4110-001 +1", "IDR 31,200,000", "21 Mei 2026"],
    details: [
      { label: "Quotation Number", value: "BMI/002/05/2026" },
      { label: "Customer", value: "PT Delta Samudra Kargo" },
      { label: "Items", value: "2 line item" },
      { label: "Account Ref", value: "4110-001 +1" },
      { label: "Route", value: "Surabaya -> Banjarmasin" },
      { label: "Selling", value: "IDR 31.200.000" },
      { label: "Rate", value: "1.0000" },
      { label: "Valid Until", value: "21 Mei 2026" },
      { label: "Sales", value: "Fikri" },
    ],
    summary: {
      mode: "Darat",
      cargo: "FTL - bahan bangunan proyek",
      customer: "PT Delta Samudra Kargo",
      itemDescription: "FTL trucking project cargo +1 item",
      currency: "IDR",
      exchangeRate: "1.0000",
      nextStep: "Menunggu konfirmasi customer untuk konversi ke shipment.",
    },
  },
  {
    id: "QUO-2605-011",
    title: "Air Express Cargo Jayapura",
    subtitle: "CV Aero Distribusi Timur",
    quotationNumber: "BMI/003/05/2026",
    quotationTitle: "Air Express Cargo Jayapura",
    status: "Customer Approved",
    statusColor: "green",
    itemLines: [
      createQuotationLineItem({
        id: "line-bmi-003-1",
        accountCode: "4110-003",
        accountName: "Revenue Freight Udara",
        description: "Air freight express cargo 340 kg",
        quantity: "1",
        unitPrice: "2800",
        currency: "USD",
        exchangeRate: "16,250.0000",
      }),
      createQuotationLineItem({
        id: "line-bmi-003-2",
        accountCode: "4120-003",
        accountName: "Revenue Documentation Fee",
        description: "Airway bill dan admin dokumentasi",
        quantity: "1",
        unitPrice: "450",
        currency: "USD",
        exchangeRate: "16,250.0000",
      }),
    ],
    rowCells: ["Air freight express cargo 340 kg +1 item", "Jakarta -> Jayapura", "4110-003 +1", "USD 3,250", "20 Mei 2026"],
    details: [
      { label: "Quotation Number", value: "BMI/003/05/2026" },
      { label: "Customer", value: "CV Aero Distribusi Timur" },
      { label: "Items", value: "2 line item" },
      { label: "Account Ref", value: "4110-003 +1" },
      { label: "Route", value: "Jakarta -> Jayapura" },
      { label: "Selling", value: "USD 3,250" },
      { label: "Rate", value: "16,250.0000" },
      { label: "Valid Until", value: "20 Mei 2026" },
      { label: "Sales", value: "Mira" },
    ],
    summary: {
      mode: "Udara",
      cargo: "Express cargo 340 kg",
      customer: "CV Aero Distribusi Timur",
      itemDescription: "Air freight express cargo 340 kg +1 item",
      currency: "USD",
      exchangeRate: "16,250.0000",
      nextStep: "Siap diteruskan ke Operations untuk shipment dan Finance untuk billing planning.",
    },
  },
];
