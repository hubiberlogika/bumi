import ModulePagePlaceholder from "@/features/shared/components/ModulePagePlaceholder";

const sections = [
  {
    title: "Operational Finance Reports",
    description: "Laporan awal fokus pada selling versus buying, AR aging, AP aging, dan branch performance.",
    status: "planned",
    items: ["Profit by job", "Revenue by branch", "Aging reports"],
  },
  {
    title: "Executive Visibility",
    description: "Pusat perlu ringkasan lintas cabang tanpa kehilangan kemampuan drill-down sampai job number.",
    status: "pending",
    items: ["Consolidated summary", "Branch filters", "Customer profitability"],
  },
];

export default function ReportsPage() {
  return (
    <ModulePagePlaceholder
      eyebrow="Finance"
      title="Reports"
      description="Reports menjadi area untuk insight keuangan dan profitabilitas lintas job, customer, cabang, dan mode transport."
      sections={sections}
    />
  );
}
