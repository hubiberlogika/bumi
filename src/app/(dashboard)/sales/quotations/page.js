import QuotationWorkspace from "@/features/sales/components/QuotationWorkspace";
import { quotationRecords } from "@/features/sales/data/commercialData";

export default function QuotationsPage() {
  return (
    <QuotationWorkspace
      eyebrow="Commercial"
      title="Quotations"
      description="Quotation dimulai dari pembuatan dokumen baru, lalu dikelola langsung dari tabel utama. Klik baris quotation untuk membuka detail row editor dan lanjutkan ke shipment saat customer sudah approve."
      records={quotationRecords}
      columns={["Items", "Route", "Account Ref", "Selling", "Valid Until"]}
      actionHref="/ops/shipments"
      actionLabel="Lihat Shipments"
    />
  );
}
