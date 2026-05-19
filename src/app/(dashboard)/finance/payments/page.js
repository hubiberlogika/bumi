import ModulePagePlaceholder from "@/features/shared/components/ModulePagePlaceholder";

const sections = [
  {
    title: "Payment Recording",
    description: "Mencatat penerimaan customer dan pembayaran vendor pada satu domain payment operations.",
    status: "planned",
    items: ["Receipt entry", "Vendor payment", "Reference matching", "Bank account"],
  },
  {
    title: "Reconciliation",
    description: "Pembayaran harus memperbarui AR atau AP dan menyiapkan jurnal untuk rekonsiliasi keuangan.",
    status: "pending",
    items: ["Partial payment", "Allocation", "Status sync"],
  },
];

export default function PaymentsPage() {
  return (
    <ModulePagePlaceholder
      eyebrow="Finance"
      title="Payments"
      description="Payments menyatukan pencatatan kas masuk dan kas keluar yang terhubung ke invoice, AP, dan jurnal."
      sections={sections}
    />
  );
}
