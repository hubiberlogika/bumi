# Module Operations

## Tujuan
Mengelola konversi quotation ke shipment, assignment vendor, monitoring milestone, dan dokumen pengiriman.

## Halaman Inti
- Shipments
- Tracking
- Documents
- Vendor PO

## Kemampuan Utama
- Membuat shipment dari quotation approved
- Menghasilkan job number dan service order
- Menentukan moda darat, laut, atau udara
- Menyimpan route, ETA, ATA, dan special handling
- Menetapkan vendor atau transporter per leg
- Membuat PO vendor dari buying items
- Mengelola dokumen seperti surat jalan, DO, AWB, BL, POD
- Mengelola milestone dan exception

## Entitas Utama
- Shipment
- Shipment Leg
- Milestone
- Operational Document
- Vendor Assignment
- Vendor Purchase Order

## Status Utama
- Shipment: draft, approved, booked, in_transit, arrived, delivered, completed, cancelled
- PO Vendor: draft, approved, sent, fulfilled, closed

## Moda Milestones
- Darat: pickup, departed, arrived_city, out_for_delivery, delivered
- Laut: booking, gate_in, vessel_departed, vessel_arrived, discharged, delivered
- Udara: booking, accepted, flight_departed, flight_arrived, released, delivered

## Responsive Notes
- Tracking list harus prioritaskan job number, customer, route, status, ETA
- Shipment detail di mobile memakai stacked cards, bukan tabel lebar
- Action dokumen dan update milestone harus mudah dijangkau dengan thumb on mobile
