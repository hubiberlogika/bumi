"use client";

import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MobileDataCard from "@/components/ui/MobileDataCard";
import { ACCOUNT_CODE_STORAGE_KEY, accountCodeSeedRecords, getAccountCodeOptions } from "@/features/finance/data/accountCodeData";
import { PARTNER_STORAGE_KEY, partnerRecords } from "@/features/master-data/data/partnerData";
import { SHIPMENT_STORAGE_KEY, convertQuotationRecordToShipment } from "@/features/operations/data/shipmentData";
import {
  createQuotationRecordFromForm,
  formatFinancialNumberInput,
  markQuotationInOperation,
  parseFinancialNumberInput,
  QUOTATION_STORAGE_KEY,
  quotationFormDefaults,
  updateQuotationRecordFromForm,
} from "@/features/sales/data/commercialData";

const CREATE_ROW_ID = "__create_quotation__";

function getDetailValue(record, label) {
  return record.details.find((detail) => detail.label === label)?.value || "";
}

function getFormDataFromRecord(record, accountOptions) {
  const fallbackAccount = accountOptions[0];

  return {
    quotationTitle: record.quotationTitle || record.title,
    quotationNumber: record.quotationNumber || record.id,
    customer: record.subtitle,
    route: getDetailValue(record, "Route"),
    validUntil: getDetailValue(record, "Valid Until"),
    sales: getDetailValue(record, "Sales"),
    status: record.status,
    mode: record.summary?.mode || "Darat",
    cargo: record.summary?.cargo || "",
    itemLines: record.itemLines?.length
      ? record.itemLines.map((itemLine) => ({
          ...itemLine,
          unitPrice: formatFinancialNumberInput(itemLine.unitPrice),
          exchangeRate: formatFinancialNumberInput(itemLine.exchangeRate),
        }))
      : [
          {
            id: `line-${record.id}`,
            accountCode: fallbackAccount.accountCode,
            accountName: fallbackAccount.accountName,
            description: record.summary?.itemDescription || "",
            quantity: "1",
            unitPrice: formatFinancialNumberInput(getDetailValue(record, "Selling").replace(/^IDR\s|^USD\s/, "")),
            currency: record.summary?.currency || "IDR",
            exchangeRate: formatFinancialNumberInput(record.summary?.exchangeRate || "1.0000"),
          },
        ],
  };
}

function getLineTotal(itemLine) {
  return parseFinancialNumberInput(itemLine.quantity) * parseFinancialNumberInput(itemLine.unitPrice);
}

function formatLineTotal(itemLine) {
  const lineTotal = getLineTotal(itemLine);

  return `${itemLine.currency || "IDR"} ${new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(lineTotal)}`;
}

function usesExchangeRate(itemLine) {
  return (itemLine.currency || "IDR") !== "IDR";
}

function createEmptyLineItem() {
  const fallbackAccount = getAccountCodeOptions(accountCodeSeedRecords)[0];

  return {
    id: `line-${Math.random().toString(36).slice(2, 9)}`,
    accountCode: fallbackAccount.accountCode,
    accountName: fallbackAccount.accountName,
    description: "",
    quantity: "1",
    unitPrice: "",
    currency: "IDR",
    exchangeRate: formatFinancialNumberInput("1.0000"),
  };
}

function readStoredShipments() {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(SHIPMENT_STORAGE_KEY);

    return storedValue ? JSON.parse(storedValue) : [];
  } catch {
    return [];
  }
}

