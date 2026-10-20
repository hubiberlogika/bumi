"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import MobileDataCard from "@/components/ui/MobileDataCard";
import {
  formatFinancialNumberInput,
  parseFinancialNumberInput,
  QUOTATION_STORAGE_KEY,
  quotationRecords,
} from "@/features/sales/data/commercialData";
import { SHIPMENT_STORAGE_KEY, shipmentSeedRecords } from "@/features/operations/data/shipmentData";

function formatAmount(currency, value) {
  return `${currency} ${new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)}`;
}

function usesExchangeRate(itemLine) {
  return (itemLine.currency || "IDR") !== "IDR";
}

function getDraftSellingSummary(itemLines) {
  const totalsByCurrency = itemLines.reduce((currencyMap, itemLine) => {
    const currency = itemLine.currency || "IDR";
    const lineTotal = parseFinancialNumberInput(itemLine.quantity) * parseFinancialNumberInput(itemLine.unitPrice);
    const currentAmount = currencyMap.get(currency) || 0;

    currencyMap.set(currency, currentAmount + lineTotal);
    return currencyMap;
  }, new Map());

  return Array.from(totalsByCurrency.entries())
    .map(([currency, total]) => formatAmount(currency, total))
    .join(" + ");
}

function getAccountRefSummary(itemLines) {
  const accountCodes = [...new Set(itemLines.map((itemLine) => itemLine.accountCode).filter(Boolean))];

  if (accountCodes.length === 0) return "-";
  if (accountCodes.length === 1) return accountCodes[0];
  return `${accountCodes[0]} +${accountCodes.length - 1}`;
}

function getStoredRecords(storageKey, fallbackValue) {
  if (typeof window === "undefined") return fallbackValue;

  const storedValue = window.localStorage.getItem(storageKey);
  if (!storedValue) return fallbackValue;

  try {
    return JSON.parse(storedValue);
  } catch {
    return fallbackValue;
  }
}

function createInvoiceCandidates(records, quotationList) {
  return records.map((record, index) => {
    const reference = record.details.find((detail) => detail.label === "Reference")?.value || record.quotationNumber || "-";
    const route = record.details.find((detail) => detail.label === "Route")?.value || "-";
    const linkedQuotation = quotationList.find(
      (quotation) => quotation.id === record.sourceQuotationId || quotation.quotationNumber === reference
    );
    const draftLines = record.itemLines?.length ? record.itemLines : linkedQuotation?.itemLines || [];

    return {
      id: `INV-PLAN-${index + 1}`,
      title: `INV-PLAN-${index + 1}`,
      subtitle: record.subtitle,
      reference,
      route,
      shipmentTitle: record.title,
      draftLines,
      accountRef: getAccountRefSummary(draftLines),
      sellingSummary: draftLines.length > 0 ? getDraftSellingSummary(draftLines) : "-",
      status: record.sourceQuotationId ? "Ready to Bill" : "Operational Seed",
      statusColor: record.sourceQuotationId ? "green" : "blue",
      details: [
        { label: "Shipment", value: record.title },
        { label: "Reference", value: reference },
        { label: "Route", value: route },
        { label: "Account Ref", value: getAccountRefSummary(draftLines) },
        { label: "Draft Value", value: draftLines.length > 0 ? getDraftSellingSummary(draftLines) : "-" },
        ...(draftLines.some(usesExchangeRate)
          ? [{ label: "Applied Rate", value: [...new Set(draftLines.filter(usesExchangeRate).map((itemLine) => itemLine.exchangeRate))].join(", ") }]
          : []),
      ],
    };
  });
}

