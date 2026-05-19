export const SHIPMENT_STORAGE_KEY = "bumi.shipments.converted";
export const VENDOR_STORAGE_KEY = "bumi.operations.vendors";

export const vendorSeedRecords = [
  { id: "V-001", name: "PT Sinar Transportasi", mode: "Darat", city: "Jakarta" },
  { id: "V-002", name: "PT Pratama Logistik", mode: "Darat", city: "Surabaya" },
  { id: "V-003", name: "PT Samudra Jaya", mode: "Laut", city: "Jakarta" },
  { id: "V-004", name: "PT Aero Kargo", mode: "Udara", city: "Jakarta" },
];

function getStatusColor(status) {
  if (status === "Booked") return "blue";
  if (status === "In Transit") return "orange";
  if (status === "Arrived") return "yellow";
  if (status === "Delivered") return "green";
  if (status === "Completed") return "emerald";
  return "slate";
}

function getNextStatusByMode(currentStatus, mode) {
  const statusSequence = {
    Darat: ["Booked", "Pickup", "In Transit", "Arrived", "Delivered", "Completed"],
    Laut: ["Booked", "Gate In", "Vessel Departed", "Vessel Arrived", "Discharged", "Delivered", "Completed"],
    Udara: ["Booked", "Accepted", "Flight Departed", "Flight Arrived", "Released", "Delivered", "Completed"],
  };
  const sequence = statusSequence[mode] || statusSequence.Darat;
  const currentIndex = sequence.indexOf(currentStatus);
  return currentIndex < sequence.length - 1 ? sequence[currentIndex + 1] : currentStatus;
}

export function updateShipmentStatus(shipment, newStatus) {
  return {
    ...shipment,
    status: newStatus,
    statusColor: getStatusColor(newStatus),
  };
}

export function updateShipmentVendor(shipment, vendorId, vendorName) {
  return {
    ...shipment,
    vendorId,
    vendorName,
  };
}

export function advanceShipmentMilestone(shipment) {
  const mode = shipment.details?.find((d) => d.label === "Mode")?.value || "Darat";
  const nextStatus = getNextStatusByMode(shipment.status, mode);
  return updateShipmentStatus(shipment, nextStatus);
}

// Operational Activities - typical forwarding activities
export const OPERATIONAL_ACTIVITIES = [
  { id: "doc-collection", label: "Dokumentasi Collection", description: "Kumpulkan semua dokumen dari shipper" },
  { id: "customs-clearance", label: "Customs Clearance", description: "Proses clearance dengan bea cukai" },
  { id: "quality-check", label: "Quality Check", description: "Inspeksi barang sebelum pengiriman" },
  { id: "manifest-prep", label: "Manifest Preparation", description: "Siapkan manifest barang" },
  { id: "loading", label: "Loading", description: "Proses loading ke kendaraan" },
  { id: "in-transit", label: "In Transit", description: "Barang sedang dalam perjalanan" },
  { id: "unloading", label: "Unloading", description: "Proses unloading di tujuan" },
  { id: "final-delivery", label: "Final Delivery", description: "Pengiriman akhir ke consignee" },
  { id: "pod-collection", label: "POD Collection", description: "Kumpulkan Proof of Delivery" },
];

// Document Types required for forwarding
export const DOCUMENT_TYPES = [
  { id: "bl", label: "Bill of Lading (B/L)", status: "pending" },
  { id: "customs", label: "Customs Declaration", status: "pending" },
  { id: "invoice", label: "Commercial Invoice", status: "pending" },
  { id: "packing-list", label: "Packing List", status: "pending" },
  { id: "insurance", label: "Insurance Certificate", status: "pending" },
  { id: "certificate-origin", label: "Certificate of Origin", status: "pending" },
];

export function initializeShipmentOperations(shipment) {
  return {
    ...shipment,
    activities: OPERATIONAL_ACTIVITIES.map((act) => ({
      ...act,
      completed: false,
      completedAt: null,
    })),
    documents: DOCUMENT_TYPES.map((doc) => ({
      ...doc,
      status: "pending", // pending, received, approved, rejected
      uploadedAt: null,
    })),
    costTracking: {
      totalCOGS: 0, // total cost of goods
      totalSelling: 0, // total selling price
      itemCosts: shipment.itemLines?.map((item) => ({
        accountCode: item.accountCode,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice || 0,
        costPrice: 0, // to be filled by user
        totalSelling: (item.quantity || 1) * (item.unitPrice || 0),
        totalCost: 0,
      })) || [],
    },
  };
}