export default function QuotationWorkspace({
  eyebrow,
  title,
  description,
  records,
  columns,
  actionHref,
  actionLabel,
}) {
  const router = useRouter();
  const [quotationList, setQuotationList] = useState(() => {
    if (typeof window === "undefined") return records;

    const storedValue = window.localStorage.getItem(QUOTATION_STORAGE_KEY);
    if (!storedValue) return records;

    try {
      return JSON.parse(storedValue);
    } catch {
      return records;
    }
  });
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [activeRowId, setActiveRowId] = useState(null);
  const [formData, setFormData] = useState(quotationFormDefaults);
  const [convertedQuotationIds, setConvertedQuotationIds] = useState(() => new Set(readStoredShipments().map((shipment) => shipment.sourceQuotationId)));
  const [accountOptions] = useState(() => {
    const mergedRecords = typeof window === "undefined"
      ? accountCodeSeedRecords
      : (() => {
          try {
            const storedValue = window.localStorage.getItem(ACCOUNT_CODE_STORAGE_KEY);
            const storedRecords = storedValue ? JSON.parse(storedValue) : [];

            return [...storedRecords, ...accountCodeSeedRecords];
          } catch {
            return accountCodeSeedRecords;
          }
        })();

    const uniqueRecords = mergedRecords.filter(
      (record, index) => mergedRecords.findIndex((candidate) => candidate.accountCode === record.accountCode) === index
    );

    return getAccountCodeOptions(uniqueRecords);
  });
  const [customerOptions] = useState(() => {
    const mergedRecords = typeof window === "undefined"
      ? partnerRecords
      : [...JSON.parse(window.localStorage.getItem(PARTNER_STORAGE_KEY) || "[]"), ...partnerRecords];

    return mergedRecords
      .filter((record) => Array.isArray(record.roles) && record.roles.includes("Customer"))
      .reduce((uniqueCustomers, record) => {
        if (uniqueCustomers.some((customer) => customer.partnerName === record.partnerName)) {
          return uniqueCustomers;
        }

        return [
          ...uniqueCustomers,
          {
            partnerName: record.partnerName,
            partnerCode: record.partnerCode,
            paymentTerms: record.paymentTerms,
          },
        ];
      }, [])
      .sort((left, right) => left.partnerName.localeCompare(right.partnerName));
  });

  const stats = useMemo(() => {
    const activeCount = quotationList.length;
    const waitingApproval = quotationList.filter((record) => record.status === "Waiting Approval").length;
    const approvedCount = quotationList.filter((record) => record.status === "Customer Approved").length;

    return [
      { label: "Quotation Aktif", value: String(activeCount), change: `${Math.max(activeCount - approvedCount, 0)} perlu follow-up` },
      { label: "Waiting Approval", value: String(waitingApproval), change: `${waitingApproval} butuh review internal` },
      { label: "Customer Approved", value: String(approvedCount), change: `${approvedCount} siap convert ke shipment` },
    ];
  }, [quotationList]);
  const isCreateMode = activeRowId === CREATE_ROW_ID;
  const isEditMode = activeRowId !== null && activeRowId !== CREATE_ROW_ID;
  const isEditorMode = activeRowId !== null;

  const persistQuotationList = (nextList) => {
    setQuotationList(nextList);
    window.localStorage.setItem(QUOTATION_STORAGE_KEY, JSON.stringify(nextList));
  };

  const handleStartCreate = () => {
    setActiveRowId(CREATE_ROW_ID);
    setFormData({
      ...quotationFormDefaults,
      itemLines: [createEmptyLineItem()],
    });
    setFeedbackMessage("Isi detail quotation baru lalu simpan dari row editor.");
  };

  const handleOpenEditor = (record) => {
    setActiveRowId((currentId) => (currentId === record.id ? null : record.id));
    setFormData(getFormDataFromRecord(record, accountOptions));
  };

  const handleFormChange = (field, value) => {
    setFormData((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleLineItemChange = (lineId, field, value) => {
    setFormData((currentForm) => ({
      ...currentForm,
      itemLines: currentForm.itemLines.map((itemLine) => {
        if (itemLine.id !== lineId) return itemLine;

        if (field === "accountCode") {
          const selectedAccount = accountOptions.find((option) => option.accountCode === value);

          return {
            ...itemLine,
            accountCode: value,
            accountName: selectedAccount?.accountName || itemLine.accountName,
          };
        }

        if (field === "unitPrice" || field === "exchangeRate") {
          return {
            ...itemLine,
            [field]: formatFinancialNumberInput(value),
          };
        }

        return {
          ...itemLine,
          [field]: value,
        };
      }),
    }));
  };

  const handleAddLineItem = () => {
    setFormData((currentForm) => ({
      ...currentForm,
      itemLines: [...currentForm.itemLines, createEmptyLineItem()],
    }));
  };

  const handleRemoveLineItem = (lineId) => {
    setFormData((currentForm) => {
      if (currentForm.itemLines.length === 1) {
        return currentForm;
      }

      return {
        ...currentForm,
        itemLines: currentForm.itemLines.filter((itemLine) => itemLine.id !== lineId),
      };
    });
  };

  const handleCancelEdit = () => {
    setActiveRowId(null);
    setFormData({
      ...quotationFormDefaults,
      itemLines: [createEmptyLineItem()],
    });
    setFeedbackMessage("");
  };

  const handleSaveQuotation = () => {
    const hasInvalidLineItem = formData.itemLines.some(
      (itemLine) => !itemLine.accountCode || !itemLine.description || !itemLine.quantity || !itemLine.unitPrice || (usesExchangeRate(itemLine) && !itemLine.exchangeRate)
    );

    if (!formData.quotationTitle || !formData.customer || !formData.route || hasInvalidLineItem) {
      setFeedbackMessage("Judul quotation, customer, route, dan seluruh line item wajib lengkap dengan account code, deskripsi, qty, harga jual, dan rate untuk currency non-IDR.");
      return;
    }

    if (activeRowId === CREATE_ROW_ID) {
      const nextRecord = createQuotationRecordFromForm(formData, quotationList, accountOptions);
      const nextList = [nextRecord, ...quotationList];
      persistQuotationList(nextList);
      setActiveRowId(nextRecord.id);
      setFormData(getFormDataFromRecord(nextRecord, accountOptions));
      setFeedbackMessage(`${nextRecord.quotationNumber} berhasil dibuat.`);
      return;
    }

    const targetRecord = quotationList.find((record) => record.id === activeRowId);
    if (!targetRecord) return;

    const nextRecord = updateQuotationRecordFromForm(targetRecord, formData, accountOptions);
    const nextList = quotationList.map((record) => (record.id === targetRecord.id ? nextRecord : record));
    persistQuotationList(nextList);
    setFormData(getFormDataFromRecord(nextRecord, accountOptions));
    setFeedbackMessage(`${nextRecord.quotationNumber} berhasil diperbarui.`);
  };

  const handleConvert = (record) => {
    const existingShipments = readStoredShipments();

    if (existingShipments.some((shipment) => shipment.sourceQuotationId === record.id)) {
      setConvertedQuotationIds(new Set(existingShipments.map((shipment) => shipment.sourceQuotationId)));
      setFeedbackMessage(`${record.title} sudah pernah dikonversi ke shipment.`);
      return;
    }

    const nextShipment = convertQuotationRecordToShipment(record);
    const nextShipments = [nextShipment, ...existingShipments];
    window.localStorage.setItem(SHIPMENT_STORAGE_KEY, JSON.stringify(nextShipments));
    const nextQuotationList = quotationList.map((quotationRecord) => (
      quotationRecord.id === record.id ? markQuotationInOperation(quotationRecord) : quotationRecord
    ));
    persistQuotationList(nextQuotationList);
    if (activeRowId === record.id) {
      setFormData((currentForm) => ({
        ...currentForm,
        status: "In Operation",
      }));
    }
    setConvertedQuotationIds(new Set(nextShipments.map((shipment) => shipment.sourceQuotationId)));
    setFeedbackMessage(`${record.title} berhasil dikonversi menjadi ${nextShipment.title} dan status quotation dipindahkan ke In Operation.`);
    setTimeout(() => router.push('/ops/shipments'), 1000);
  };

  const totalColumns = columns.length + 3;

  const renderEditor = () => (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Judul Quotation</span>
          <input
            type="text"
            value={formData.quotationTitle}
            onChange={(event) => handleFormChange("quotationTitle", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-500"
            placeholder="Contoh: Air Express Cargo Jayapura"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Nomor Quotation</span>
          <input
            type="text"
            value={activeRowId === CREATE_ROW_ID ? "BMI/Auto/mm/yyyy" : formData.quotationNumber}
            readOnly
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Customer</span>
          <select
            value={formData.customer}
            onChange={(event) => handleFormChange("customer", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary-500"
          >
            <option value="">Pilih customer dari Mitra</option>
            {customerOptions.map((customer) => (
              <option key={customer.partnerCode} value={customer.partnerName}>
                {customer.partnerName}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Route</span>
          <input
            type="text"
            value={formData.route}
            onChange={(event) => handleFormChange("route", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-500"
            placeholder="Jakarta -> Surabaya"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Valid Until</span>
          <input
            type="text"
            value={formData.validUntil}
            onChange={(event) => handleFormChange("validUntil", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-500"
            placeholder="30 Mei 2026"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Sales</span>
          <input
            type="text"
            value={formData.sales}
            onChange={(event) => handleFormChange("sales", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-500"
            placeholder="Nama PIC sales"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Status</span>
          <select
            value={formData.status}
            onChange={(event) => handleFormChange("status", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary-500"
          >
            <option value="Draft">Draft</option>
            <option value="Waiting Approval">Waiting Approval</option>
            <option value="Sent">Sent</option>
            <option value="Customer Approved">Customer Approved</option>
            <option value="In Operation">In Operation</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Mode</span>
          <select
            value={formData.mode}
            onChange={(event) => handleFormChange("mode", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary-500"
          >
            <option value="Darat">Darat</option>
            <option value="Laut">Laut</option>
            <option value="Udara">Udara</option>
          </select>
        </label>

        <label className="space-y-2 xl:col-span-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Cargo</span>
          <input
            type="text"
            value={formData.cargo}
            onChange={(event) => handleFormChange("cargo", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-500"
            placeholder="Deskripsi ringkas cargo"
          />
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Detail Item Quotation</h3>
            <p className="mt-1 text-sm text-slate-400">Setiap line wajib memiliki account code agar revenue mapping di finance tetap terkontrol sesuai aturan perusahaan.</p>
          </div>
          <button
            type="button"
            onClick={handleAddLineItem}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Tambah Item
          </button>
        </div>

        <div className="mt-4 hidden overflow-hidden xl:block">
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[14%]" />
              <col className="w-[20%]" />
              <col className="w-[26%]" />
              <col className="w-[8%]" />
              <col className="w-[12%]" />
              <col className="w-[10%]" />
              <col className="w-[10%]" />
              <col className="w-[8%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                <th className="px-3 py-3 font-medium">Account Code</th>
                <th className="px-3 py-3 font-medium">Account Name</th>
                <th className="px-3 py-3 font-medium">Description</th>
                <th className="px-3 py-3 font-medium">Qty</th>
                <th className="px-3 py-3 font-medium">Unit Price</th>
                <th className="px-3 py-3 font-medium">Curr</th>
                <th className="px-3 py-3 font-medium">Line Total</th>
                <th className="px-3 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.itemLines.map((itemLine) => (
                <tr key={itemLine.id} className="border-b border-white/5 align-top text-sm text-slate-200 last:border-b-0">
                  <td className="px-3 py-3">
                    <select
                      value={itemLine.accountCode}
                      onChange={(event) => handleLineItemChange(itemLine.id, "accountCode", event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-primary-500"
                    >
                      {accountOptions.map((accountOption) => (
                        <option key={accountOption.accountCode} value={accountOption.accountCode}>
                          {accountOption.accountCode}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3 text-slate-300">{itemLine.accountName}</td>
                  <td className="px-3 py-3">
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={itemLine.description}
                        onChange={(event) => handleLineItemChange(itemLine.id, "description", event.target.value)}
                        className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-500"
                        placeholder="Deskripsi item"
                      />
                      {usesExchangeRate(itemLine) ? (
                        <div className="flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                          <span className="font-medium">Applied Rate</span>
                          <input
                            type="text"
                            value={itemLine.exchangeRate}
                            onChange={(event) => handleLineItemChange(itemLine.id, "exchangeRate", event.target.value)}
                            className="min-w-0 flex-1 rounded-lg border border-amber-300/20 bg-black/10 px-2 py-1 text-xs text-white outline-none transition-colors focus:border-amber-300"
                            placeholder="Rate kurs"
                          />
                        </div>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={itemLine.quantity}
                      onChange={(event) => handleLineItemChange(itemLine.id, "quantity", event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-500"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={formatFinancialNumberInput(itemLine.unitPrice)}
                      onChange={(event) => handleLineItemChange(itemLine.id, "unitPrice", event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-500"
                      placeholder="Harga jual"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="space-y-2">
                      <select
                        value={itemLine.currency}
                        onChange={(event) => handleLineItemChange(itemLine.id, "currency", event.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-primary-500"
                      >
                        <option value="IDR">IDR</option>
                        <option value="USD">USD</option>
                      </select>
                      <p className="text-xs text-slate-500">
                        {usesExchangeRate(itemLine) ? "Rate quotation ini akan dipakai sampai pencatatan finance." : "IDR tanpa kurs tambahan."}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-300">{formatLineTotal(itemLine)}</td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => handleRemoveLineItem(itemLine.id)}
                      disabled={formData.itemLines.length === 1}
                      className={`rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        formData.itemLines.length === 1
                          ? "cursor-not-allowed border border-white/10 bg-white/5 text-slate-500"
                          : "border border-rose-400/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
                      }`}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-4 xl:hidden">
          {formData.itemLines.map((itemLine, index) => (
            <div key={itemLine.id} className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">Item {index + 1}</p>
                <button
                  type="button"
                  onClick={() => handleRemoveLineItem(itemLine.id)}
                  disabled={formData.itemLines.length === 1}
                  className={`rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    formData.itemLines.length === 1
                      ? "cursor-not-allowed border border-white/10 bg-white/5 text-slate-500"
                      : "border border-rose-400/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
                  }`}
                >
                  Hapus
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Account Code</span>
                  <select
                    value={itemLine.accountCode}
                    onChange={(event) => handleLineItemChange(itemLine.id, "accountCode", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-primary-500"
                  >
                    {accountOptions.map((accountOption) => (
                      <option key={accountOption.accountCode} value={accountOption.accountCode}>
                        {accountOption.accountCode} - {accountOption.accountName}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Account Name</span>
                  <input
                    type="text"
                    readOnly
                    value={itemLine.accountName}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 outline-none"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Description</span>
                  <textarea
                    rows={2}
                    value={itemLine.description}
                    onChange={(event) => handleLineItemChange(itemLine.id, "description", event.target.value)}
                    className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-500"
                    placeholder="Deskripsi item"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Qty</span>
                  <input
                    type="text"
                    value={itemLine.quantity}
                    onChange={(event) => handleLineItemChange(itemLine.id, "quantity", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-primary-500"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Unit Price</span>
                  <input
                    type="text"
                      value={formatFinancialNumberInput(itemLine.unitPrice)}
                    onChange={(event) => handleLineItemChange(itemLine.id, "unitPrice", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-primary-500"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Currency</span>
                  <select
                    value={itemLine.currency}
                    onChange={(event) => handleLineItemChange(itemLine.id, "currency", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-primary-500"
                  >
                    <option value="IDR">IDR</option>
                    <option value="USD">USD</option>
                  </select>
                </label>

                {usesExchangeRate(itemLine) ? (
                  <label className="space-y-2">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Rate</span>
                    <input
                      type="text"
                      value={itemLine.exchangeRate}
                      onChange={(event) => handleLineItemChange(itemLine.id, "exchangeRate", event.target.value)}
                      className="w-full rounded-xl border border-amber-300/20 bg-amber-500/10 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-amber-300"
                    />
                  </label>
                ) : null}
              </div>

              <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-300">
                Line Total: <span className="font-medium text-white">{formatLineTotal(itemLine)}</span>
              </div>
              {usesExchangeRate(itemLine) ? (
                <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-3 text-sm text-amber-100">
                  Rate {itemLine.exchangeRate} akan menjadi acuan sampai pencatatan financial selesai.
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:justify-end">
        <button
          type="button"
          onClick={handleCancelEdit}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
        >
          Tutup Editor
        </button>
        <button
          type="button"
          onClick={handleSaveQuotation}
          className="rounded-2xl bg-primary-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-500"
        >
          Simpan Quotation
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary-300">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">{description}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleStartCreate}
              className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-500"
            >
              Create Quotation
            </button>
            <Link
              href="/finance/accounts"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Account Codes
            </Link>
            <Link
              href={actionHref}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              {actionLabel}
            </Link>
          </div>
        </div>
        {feedbackMessage ? (
          <div className="mt-4 rounded-2xl border border-primary-500/20 bg-primary-500/10 px-4 py-3 text-sm text-primary-100">
            {feedbackMessage}
          </div>
        ) : null}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-primary-300">{stat.change}</p>
          </div>
        ))}
      </section>

      <section className="glass-panel rounded-3xl p-4 md:p-5">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-1 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">{isCreateMode ? "Create Quotation" : isEditMode ? "Edit Quotation" : "List Quotation"}</h2>
            <p className="mt-1 text-sm text-slate-400">
              {isCreateMode
                ? "Mode create difokuskan ke editor quotation agar input line item dan account reference tidak bercampur dengan list data lama."
                : isEditMode
                  ? "Mode edit memfokuskan workspace ke satu quotation aktif agar perubahan detail, item, dan account reference tidak tertutup oleh list."
                  : "Klik baris quotation untuk membuka detail row editor. Quotation yang sudah customer approved bisa langsung dikonversi ke shipment."}
            </p>
          </div>
        </div>

        {isEditorMode ? <div className="mt-4">{renderEditor()}</div> : null}

        {!isEditorMode ? <div className="mt-4 hidden overflow-hidden lg:block">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                <th className="px-3 py-3 font-medium">Dokumen</th>
                {columns.map((column) => (
                  <th key={column} className="px-3 py-3 font-medium">{column}</th>
                ))}
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {quotationList.map((record) => {
                const isOpen = activeRowId === record.id;
                const isConverted = convertedQuotationIds.has(record.id);

                return (
                  <Fragment key={record.id}>
                    <tr
                      onClick={() => handleOpenEditor(record)}
                      className="cursor-pointer border-b border-white/5 text-sm text-slate-200 transition-colors last:border-b-0 hover:bg-white/[0.03]"
                    >
                      <td className="px-3 py-4">
                        <div className="font-medium text-white">{record.title}</div>
                        <div className="mt-1 text-xs text-slate-400">{record.quotationNumber || record.id}</div>
                        <div className="mt-1 text-xs text-primary-300">{record.subtitle}</div>
                      </td>
                      {record.rowCells.map((cell) => (
                        <td key={`${record.id}-${cell}`} className="px-3 py-4 text-slate-300">{cell}</td>
                      ))}
                      <td className="px-3 py-4">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white">
                          {record.status}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleConvert(record);
                          }}
                          disabled={isConverted}
                          className={`rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                            isConverted
                              ? "cursor-not-allowed border border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                              : "bg-primary-600 text-white hover:bg-primary-500"
                          }`}
                        >
                          {isConverted ? "Converted" : "Convert to Shipment"}
                        </button>
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div> : null}

        {!isEditorMode ? <div className="mt-4 grid grid-cols-1 gap-4 lg:hidden">
          {quotationList.map((record) => {
            const isConverted = convertedQuotationIds.has(record.id);

            return (
              <div key={record.id} className="space-y-3">
                <div onClick={() => handleOpenEditor(record)} className="cursor-pointer">
                  <MobileDataCard
                    title={record.title}
                    subtitle={`${record.quotationNumber || record.id} • ${record.subtitle}`}
                    status={record.status}
                    statusColor={record.statusColor}
                    details={record.details}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleConvert(record)}
                  disabled={isConverted}
                  className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isConverted
                      ? "cursor-not-allowed border border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                      : "bg-primary-600 text-white hover:bg-primary-500"
                  }`}
                >
                  {isConverted ? "Converted" : "Convert to Shipment"}
                </button>
              </div>
            );
          })}
        </div> : null}
      </section>
    </div>
  );
}