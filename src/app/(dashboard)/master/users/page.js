import ModulePagePlaceholder from "@/features/shared/components/ModulePagePlaceholder";

const sections = [
  {
    title: "Users and Roles",
    description: "Pengaturan user mengontrol akses lintas branch dan domain commercial, operations, finance, serta master data.",
    status: "planned",
    items: ["Role assignment", "Branch scope", "Permission matrix"],
  },
  {
    title: "Governance",
    description: "Permission map harus mengikuti domain dan aksi, bukan hanya visibilitas menu.",
    status: "pending",
    items: ["Action-based access", "Approval rights", "Audit ownership"],
  },
];

export default function UsersPage() {
  return (
    <ModulePagePlaceholder
      eyebrow="Master Data"
      title="Users and Roles"
      description="Users and Roles akan menjadi pusat kontrol akses untuk seluruh aplikasi multi-cabang."
      sections={sections}
    />
  );
}
