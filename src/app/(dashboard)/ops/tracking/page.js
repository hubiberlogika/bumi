import ModulePagePlaceholder from "@/features/shared/components/ModulePagePlaceholder";

const sections = [
  {
    title: "Milestone Tracking",
    description: "Tracking disusun berdasarkan mode darat, laut, dan udara dengan milestone yang berbeda.",
    status: "ready",
    items: ["ETA and ATA", "Exception reason", "Last update by", "POD readiness"],
  },
  {
    title: "Responsive Monitoring",
    description: "Monitoring harus tetap nyaman di mobile untuk update cepat dan pengecekan status lapangan.",
    status: "planned",
    items: ["Card-first layout", "Sticky filters", "Compact status timeline"],
  },
];

export default function TrackingPage() {
  return (
    <ModulePagePlaceholder
      eyebrow="Operations"
      title="Tracking"
      description="Tracking memusatkan milestone shipment, keterlambatan, exception, dan status delivery per job."
      sections={sections}
    />
  );
}
