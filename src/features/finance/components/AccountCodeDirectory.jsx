"use client";

import { useMemo, useState } from "react";
import MobileDataCard from "@/components/ui/MobileDataCard";
import {
  ACCOUNT_CODE_STORAGE_KEY,
  accountCodeFormDefaults,
  accountCodeSeedRecords,
  createAccountCodeRecordFromForm,
} from "@/features/finance/data/accountCodeData";

export default function AccountCodeDirectory() {
  const [accountCodeList, setAccountCodeList] = useState(() => {
    if (typeof window === "undefined") return accountCodeSeedRecords;

    const storedValue = window.localStorage.getItem(ACCOUNT_CODE_STORAGE_KEY);
    if (!storedValue) return accountCodeSeedRecords;

    try {
      return [...JSON.parse(storedValue), ...accountCodeSeedRecords];
    } catch {
      return accountCodeSeedRecords;
    }
  });
  const [formData, setFormData] = useState(accountCodeFormDefaults);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const stats = useMemo(() => {
    const totalCodes = accountCodeList.length;
    const revenueCodes = accountCodeList.filter((record) => record.category === "Revenue").length;
    const ancillaryCodes = accountCodeList.filter((record) => record.group === "Ancillary").length;

    return [
      { label: "Total Account Codes", value: String(totalCodes), change: "Dipakai lintas quotation dan finance" },
      { label: "Revenue Accounts", value: String(revenueCodes), change: "Akun pendapatan untuk invoice draft" },
      { label: "Ancillary Charges", value: String(ancillaryCodes), change: "Handling, doc fee, dan clearance" },
    ];
  }, [accountCodeList]);

  const handleFormChange = (field, value) => {
    setFormData((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.accountCode || !formData.accountName) {
      setFeedbackMessage("Account code dan account name wajib diisi.");
      return;
    }

    if (accountCodeList.some((record) => record.accountCode === formData.accountCode)) {
      setFeedbackMessage(`${formData.accountCode} sudah ada di master account code.`);
      return;
    }

    const nextRecord = createAccountCodeRecordFromForm(formData);
    const storedValue = typeof window === "undefined" ? [] : JSON.parse(window.localStorage.getItem(ACCOUNT_CODE_STORAGE_KEY) || "[]");
    const nextStoredRecords = [nextRecord, ...storedValue];

    window.localStorage.setItem(ACCOUNT_CODE_STORAGE_KEY, JSON.stringify(nextStoredRecords));
    setAccountCodeList([nextRecord, ...accountCodeList]);
    setFormData(accountCodeFormDefaults);
    setFeedbackMessage(`${nextRecord.accountCode} berhasil ditambahkan ke master account code.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary-300">Finance Master</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">Account Codes</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
            Master ini menjadi referensi resmi untuk line item quotation dan invoice draft agar mapping revenue tetap konsisten sesuai aturan perusahaan.
          </p>
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

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="glass-panel rounded-3xl p-4 md:p-5">
          <div className="border-b border-white/10 px-1 pb-4">
            <h2 className="text-lg font-semibold text-white">Daftar Account Codes</h2>
            <p className="mt-1 text-sm text-slate-400">Quotation dan invoice draft hanya boleh memilih account code dari master ini.</p>
          </div>

          <div className="mt-4 hidden overflow-hidden lg:block">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-3 py-3 font-medium">Account</th>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">Group</th>
                  <th className="px-3 py-3 font-medium">Currency</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {accountCodeList.map((record) => (
                  <tr key={record.id} className="border-b border-white/5 text-sm text-slate-200 last:border-b-0">
                    <td className="px-3 py-4">
                      <div className="font-medium text-white">{record.accountCode}</div>
                      <div className="mt-1 text-xs text-slate-400">{record.accountName}</div>
                    </td>
                    {record.rowCells.map((cell) => (
                      <td key={`${record.id}-${cell}`} className="px-3 py-4 text-slate-300">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:hidden">
            {accountCodeList.map((record) => (
              <MobileDataCard
                key={record.id}
                title={record.accountCode}
                subtitle={record.accountName}
                status={record.status}
                statusColor={record.status === "Active" ? "green" : "yellow"}
                details={record.details}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-5 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Tambah Account Code</h2>
            <p className="mt-1 text-sm text-slate-400">Master baru akan langsung tersedia di quotation dan invoice draft.</p>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-300">Account Code</span>
            <input
              type="text"
              value={formData.accountCode}
              onChange={(event) => handleFormChange("accountCode", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-500"
              placeholder="Contoh: 4120-004"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-300">Account Name</span>
            <input
              type="text"
              value={formData.accountName}
              onChange={(event) => handleFormChange("accountName", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-500"
              placeholder="Nama account"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-300">Category</span>
            <select
              value={formData.category}
              onChange={(event) => handleFormChange("category", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary-500"
            >
              <option value="Revenue">Revenue</option>
              <option value="Adjustment">Adjustment</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-300">Group</span>
            <select
              value={formData.group}
              onChange={(event) => handleFormChange("group", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary-500"
            >
              <option value="Freight">Freight</option>
              <option value="Ancillary">Ancillary</option>
              <option value="Document">Document</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-300">Currency</span>
            <select
              value={formData.currency}
              onChange={(event) => handleFormChange("currency", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary-500"
            >
              <option value="Multi Currency">Multi Currency</option>
              <option value="IDR">IDR</option>
              <option value="USD">USD</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-300">Notes</span>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(event) => handleFormChange("notes", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-500"
              placeholder="Aturan penggunaan account code ini"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-primary-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-500"
          >
            Simpan Account Code
          </button>
        </form>
      </section>
    </div>
  );
}