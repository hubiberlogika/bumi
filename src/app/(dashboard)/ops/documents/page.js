import ModulePagePlaceholder from "@/features/shared/components/ModulePagePlaceholder";

const sections = [
  {
    title: "Operational Documents",
    description: "Dokumen operasional akan mengikuti shipment dan mode transport yang aktif.",
    status: "planned",
    items: ["Surat jalan", "Delivery order", "AWB", "BL", "POD"],
  },
  {
    title: "Document Snapshot",
    description: "Data cetak harus memakai snapshot shipment saat dokumen dibuat, bukan selalu membaca master terbaru.",
    status: "pending",
    items: ["Printable templates", "Attachment history", "Issued timestamps"],
  },
];

export default function DocumentsPage() {
  return (
    <ModulePagePlaceholder
      eyebrow="Operations"
      title="Documents"
      description="Document center disiapkan untuk penyimpanan, pencetakan, dan kontrol dokumen operasional per shipment."
      sections={sections}
    />
  );
}
