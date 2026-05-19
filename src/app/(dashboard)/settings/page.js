import ModulePagePlaceholder from "@/features/shared/components/ModulePagePlaceholder";

const sections = [
  {
    title: "Application Settings",
    description: "Settings akan menampung pengaturan perusahaan, numbering, default currency, dan template preferensi dokumen.",
    status: "planned",
    items: ["Company profile", "Branch defaults", "Numbering rules"],
  },
  {
    title: "Implementation Notes",
    description: "Halaman ini menjadi landing area untuk pengaturan global sebelum dipecah menjadi screen yang lebih spesifik.",
    status: "ready",
    items: ["Global preferences", "Document presets", "Reference links"],
  },
];

export default function SettingsPage() {
  return (
    <ModulePagePlaceholder
      eyebrow="Settings"
      title="Settings"
      description="Settings akan menjadi pusat konfigurasi global dan branch-aware untuk aplikasi BUMI."
      sections={sections}
    />
  );
}
