import ModulePagePlaceholder from "@/features/shared/components/ModulePagePlaceholder";

const sections = [
  {
    title: "Accounts Payable",
    description: "AP menyimpan kewajiban ke vendor dan transporter dengan referensi shipment atau PO.",
    status: "planned",
    items: ["Vendor bill", "Due dates", "PO reference", "Payment state"],
  },
  {
    title: "Vendor Cost Control",
    description: "AP menjadi titik verifikasi terakhir antara planned buying cost, PO, dan bill aktual dari vendor.",
    status: "planned",
    items: ["Cost variance", "Approval check", "Branch visibility"],
  },
];

export default function APPage() {
  return (
    <ModulePagePlaceholder
      eyebrow="Finance"
      title="Accounts Payable"
      description="AP akan mengontrol kewajiban vendor agar buying cost shipment tetap bisa ditelusuri sampai ke pembayaran."
      sections={sections}
    />
  );
}
