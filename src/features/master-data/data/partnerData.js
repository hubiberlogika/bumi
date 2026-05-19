export const partnerStats = [
  { label: "Total Mitra", value: "48", change: "12 customer, 26 vendor, 10 transporter" },
  { label: "Vendor Aktif", value: "26", change: "8 laut, 11 darat, 7 udara" },
  { label: "Customer Aktif", value: "12", change: "4 account prioritas bulan ini" },
];

export const partnerRecords = [
  {
    id: "MTR-001",
    partnerCode: "MTR-001",
    partnerName: "PT Sumber Lintas Nusantara",
    roles: ["Customer", "Shipper"],
    city: "Jakarta",
    contactPerson: "Nadia Prasetyo",
    paymentTerms: "NET 30",
    npwp: "02.345.678.9-091.000",
    phone: "+62 21 555 0199",
    bank: "BCA 9988776655",
    status: "Active",
    statusColor: "green",
    rowCells: ["Customer, Shipper", "Jakarta", "Nadia Prasetyo", "NET 30"],
    details: [
      { label: "Role", value: "Customer, Shipper" },
      { label: "PIC", value: "Nadia Prasetyo" },
      { label: "NPWP", value: "02.345.678.9-091.000" },
      { label: "Bank", value: "BCA 9988776655" },
    ],
  },
  {
    id: "MTR-014",
    partnerCode: "MTR-014",
    partnerName: "CV Samudra Kargo Line",
    roles: ["Vendor", "Transporter"],
    city: "Surabaya",
    contactPerson: "Arif Wibowo",
    paymentTerms: "NET 14",
    npwp: "71.111.222.3-604.000",
    phone: "+62 31 778 4412",
    bank: "Mandiri 1230008891",
    status: "Active",
    statusColor: "blue",
    rowCells: ["Vendor, Transporter", "Surabaya", "Arif Wibowo", "NET 14"],
    details: [
      { label: "Role", value: "Vendor, Transporter" },
      { label: "PIC", value: "Arif Wibowo" },
      { label: "NPWP", value: "71.111.222.3-604.000" },
      { label: "Bank", value: "Mandiri 1230008891" },
    ],
  },
  {
    id: "MTR-027",
    partnerCode: "MTR-027",
    partnerName: "PT Aero Distribusi Timur",
    roles: ["Customer", "Consignee"],
    city: "Makassar",
    contactPerson: "Rani Kusuma",
    paymentTerms: "COD",
    npwp: "09.888.321.4-805.000",
    phone: "+62 411 430 880",
    bank: "BNI 8800112211",
    status: "Review",
    statusColor: "yellow",
    rowCells: ["Customer, Consignee", "Makassar", "Rani Kusuma", "COD"],
    details: [
      { label: "Role", value: "Customer, Consignee" },
      { label: "PIC", value: "Rani Kusuma" },
      { label: "NPWP", value: "09.888.321.4-805.000" },
      { label: "Bank", value: "BNI 8800112211" },
    ],
  },
];

export const partnerRequirements = [
  {
    title: "Data Wajib Customer",
    description: "Field minimum untuk kebutuhan quotation, invoice, AR, dan pencetakan dokumen.",
    items: ["Nama perusahaan", "PIC dan kontak", "Alamat penagihan", "NPWP", "Payment terms"],
  },
  {
    title: "Data Wajib Vendor atau Transporter",
    description: "Field minimum untuk PO, AP, payment, dan kontrol operasional vendor pihak ketiga.",
    items: ["Jenis vendor", "Layanan moda", "PIC operasional", "Rekening bank", "Payment terms vendor"],
  },
  {
    title: "Field Tambahan Forwarder",
    description: "Data tambahan untuk menjaga kelengkapan shipment dan dokumen operasional.",
    items: ["Role shipper atau consignee", "Kota dan coverage area", "Catatan SLA", "Status aktif"],
  },
];

export const partnerIntakeDefaults = {
  companyName: "",
  partnerCode: "",
  contactPerson: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  taxId: "",
  paymentTerms: "NET 30",
  coverageArea: "Nasional",
  vendorType: "Trucking",
  bankName: "",
  bankAccount: "",
  operationalNotes: "",
  isCustomer: true,
  isVendor: false,
  isTransporter: false,
  isShipper: false,
  isConsignee: false,
};

export const PARTNER_DRAFT_STORAGE_KEY = "bumi.mitra.draft";
export const PARTNER_STORAGE_KEY = "bumi.mitra.records";

export function createPartnerRecordFromForm(formData) {
  const roleLabels = [
    formData.isCustomer && "Customer",
    formData.isVendor && "Vendor",
    formData.isTransporter && "Transporter",
    formData.isShipper && "Shipper",
    formData.isConsignee && "Consignee",
  ].filter(Boolean);

  const partnerCode = formData.partnerCode || `MTR-${Math.floor(100 + Math.random() * 900)}`;

  return {
    id: partnerCode,
    partnerCode,
    partnerName: formData.companyName,
    roles: roleLabels,
    city: formData.city || "-",
    contactPerson: formData.contactPerson || "-",
    paymentTerms: formData.paymentTerms || "-",
    npwp: formData.taxId || "-",
    phone: formData.phone || "-",
    bank: formData.bankName && formData.bankAccount ? `${formData.bankName} ${formData.bankAccount}` : "-",
    status: "Draft",
    statusColor: "blue",
    rowCells: [roleLabels.join(", ") || "-", formData.city || "-", formData.contactPerson || "-", formData.paymentTerms || "-"],
    details: [
      { label: "Role", value: roleLabels.join(", ") || "-" },
      { label: "PIC", value: formData.contactPerson || "-" },
      { label: "NPWP", value: formData.taxId || "-" },
      { label: "Bank", value: formData.bankName && formData.bankAccount ? `${formData.bankName} ${formData.bankAccount}` : "-" },
    ],
  };
}