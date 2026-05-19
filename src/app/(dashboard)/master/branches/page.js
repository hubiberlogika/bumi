import ModulePagePlaceholder from "@/features/shared/components/ModulePagePlaceholder";

const sections = [
  {
    title: "Branch Governance",
    description: "Cabang akan mengontrol ownership transaksi, numbering context, dan visibilitas data.",
    status: "planned",
    items: ["Branch profile", "Branch code", "Active status", "Ownership rules"],
  },
  {
    title: "Multi-Branch Reporting",
    description: "Data cabang harus bisa dikonsolidasikan di pusat tanpa menghilangkan kontrol akses.",
    status: "pending",
    items: ["Head office scope", "Branch filter", "Cross-branch reporting"],
  },
];

export default function BranchesPage() {
  return (
    <ModulePagePlaceholder
      eyebrow="Master Data"
      title="Branches"
      description="Branches akan menyimpan struktur organisasi operasional yang memengaruhi transaksi, role, dan pelaporan."
      sections={sections}
    />
  );
}