export default function InvoiceBoard() {
  const [convertedShipments] = useState(() => getStoredRecords(SHIPMENT_STORAGE_KEY, []));
  const [quotationList] = useState(() => getStoredRecords(QUOTATION_STORAGE_KEY, quotationRecords));
  const [activeInvoiceId, setActiveInvoiceId] = useState(null);

  const invoiceCandidates = useMemo(
    () => createInvoiceCandidates([...convertedShipments, ...shipmentSeedRecords], quotationList),
    [convertedShipments, quotationList]
  );
  const readyToBillCount = invoiceCandidates.filter((item) => item.status === "Ready to Bill").length;
  const totalDraftLines = invoiceCandidates.reduce((total, record) => total + record.draftLines.length, 0);
  const distinctAccountRefs = new Set(
    invoiceCandidates.flatMap((record) => record.draftLines.map((itemLine) => itemLine.accountCode).filter(Boolean))
  ).size;

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary-300">Finance</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">Invoices</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
              Finance sekarang menerima referensi dari shipment, termasuk shipment yang berasal dari conversion quotation.
              Board ini menampilkan draft invoice yang menurunkan line items quotation beserta account code revenue per item.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/finance/accounts"
              className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-500"
            >
              Master Account Codes
            </Link>
            <Link
              href="/ops/shipments"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Lihat Shipments
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm font-medium text-slate-400">Ready to Bill</p>
          <p className="mt-2 text-3xl font-semibold text-white">{readyToBillCount}</p>
          <p className="mt-2 text-sm text-primary-300">Shipment hasil conversion dengan draft invoice siap review</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm font-medium text-slate-400">Draft Lines</p>
          <p className="mt-2 text-3xl font-semibold text-white">{totalDraftLines}</p>
          <p className="mt-2 text-sm text-primary-300">Line items quotation yang sudah turun ke invoice draft</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm font-medium text-slate-400">Revenue Accounts</p>
          <p className="mt-2 text-3xl font-semibold text-white">{distinctAccountRefs}</p>
          <p className="mt-2 text-sm text-primary-300">Distinct account code yang sedang dipakai draft invoice</p>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 md:p-5">
        <div className="border-b border-white/10 px-1 pb-4">
          <h2 className="text-lg font-semibold text-white">Invoice Draft Readiness</h2>
          <p className="mt-1 text-sm text-slate-400">Klik row untuk melihat draft line items yang sudah membawa account code dari quotation.</p>
        </div>

        <div className="mt-4 hidden overflow-hidden lg:block">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                <th className="px-3 py-3 font-medium">Invoice Plan</th>
                <th className="px-3 py-3 font-medium">Reference</th>
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Account Ref</th>
                <th className="px-3 py-3 font-medium">Draft Value</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoiceCandidates.map((record) => {
                const isOpen = activeInvoiceId === record.id;

                return (
                  <Fragment key={record.id}>
                    <tr
                      onClick={() => setActiveInvoiceId((currentId) => (currentId === record.id ? null : record.id))}
                      className={`border-b border-white/5 text-sm text-slate-200 transition-colors last:border-b-0 ${
                        isOpen ? "bg-white/5" : "cursor-pointer hover:bg-white/[0.03]"
                      }`}
                    >
                      <td className="px-3 py-4">
                        <div className="font-medium text-white">{record.title}</div>
                        <div className="mt-1 text-xs text-slate-400">{record.shipmentTitle}</div>
                      </td>
                      <td className="px-3 py-4 text-slate-300">{record.reference}</td>
                      <td className="px-3 py-4 text-slate-300">{record.subtitle}</td>
                      <td className="px-3 py-4 text-slate-300">{record.accountRef}</td>
                      <td className="px-3 py-4 text-slate-300">{record.sellingSummary}</td>
                      <td className="px-3 py-4">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white">
                          {record.status}
                        </span>
                      </td>
                    </tr>
                    {isOpen ? (
                      <tr className="border-b border-white/5 bg-white/[0.03]">
                        <td colSpan={6} className="px-3 py-4">
                          <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                            <div className="flex flex-col gap-2 border-b border-white/10 pb-4 md:flex-row md:items-end md:justify-between">
                              <div>
                                <h3 className="text-sm font-semibold text-white">Draft Invoice Lines</h3>
                                <p className="mt-1 text-sm text-slate-400">Reference {record.reference} • Route {record.route}</p>
                              </div>
                              <div className="text-sm text-slate-300">Total draft: <span className="font-medium text-white">{record.sellingSummary}</span></div>
                            </div>

                            {record.draftLines.length > 0 ? (
                              <div className="mt-4 overflow-hidden">
                                <table className="w-full table-fixed">
                                  <colgroup>
                                    <col className="w-[16%]" />
                                    <col className="w-[20%]" />
                                    <col className="w-[28%]" />
                                    <col className="w-[8%]" />
                                    <col className="w-[14%]" />
                                    <col className="w-[14%]" />
                                  </colgroup>
                                  <thead>
                                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                                      <th className="px-3 py-3 font-medium">Account Code</th>
                                      <th className="px-3 py-3 font-medium">Account Name</th>
                                      <th className="px-3 py-3 font-medium">Description</th>
                                      <th className="px-3 py-3 font-medium">Qty</th>
                                      <th className="px-3 py-3 font-medium">Unit Price</th>
                                      <th className="px-3 py-3 font-medium">Currency</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {record.draftLines.map((itemLine) => (
                                      <tr key={`${record.id}-${itemLine.id}`} className="border-b border-white/5 text-sm text-slate-200 last:border-b-0">
                                        <td className="px-3 py-3 text-slate-300">{itemLine.accountCode}</td>
                                        <td className="px-3 py-3 text-slate-300">{itemLine.accountName}</td>
                                        <td className="px-3 py-3 text-slate-300">
                                          <div className="whitespace-pre-line break-words">{itemLine.description}</div>
                                          {usesExchangeRate(itemLine) ? (
                                            <div className="mt-2 inline-flex rounded-full border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-100">
                                              Applied Rate {formatFinancialNumberInput(itemLine.exchangeRate)}
                                            </div>
                                          ) : null}
                                        </td>
                                        <td className="px-3 py-3 text-slate-300">{itemLine.quantity}</td>
                                        <td className="px-3 py-3 text-slate-300">{formatFinancialNumberInput(itemLine.unitPrice)}</td>
                                        <td className="px-3 py-3 text-slate-300">
                                          <div>{itemLine.currency}</div>
                                          <div className="mt-1 text-xs text-slate-500">
                                            {usesExchangeRate(itemLine) ? "Rate locked from quotation" : "IDR base currency"}
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                                Shipment seed belum memiliki line items quotation untuk dibentuk menjadi draft invoice.
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:hidden">
          {invoiceCandidates.map((record) => (
            <MobileDataCard
              key={record.id}
              title={record.title}
              subtitle={`${record.reference} • ${record.subtitle}`}
              status={record.status}
              statusColor={record.statusColor}
              details={record.details}
            />
          ))}
        </div>
      </section>
    </div>
  );
}