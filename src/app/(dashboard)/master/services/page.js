import ModulePagePlaceholder from "@/features/shared/components/ModulePagePlaceholder";

const sections = [
  {
    title: "Services and Modes",
    description: "Master service akan mendefinisikan mode darat, laut, udara, serta service variants yang dipakai quotation dan shipment.",
    status: "planned",
    items: ["Transport mode", "Service level", "Charge templates"],
  },
  {
    title: "Commercial Consistency",
    description: "Service references membantu menjaga quotation dan shipment menggunakan istilah yang seragam.",
    status: "pending",
    items: ["Labels", "Service defaults", "Mode-specific options"],
  },
];

export default function ServicesPage() {
  return (
    <ModulePagePlaceholder
      eyebrow="Master Data"
      title="Services"
      description="Services akan menjadi referensi domain untuk jenis layanan forwarding lokal dan opsi transport yang tersedia."
      sections={sections}
    />
  );
}