export function toggleActivity(shipment, activityId) {
  if (!shipment.activities) return shipment;
  const updatedActivities = shipment.activities.map((act) =>
    act.id === activityId
      ? { ...act, completed: !act.completed, completedAt: !act.completed ? new Date().toISOString() : null }
      : act
  );
  return { ...shipment, activities: updatedActivities };
}

export function updateDocumentStatus(shipment, docId, newStatus) {
  if (!shipment.documents) return shipment;
  const updatedDocs = shipment.documents.map((doc) =>
    doc.id === docId ? { ...doc, status: newStatus, uploadedAt: new Date().toISOString() } : doc
  );
  return { ...shipment, documents: updatedDocs };
}

export function updateItemCostPrice(shipment, accountCode, costPrice) {
  if (!shipment.costTracking) return shipment;
  const updatedItems = shipment.costTracking.itemCosts.map((item) =>
    item.accountCode === accountCode
      ? {
          ...item,
          costPrice,
          totalCost: costPrice * item.quantity,
        }
      : item
  );
  const totalCOGS = updatedItems.reduce((sum, item) => sum + item.totalCost, 0);
  const totalSelling = updatedItems.reduce((sum, item) => sum + item.totalSelling, 0);
  return {
    ...shipment,
    costTracking: { ...shipment.costTracking, itemCosts: updatedItems, totalCOGS, totalSelling },
  };
}

// Initialize seed records with operational structures
function createSeedRecord(base) {
  return initializeShipmentOperations(base);
}

export const shipmentSeedRecords = [
  createSeedRecord({
    id: "SHP-S-001",
    title: "SHP-S-001",
    subtitle: "PT Maju Bersama",
    status: "In Transit",
    statusColor: "blue",
    details: [
      { label: "Route", value: "Jakarta -> Surabaya" },
      { label: "Mode", value: "Darat" },
      { label: "Reference", value: "Manual Entry" },
      { label: "ETA", value: "24 Apr 2026" },
    ],
    itemLines: [
      { accountCode: "ACC-001", description: "General Cargo", quantity: 5, currency: "IDR", unitPrice: "500000" },
    ],
  }),
  createSeedRecord({
    id: "SHP-S-002",
    title: "SHP-S-002",
    subtitle: "CV Agro Nusantara",
    status: "Delivered",
    statusColor: "green",
    details: [
      { label: "Route", value: "Semarang -> Bandung" },
      { label: "Mode", value: "Laut" },
      { label: "Reference", value: "Manual Entry" },
      { label: "ETA", value: "23 Apr 2026" },
    ],
    itemLines: [
      { accountCode: "ACC-002", description: "Agricultural Products", quantity: 10, currency: "IDR", unitPrice: "250000" },
    ],
  }),
];

export function convertQuotationRecordToShipment(quotationRecord) {
  const randomNumber = Math.floor(10000 + Math.random() * 89999);
  const quotationReference = quotationRecord.quotationNumber || quotationRecord.id || quotationRecord.title;

  const baseShipment = {
    id: `SHP-${randomNumber}`,
    sourceQuotationId: quotationRecord.id,
    quotationNumber: quotationReference,
    quotationTitle: quotationRecord.title,
    itemLines: quotationRecord.itemLines || [],
    title: `SHP-${randomNumber}`,
    subtitle: quotationRecord.subtitle,
    status: "Booked",
    statusColor: getStatusColor("Booked"),
    vendorId: null,
    vendorName: null,
    details: [
      { label: "Route", value: quotationRecord.details.find((detail) => detail.label === "Route")?.value || "-" },
      { label: "Mode", value: quotationRecord.summary?.mode || "-" },
      { label: "Reference", value: quotationReference },
      { label: "Cargo", value: quotationRecord.summary?.cargo || "-" },
    ],
  };

  return initializeShipmentOperations(baseShipment);
}