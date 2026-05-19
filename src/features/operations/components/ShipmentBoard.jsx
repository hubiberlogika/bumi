"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MobileDataCard from "@/components/ui/MobileDataCard";
import {
  SHIPMENT_STORAGE_KEY,
  VENDOR_STORAGE_KEY,
  shipmentSeedRecords,
  vendorSeedRecords,
  updateShipmentStatus,
  updateShipmentVendor,
  advanceShipmentMilestone,
  toggleActivity,
  updateDocumentStatus,
  updateItemCostPrice,
} from "@/features/operations/data/shipmentData";

// Modal Components
function DocumentsModal({ record, onClose, onUpdateStatus }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-lg font-semibold text-white">Manage Documents</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {record.documents?.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="font-medium text-white">{doc.label}</p>
                <p className="text-sm text-slate-400">Status: {doc.status}</p>
              </div>
              <select
                value={doc.status}
                onChange={(e) => onUpdateStatus(record.id, doc.id, e.target.value)}
                className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-primary-500"
              >
                <option value="pending">Pending</option>
                <option value="received">Received</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-medium text-slate-200 transition-colors hover:bg-white/10"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivitiesModal({ record, onClose, onToggleActivity }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-lg font-semibold text-white">Manage Activities</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {record.activities?.map((act) => (
            <label
              key={act.id}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <input
                type="checkbox"
                checked={act.completed}
                onChange={() => onToggleActivity(record.id, act.id)}
                className="h-5 w-5 rounded border-white/20 bg-slate-900 text-primary-600 cursor-pointer"
              />
              <div className="flex-1">
                <p className={`font-medium ${act.completed ? "line-through text-slate-500" : "text-white"}`}>
                  {act.label}
                </p>
                <p className="text-sm text-slate-400">{act.description}</p>
              </div>
              {act.completed && <span className="text-sm font-medium text-emerald-400">✓ Done</span>}
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-medium text-slate-200 transition-colors hover:bg-white/10"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function CostTrackingModal({ record, onClose, onUpdateCostPrice }) {
  const calculateMargin = (selling, cost) => {
    if (selling === 0) return 0;
    return ((selling - cost) / selling) * 100;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-lg font-semibold text-white">Cost Tracking & Margin Analysis</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Total Selling Price</p>
            <p className="mt-2 text-2xl font-bold text-white">
              IDR {(record.costTracking?.totalSelling || 0).toLocaleString("id-ID")}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Total Cost (COGS)</p>
            <p className="mt-2 text-2xl font-bold text-white">
              IDR {(record.costTracking?.totalCOGS || 0).toLocaleString("id-ID")}
            </p>
          </div>
          <div
            className={`rounded-xl border p-4 ${
              calculateMargin(record.costTracking?.totalSelling || 0, record.costTracking?.totalCOGS || 0) < 0
                ? "border-red-500/30 bg-red-500/10"
                : "border-emerald-500/30 bg-emerald-500/10"
            }`}
          >
            <p className="text-sm text-slate-400">Margin</p>
            <p
              className={`mt-2 text-2xl font-bold ${
                calculateMargin(record.costTracking?.totalSelling || 0, record.costTracking?.totalCOGS || 0) < 0
                  ? "text-red-400"
                  : "text-emerald-400"
              }`}
            >
              {calculateMargin(record.costTracking?.totalSelling || 0, record.costTracking?.totalCOGS || 0).toFixed(2)}%
            </p>
          </div>
        </div>

        {calculateMargin(record.costTracking?.totalSelling || 0, record.costTracking?.totalCOGS || 0) < 0 && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="font-semibold text-red-400">⚠ Warning: Negative Margin (LOSS)</p>
            <p className="mt-1 text-sm text-red-300">
              Total cost melebihi selling price. Sesuaikan harga jual atau harga beli untuk menghindari kerugian.
            </p>
          </div>
        )}

        <div className="space-y-4 max-h-64 overflow-y-auto">
          <h3 className="font-semibold text-white">Cost per Item:</h3>
          {record.costTracking?.itemCosts?.map((item, idx) => {
            const itemMargin = calculateMargin(item.totalSelling || 0, item.totalCost || 0);
            return (
              <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-white">{item.accountCode}</p>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Qty: {item.quantity}x</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-400">Selling Price/Unit</label>
                    <p className="mt-1 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 font-medium text-white">
                      IDR {(item.unitPrice || 0).toLocaleString("id-ID")}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">Total: IDR {(item.totalSelling || 0).toLocaleString("id-ID")}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400">Cost Price/Unit</label>
                    <input
                      type="number"
                      placeholder="Enter cost price"
                      value={item.costPrice || ""}
                      onChange={(e) => onUpdateCostPrice(record.id, item.accountCode, parseFloat(e.target.value) || 0)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none transition-colors focus:border-primary-500"
                    />
                    <p className="mt-2 text-xs text-slate-500">Total: IDR {(item.totalCost || 0).toLocaleString("id-ID")}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400">Margin</label>
                    <div
                      className={`mt-1 rounded-lg border px-3 py-2 text-center font-bold ${
                        itemMargin < 0
                          ? "border-red-500/30 bg-red-500/10 text-red-400"
                          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {itemMargin.toFixed(2)}%
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      IDR {((item.totalSelling || 0) - (item.totalCost || 0)).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-medium text-slate-200 transition-colors hover:bg-white/10"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShipmentBoard() {
  const router = useRouter();

  const [shipmentList, setShipmentList] = useState(() => {
    if (typeof window === "undefined") return shipmentSeedRecords;

    const storedValue = window.localStorage.getItem(SHIPMENT_STORAGE_KEY);
    let initialList = storedValue ? JSON.parse(storedValue) : shipmentSeedRecords;
    
    // Deduplicate by ID to remove any duplicates from old storage
    const seen = new Set();
    const deduplicated = initialList.filter((shipment) => {
      if (seen.has(shipment.id)) return false;
      seen.add(shipment.id);
      return true;
    });
    
    return deduplicated;
  });

  const [activeShipmentId, setActiveShipmentId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [activeModal, setActiveModal] = useState(null); // null, "documents", "activities", "costs"

  const [vendorOptions] = useState(() => {
    if (typeof window === "undefined") return vendorSeedRecords;

    try {
      const storedVendors = window.localStorage.getItem(VENDOR_STORAGE_KEY);
      const customVendors = storedVendors ? JSON.parse(storedVendors) : [];

      return [...customVendors, ...vendorSeedRecords];
    } catch {
      return vendorSeedRecords;
    }
  });

  const persistShipmentList = (nextList) => {
    setShipmentList(nextList);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SHIPMENT_STORAGE_KEY, JSON.stringify(nextList));
    }
  };

  const handleAssignVendor = (shipmentId, vendorId) => {
    const vendor = vendorOptions.find((v) => v.id === vendorId);
    if (!vendor) return;

    const nextList = shipmentList.map((shipment) =>
      shipment.id === shipmentId ? updateShipmentVendor(shipment, vendorId, vendor.name) : shipment
    );

    persistShipmentList(nextList);
    setFeedbackMessage(`Vendor ${vendor.name} berhasil ditugaskan ke ${shipmentList.find((s) => s.id === shipmentId)?.title}.`);
  };

  const handleAdvanceMilestone = (shipmentId) => {
    const targetShipment = shipmentList.find((s) => s.id === shipmentId);
    if (!targetShipment) return;

    const updatedShipment = advanceShipmentMilestone(targetShipment);
    const nextList = shipmentList.map((s) => (s.id === shipmentId ? updatedShipment : s));

    persistShipmentList(nextList);
    setFeedbackMessage(`${targetShipment.title} milestone updated ke ${updatedShipment.status}.`);

    if (updatedShipment.status === "Completed") {
      setFeedbackMessage(`${targetShipment.title} selesai! Diteruskan ke Finance untuk invoice billing.`);
      setTimeout(() => router.push("/finance/invoices"), 1500);
    }
  };

  const handleToggleEditor = (shipmentId) => {
    setActiveShipmentId((prev) => (prev === shipmentId ? null : shipmentId));
    setActiveModal(null);
  };

  const handleToggleActivity = (shipmentId, activityId) => {
    const nextList = shipmentList.map((s) =>
      s.id === shipmentId ? toggleActivity(s, activityId) : s
    );
    persistShipmentList(nextList);
  };

  const handleUpdateDocumentStatus = (shipmentId, docId, newStatus) => {
    const nextList = shipmentList.map((s) =>
      s.id === shipmentId ? updateDocumentStatus(s, docId, newStatus) : s
    );
    persistShipmentList(nextList);
    setFeedbackMessage(`Document status updated.`);
  };

  const handleUpdateCostPrice = (shipmentId, accountCode, costPrice) => {
    const nextList = shipmentList.map((s) =>
      s.id === shipmentId ? updateItemCostPrice(s, accountCode, costPrice) : s
    );
    persistShipmentList(nextList);
  };

  const completedShipments = shipmentList.filter((s) => s.status === "Completed").length;
  const inTransitShipments = shipmentList.filter((s) => s.status === "In Transit" || s.status === "Pickup" || s.status === "Gate In").length;

  // Get the active shipment for edit mode
  const activeRecord = activeShipmentId ? shipmentList.find((s) => s.id === activeShipmentId) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary-300">Operations</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {activeRecord ? "Edit Shipment" : "Shipments"}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
              {activeRecord
                ? `Manage shipment ${activeRecord.title} - Edit details, assign vendor, dan kelola dokumen & aktivitas.`
                : "Kelola shipment dari quotation yang sudah converted. Assign vendor, track milestone sesuai moda, dan kirim ke Finance setelah completed."}
            </p>
          </div>
          <Link
            href="/sales/quotations"
            className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-500"
          >
            Kembali ke Quotation
          </Link>
        </div>
        {feedbackMessage ? (
          <div className="mt-4 rounded-2xl border border-primary-500/20 bg-primary-500/10 px-4 py-3 text-sm text-primary-100">
            {feedbackMessage}
          </div>
        ) : null}
      </section>

      {!activeRecord && (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-400">Total Shipments</p>
            <p className="mt-2 text-3xl font-semibold text-white">{shipmentList.length}</p>
            <p className="mt-2 text-sm text-primary-300">Aktif dan monitoring</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-400">In Transit</p>
            <p className="mt-2 text-3xl font-semibold text-white">{inTransitShipments}</p>
            <p className="mt-2 text-sm text-primary-300">Sedang dalam perjalanan</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-400">Completed</p>
            <p className="mt-2 text-3xl font-semibold text-white">{completedShipments}</p>
            <p className="mt-2 text-sm text-primary-300">Siap ke invoice finance</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-400">Vendor Assigned</p>
            <p className="mt-2 text-3xl font-semibold text-white">{shipmentList.filter((s) => s.vendorId).length}</p>
            <p className="mt-2 text-sm text-primary-300">Sudah ada PO vendor</p>
          </div>
        </section>
      )}

      <section className="glass-panel rounded-3xl p-4 md:p-5">
        {!activeRecord ? (
          <>
            <div className="border-b border-white/10 px-1 pb-4">
              <h2 className="text-lg font-semibold text-white">Shipment Tracking & Milestone</h2>
              <p className="mt-1 text-sm text-slate-400">
                Setiap shipment bisa diassign vendor, track milestone, dan otomatis pindah ke Finance saat status Completed.
              </p>
            </div>

            <div className="mt-4 hidden overflow-hidden lg:block">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                    <th className="px-3 py-3 font-medium w-[20%]">Shipment</th>
                    <th className="px-3 py-3 font-medium w-[15%]">Mode</th>
                    <th className="px-3 py-3 font-medium w-[18%]">Status</th>
                    <th className="px-3 py-3 font-medium w-[20%]">Vendor</th>
                    <th className="px-3 py-3 font-medium w-[12%]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shipmentList.map((record) => (
                    <tr key={record.id} className="border-b border-white/5 text-sm text-slate-200 last:border-b-0">
                      <td className="px-3 py-4">
                        <div className="font-medium text-white">{record.title}</div>
                        <div className="mt-1 text-xs text-slate-400">{record.subtitle}</div>
                      </td>
                      <td className="px-3 py-4 text-slate-300">
                        {record.details.find((d) => d.label === "Mode")?.value || "-"}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            record.status === "Completed"
                              ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                              : record.status === "Delivered"
                                ? "border border-green-400/20 bg-green-500/10 text-green-100"
                                : record.status === "In Transit" || record.status === "Pickup" || record.status === "Gate In"
                                  ? "border border-orange-400/20 bg-orange-500/10 text-orange-100"
                                  : "border border-white/10 bg-white/5 text-white"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-slate-300">{record.vendorName || "-"}</td>
                      <td className="px-3 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleEditor(record.id)}
                          className="rounded-xl bg-primary-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-500"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:hidden">
              {shipmentList.map((record) => (
                <div key={record.id} onClick={() => handleToggleEditor(record.id)} className="cursor-pointer">
                  <MobileDataCard
                    title={record.title}
                    subtitle={record.subtitle}
                    status={record.status}
                    statusColor={record.statusColor}
                    details={record.details}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          // Edit Mode - Show detailed editor
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-semibold text-white">Edit Shipment Details</h2>
              <button
                onClick={() => handleToggleEditor(activeRecord.id)}
                className="text-slate-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Details Section */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold text-white mb-4">Shipment Information</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Vendor Assignment</span>
                  <select
                    value={activeRecord.vendorId || ""}
                    onChange={(event) => handleAssignVendor(activeRecord.id, event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary-500"
                  >
                    <option value="">Pilih vendor</option>
                    {vendorOptions.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name} ({vendor.mode})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Route</span>
                  <input
                    type="text"
                    readOnly
                    value={activeRecord.details.find((d) => d.label === "Route")?.value || "-"}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 outline-none"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Mode</span>
                  <input
                    type="text"
                    readOnly
                    value={activeRecord.details.find((d) => d.label === "Mode")?.value || "-"}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 outline-none"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Quotation Reference</span>
                  <input
                    type="text"
                    readOnly
                    value={activeRecord.quotationNumber || "-"}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 outline-none"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Cargo</span>
                  <input
                    type="text"
                    readOnly
                    value={activeRecord.details.find((d) => d.label === "Cargo")?.value || "-"}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 outline-none"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Current Status</span>
                  <input
                    type="text"
                    readOnly
                    value={activeRecord.status}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 outline-none"
                  />
                </label>
              </div>

              {activeRecord.itemLines && activeRecord.itemLines.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h4 className="text-sm font-semibold text-white">Item Lines dari Quotation</h4>
                  <div className="mt-3 space-y-2">
                    {activeRecord.itemLines.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-300">
                        <span>{item.accountCode} • {item.description}</span>
                        <span>{item.quantity}x {item.currency} {item.unitPrice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Buttons */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <button
                type="button"
                onClick={() => setActiveModal("documents")}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                📋 Manage Documents
              </button>
              <button
                type="button"
                onClick={() => setActiveModal("activities")}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                ✓ Manage Activities
              </button>
              <button
                type="button"
                onClick={() => setActiveModal("costs")}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                💰 Cost Tracking
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 md:flex-row md:justify-end border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => handleToggleEditor(activeRecord.id)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
              >
                Close Editor
              </button>
              <button
                type="button"
                onClick={() => handleAdvanceMilestone(activeRecord.id)}
                disabled={activeRecord.status === "Completed"}
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  activeRecord.status === "Completed"
                    ? "cursor-not-allowed border border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                    : "bg-primary-600 text-white hover:bg-primary-500"
                }`}
              >
                {activeRecord.status === "Completed" ? "Completed ✓" : "Advance Milestone"}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Modals */}
      {activeModal === "documents" && activeRecord && (
        <DocumentsModal
          record={activeRecord}
          onClose={() => setActiveModal(null)}
          onUpdateStatus={handleUpdateDocumentStatus}
        />
      )}

      {activeModal === "activities" && activeRecord && (
        <ActivitiesModal
          record={activeRecord}
          onClose={() => setActiveModal(null)}
          onToggleActivity={handleToggleActivity}
        />
      )}

      {activeModal === "costs" && activeRecord && (
        <CostTrackingModal
          record={activeRecord}
          onClose={() => setActiveModal(null)}
          onUpdateCostPrice={handleUpdateCostPrice}
        />
      )}
    </div>
  );
}