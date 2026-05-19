"use client";

import { useState } from "react";
import MobileDataCard from "@/components/ui/MobileDataCard";
import PartnerIntakeForm from "@/features/master-data/components/PartnerIntakeForm";
import {
  createPartnerRecordFromForm,
  PARTNER_STORAGE_KEY,
} from "@/features/master-data/data/partnerData";

export default function PartnerDirectoryWorkspace({ stats, records, requirements }) {
  const [partnerList, setPartnerList] = useState(() => {
    if (typeof window === "undefined") return records;

    const storedValue = window.localStorage.getItem(PARTNER_STORAGE_KEY);
    if (!storedValue) return records;

    try {
      return [...JSON.parse(storedValue), ...records];
    } catch {
      return records;
    }
  });

  const handleSubmitPartner = (formData) => {
    const nextPartner = createPartnerRecordFromForm(formData);
    const existingCustom = typeof window === "undefined"
      ? []
      : JSON.parse(window.localStorage.getItem(PARTNER_STORAGE_KEY) || "[]");
    const nextCustomPartners = [nextPartner, ...existingCustom];

    window.localStorage.setItem(PARTNER_STORAGE_KEY, JSON.stringify(nextCustomPartners));
    setPartnerList([nextPartner, ...partnerList]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="glass-panel rounded-3xl p-6 md:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary-300">Mitra</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">Direktori Mitra</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
          Menu ini menjadi pusat input dan referensi customer, vendor, transporter, shipper, dan consignee.
          Struktur datanya disiapkan untuk kebutuhan forwarder: quotation, shipment, PO vendor, invoice, AP, AR, dan dokumen operasional.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stat.label === "Total Mitra" ? partnerList.length : stat.value}
            </p>
            <p className="mt-2 text-sm text-primary-300">{stat.change}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="glass-panel rounded-3xl p-4 md:p-5">
          <div className="border-b border-white/10 px-1 pb-4">
            <h2 className="text-lg font-semibold text-white">Daftar Mitra</h2>
            <p className="mt-1 text-sm text-slate-400">Format daftar ini menonjolkan kode mitra, role, PIC, kota, dan payment terms.</p>
          </div>

          <div className="mt-4 hidden lg:block overflow-hidden">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-3 py-3 font-medium">Mitra</th>
                  <th className="px-3 py-3 font-medium">Role</th>
                  <th className="px-3 py-3 font-medium">Kota</th>
                  <th className="px-3 py-3 font-medium">PIC</th>
                  <th className="px-3 py-3 font-medium">Terms</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {partnerList.map((record) => (
                  <tr key={record.id} className="border-b border-white/5 text-sm text-slate-200 last:border-b-0">
                    <td className="px-3 py-4">
                      <div className="font-medium text-white">{record.partnerCode}</div>
                      <div className="mt-1 text-xs text-slate-400">{record.partnerName}</div>
                    </td>
                    {record.rowCells.map((cell) => (
                      <td key={`${record.id}-${cell}`} className="px-3 py-4 text-slate-300">{cell}</td>
                    ))}
                    <td className="px-3 py-4">
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white">
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:hidden">
            {partnerList.map((record) => (
              <MobileDataCard
                key={record.id}
                title={record.partnerCode}
                subtitle={record.partnerName}
                status={record.status}
                statusColor={record.statusColor}
                details={record.details}
              />
            ))}
          </div>
        </div>

        <aside className="glass-panel rounded-3xl p-5">
          <h2 className="text-lg font-semibold text-white">Format Data Forwarder</h2>
          <p className="mt-1 text-sm text-slate-400">Gunakan field minimum berikut agar data customer dan vendor siap dipakai lintas quotation, operations, dan finance.</p>
          <div className="mt-4 space-y-4">
            {requirements.map((requirement) => (
              <section key={requirement.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-white">{requirement.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{requirement.description}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {requirement.items.map((item) => (
                    <li key={item} className="rounded-xl border border-white/5 bg-black/10 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </aside>
      </section>

      <PartnerIntakeForm onSubmitPartner={handleSubmitPartner} />
    </div>
  );
}