"use client";

import { useEffect, useState } from "react";
import { PARTNER_DRAFT_STORAGE_KEY, partnerIntakeDefaults } from "@/features/master-data/data/partnerData";

const roleFields = [
  { key: "isCustomer", label: "Customer" },
  { key: "isVendor", label: "Vendor" },
  { key: "isTransporter", label: "Transporter" },
  { key: "isShipper", label: "Shipper" },
  { key: "isConsignee", label: "Consignee" },
];

const vendorTypeOptions = ["Trucking", "Shipping Line", "Air Cargo", "Handling", "Warehouse"];
const coverageOptions = ["Jabodetabek", "Jawa Timur", "Sulawesi", "Kalimantan", "Nasional"];

export default function PartnerIntakeForm({ onSubmitPartner }) {
  const [formData, setFormData] = useState(() => {
    if (typeof window === "undefined") return partnerIntakeDefaults;

    const storedValue = window.localStorage.getItem(PARTNER_DRAFT_STORAGE_KEY);
    if (!storedValue) return partnerIntakeDefaults;

    try {
      return {
        ...partnerIntakeDefaults,
        ...JSON.parse(storedValue),
      };
    } catch {
      return partnerIntakeDefaults;
    }
  });
  const [draftStatus, setDraftStatus] = useState(() => {
    if (typeof window === "undefined") return "Draft lokal aktif";

    const storedValue = window.localStorage.getItem(PARTNER_DRAFT_STORAGE_KEY);
    return storedValue ? "Draft dimuat dari browser" : "Draft lokal aktif";
  });

  useEffect(() => {
    window.localStorage.setItem(PARTNER_DRAFT_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleChange = (key, value) => {
    setFormData((current) => ({ ...current, [key]: value }));
    setDraftStatus("Draft tersimpan otomatis");
  };

  const handleRoleToggle = (key) => {
    setFormData((current) => ({
      ...current,
      [key]: !current[key],
    }));
    setDraftStatus("Draft tersimpan otomatis");
  };

  const handleResetDraft = () => {
    window.localStorage.removeItem(PARTNER_DRAFT_STORAGE_KEY);
    setFormData(partnerIntakeDefaults);
    setDraftStatus("Draft direset ke nilai awal");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmitPartner?.(formData);
    window.localStorage.removeItem(PARTNER_DRAFT_STORAGE_KEY);
    setFormData(partnerIntakeDefaults);
    setDraftStatus("Mitra disimpan ke daftar lokal");
  };

  const selectedRoles = roleFields.filter((role) => formData[role.key]).map((role) => role.label);

  return (
    <section className="glass-panel rounded-3xl p-5 md:p-6">
      <div className="flex flex-col gap-2 border-b border-white/10 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Form Mitra</h2>
          <p className="mt-1 text-sm text-slate-400">
            Struktur awal untuk input customer, vendor, atau transporter dengan field minimum kebutuhan forwarder.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-primary-500/20 bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-300">
            {draftStatus}
          </span>
          <button
            type="button"
            onClick={handleResetDraft}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10"
          >
            Reset Draft
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_0.9fr]">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Nama Perusahaan</span>
              <input
                value={formData.companyName}
                onChange={(event) => handleChange("companyName", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-400"
                placeholder="PT Nusantara Logistik"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Kode Mitra</span>
              <input
                value={formData.partnerCode}
                onChange={(event) => handleChange("partnerCode", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-400"
                placeholder="MTR-052"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            {roleFields.map((role) => {
              const active = formData[role.key];
              return (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => handleRoleToggle(role.key)}
                  className={`rounded-2xl border px-3 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "border-primary-500/30 bg-primary-500/15 text-primary-200"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  {role.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">PIC Utama</span>
              <input
                value={formData.contactPerson}
                onChange={(event) => handleChange("contactPerson", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-400"
                placeholder="Nama PIC"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Telepon / WhatsApp</span>
              <input
                value={formData.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-400"
                placeholder="+62 812 0000 0000"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Email</span>
              <input
                value={formData.email}
                onChange={(event) => handleChange("email", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-400"
                placeholder="ops@mitra.co.id"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Kota</span>
              <input
                value={formData.city}
                onChange={(event) => handleChange("city", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-400"
                placeholder="Jakarta"
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-300">Alamat Lengkap</span>
            <textarea
              value={formData.address}
              onChange={(event) => handleChange("address", event.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-400"
              placeholder="Alamat billing atau operasional mitra"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-2 xl:col-span-2">
              <span className="text-sm font-medium text-slate-300">NPWP</span>
              <input
                value={formData.taxId}
                onChange={(event) => handleChange("taxId", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-400"
                placeholder="00.000.000.0-000.000"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Terms</span>
              <input
                value={formData.paymentTerms}
                onChange={(event) => handleChange("paymentTerms", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-400"
                placeholder="NET 30"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Coverage</span>
              <select
                value={formData.coverageArea}
                onChange={(event) => handleChange("coverageArea", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-surface-900 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary-400"
              >
                {coverageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Jenis Vendor</span>
              <select
                value={formData.vendorType}
                onChange={(event) => handleChange("vendorType", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-surface-900 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary-400"
              >
                {vendorTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Bank</span>
              <input
                value={formData.bankName}
                onChange={(event) => handleChange("bankName", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-400"
                placeholder="BCA"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">No. Rekening</span>
              <input
                value={formData.bankAccount}
                onChange={(event) => handleChange("bankAccount", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-400"
                placeholder="1230009988"
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-300">Catatan Operasional</span>
            <textarea
              value={formData.operationalNotes}
              onChange={(event) => handleChange("operationalNotes", event.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary-400"
              placeholder="Catatan SLA, jam operasional, atau instruksi dokumen"
            />
          </label>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-4 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={handleResetDraft}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-primary-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-500"
            >
              Simpan Mitra
            </button>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-base font-semibold text-white">Ringkasan Data</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Roles</p>
                <p className="mt-1 text-white">{selectedRoles.length ? selectedRoles.join(", ") : "Pilih minimal satu role"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Commercial Readiness</p>
                <p className="mt-1 text-white">{formData.companyName || "Nama perusahaan belum diisi"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Finance Readiness</p>
                <p className="mt-1 text-white">{formData.paymentTerms && formData.bankAccount ? "Siap untuk PO/AP/AR" : "Lengkapi terms dan rekening"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Coverage</p>
                <p className="mt-1 text-white">{formData.coverageArea}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-base font-semibold text-white">Checklist Minimal</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {[
                formData.companyName ? "Nama perusahaan terisi" : "Isi nama perusahaan",
                formData.contactPerson ? "PIC utama tersedia" : "Isi PIC utama",
                formData.phone ? "Kontak operasional tersedia" : "Isi telepon atau WhatsApp",
                formData.taxId ? "NPWP tersedia" : "Isi NPWP bila diperlukan invoice atau vendor bill",
                formData.bankAccount ? "Rekening tersedia" : "Isi rekening untuk kebutuhan payment",
              ].map((item) => (
                <li key={item} className="rounded-xl border border-white/5 bg-black/10 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}