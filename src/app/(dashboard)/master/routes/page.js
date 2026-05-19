import ModulePagePlaceholder from "@/features/shared/components/ModulePagePlaceholder";

const sections = [
  {
    title: "Route References",
    description: "Route master akan menyimpan origin, destination, corridor, dan lane yang sering digunakan.",
    status: "planned",
    items: ["City pairs", "Port and airport pairs", "Lead-time defaults"],
  },
  {
    title: "Operational Reuse",
    description: "Route references dipakai kembali di pengajuan, quotation, shipment, dan reporting lane performance.",
    status: "pending",
    items: ["Preferred route", "Lane tags", "Mode compatibility"],
  },
];

export default function RoutesPage() {
  return (
    <ModulePagePlaceholder
      eyebrow="Master Data"
      title="Routes"
      description="Routes membantu menjaga konsistensi lane operasional dan mempermudah input transaksi berulang."
      sections={sections}
    />
  );
}
