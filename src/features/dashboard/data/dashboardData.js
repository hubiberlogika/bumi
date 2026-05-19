import { quotationRecords } from "@/features/sales/data/commercialData";
import { partnerRecords } from "@/features/master-data/data/partnerData";

export const dashboardStats = [
  {
    name: "Quotation Aktif",
    value: String(quotationRecords.length),
    change: `${quotationRecords.filter((record) => record.status === "Waiting Approval").length} waiting approval`,
    icon: "quotation",
    trend: "up",
  },
  {
    name: "Mitra Aktif",
    value: String(partnerRecords.filter((record) => record.status === "Active").length),
    change: `${partnerRecords.filter((record) => record.roles.includes("Vendor") || record.roles.includes("Transporter")).length} vendor or transporter`,
    icon: "mitra",
    trend: "up",
  },
  {
    name: "Unpaid Invoices",
    value: "Rp 124.5M",
    change: "2 invoices due this week",
    icon: "invoice",
    trend: "down",
  },
  {
    name: "Revenue Plan",
    value: "Rp 450.2M",
    change: `${quotationRecords.filter((record) => record.status === "Customer Approved").length} quotations ready to convert`,
    icon: "revenue",
    trend: "up",
  },
];

export const recentShipments = [
  {
    id: "SHP-10042",
    client: "PT Maju Bersama",
    status: "In Transit",
    statusColor: "blue",
    origin: "Jakarta",
    destination: "Surabaya",
    date: "24 Apr 2026",
  },
  {
    id: "SHP-10043",
    client: "CV Agro Nusantara",
    status: "Delivered",
    statusColor: "green",
    origin: "Semarang",
    destination: "Bandung",
    date: "23 Apr 2026",
  },
  {
    id: "SHP-10044",
    client: "PT Tekno Logistik",
    status: "Pending",
    statusColor: "yellow",
    origin: "Jakarta",
    destination: "Medan",
    date: "25 Apr 2026",
  },
];

export const dashboardFlowHighlights = [
  {
    title: "Quotation to Operations",
    description: "Quotation yang paling dekat diteruskan ke shipment harus punya route, mode, cargo summary, dan customer yang jelas.",
    items: [
      `${quotationRecords.filter((record) => record.status === "Customer Approved").length} quotation siap convert`,
      "Initial vendor planning tersedia",
      "Customer and PIC confirmed",
    ],
  },
  {
    title: "Operations to Finance",
    description: "Begitu shipment berjalan, finance perlu reference selling, payment terms, dan identitas customer untuk billing.",
    items: [
      "Selling value attached to quotation",
      "Customer NPWP available in mitra data",
      "Payment terms visible on partner directory",
    ],
  },
  {
    title: "Mitra Readiness",
    description: "Partner yang lengkap mempercepat quotation, PO vendor, invoice, dan payment tanpa input ulang.",
    items: [
      `${partnerRecords.filter((record) => record.roles.includes("Customer")).length} customer references`,
      `${partnerRecords.filter((record) => record.roles.includes("Vendor") || record.roles.includes("Transporter")).length} operational vendors`,
      `${partnerRecords.filter((record) => record.status === "Review").length} mitra perlu dilengkapi`,
    ],
  },
];