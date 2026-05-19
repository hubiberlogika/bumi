# Module Finance

## Tujuan
Mengelola invoice customer, tagihan vendor, receivables, payables, payment, jurnal, dan pelaporan dasar.

## Halaman Inti
- Invoices
- AR
- AP
- Payments
- Journals
- Reports

## Kemampuan Utama
- Membuat invoice customer dari quotation atau shipment
- Mencatat AP dari vendor PO atau vendor bill
- Mencatat penerimaan pembayaran customer
- Mencatat pembayaran ke vendor
- Menghasilkan jurnal otomatis atau semi-otomatis
- Menyediakan laporan selling vs buying, aging, dan profitability dasar

## Entitas Utama
- Customer Invoice
- Vendor Bill
- AR Entry
- AP Entry
- Payment Receipt
- Vendor Payment
- Journal Entry

## Aturan Utama
- Semua transaksi finance harus terkait job number bila relevan
- Revenue dan cost harus bisa ditelusuri ke shipment
- Status invoice dan bill harus sinkron dengan payment
- Posting jurnal harus menyimpan source document dan reference number

## Responsive Notes
- List invoice dan AP harus punya status badge besar dan amount yang jelas
- Filter period, branch, currency, dan status harus collapsible di mobile
- Laporan tabel perlu mode summary card di layar kecil
