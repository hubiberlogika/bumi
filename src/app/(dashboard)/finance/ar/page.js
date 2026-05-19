import ModulePagePlaceholder from "@/features/shared/components/ModulePagePlaceholder";

const sections = [
  {
    title: "Accounts Receivable",
    description: "AR menyimpan tagihan customer yang belum lunas beserta aging dan status pembayaran.",
    status: "planned",
    items: ["Customer aging", "Outstanding by branch", "Reference invoice"],
  },
  {
    title: "Collection Visibility",
    description: "Finance dan branch manager perlu melihat piutang berdasarkan jatuh tempo dan customer prioritas.",
    status: "pending",
    items: ["Overdue filters", "Collection notes", "Reminder actions"],
  },
];

export default function ARPage() {
  return (
    <ModulePagePlaceholder
      eyebrow="Finance"
      title="Accounts Receivable"
      description="AR akan menyediakan kontrol piutang customer yang diturunkan langsung dari invoice yang sudah terbit."
      sections={sections}
    />
  );
}
