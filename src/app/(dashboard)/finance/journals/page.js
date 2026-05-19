import ModulePagePlaceholder from "@/features/shared/components/ModulePagePlaceholder";

const sections = [
  {
    title: "Journal Posting",
    description: "Jurnal akan mengikuti source document seperti invoice, vendor bill, dan payment.",
    status: "planned",
    items: ["Reference number", "Source type", "Auto and manual entries"],
  },
  {
    title: "Financial Traceability",
    description: "Setiap jurnal harus dapat ditelusuri kembali ke dokumen operasional atau finance yang relevan.",
    status: "planned",
    items: ["Audit trail", "Journal batches", "GL readiness"],
  },
];

export default function JournalsPage() {
  return (
    <ModulePagePlaceholder
      eyebrow="Finance"
      title="Journals"
      description="Journals disiapkan sebagai lapisan pencatatan yang menjaga keterlacakan dari transaksi operasional ke laporan keuangan."
      sections={sections}
    />
  );
}
