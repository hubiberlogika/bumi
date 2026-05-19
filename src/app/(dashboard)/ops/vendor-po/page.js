import ModulePagePlaceholder from "@/features/shared/components/ModulePagePlaceholder";

const sections = [
  {
    title: "Vendor Purchase Orders",
    description: "PO vendor diturunkan dari buying items shipment dan assignment vendor per leg.",
    status: "ready",
    items: ["Linked shipment", "Vendor selection", "Buying breakdown", "Approval state"],
  },
  {
    title: "Cost Control",
    description: "PO menjadi jembatan antara planning cost di operations dan AP di finance.",
    status: "planned",
    items: ["Threshold approval", "Fulfillment state", "Vendor bill readiness"],
  },
];

export default function VendorPOPage() {
  return (
    <ModulePagePlaceholder
      eyebrow="Operations"
      title="Vendor PO"
      description="Vendor PO menjaga disiplin cost sebelum tagihan vendor masuk ke finance dan AP."
      sections={sections}
    />
  );
}
