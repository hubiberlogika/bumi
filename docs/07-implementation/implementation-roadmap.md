# Implementation Roadmap

## Phase 1: Foundation
- Finalisasi information architecture
- Pisahkan config navigasi dari komponen UI
- Buat folder domain target di `src/features`
- Siapkan placeholder route untuk domain utama
- Rapikan shell responsif desktop dan mobile

## Phase 2: Commercial
- Implement Quotations
- Implement quotation approval flow

## Phase 3: Operations
- Implement Shipments
- Implement Tracking milestones
- Implement Documents center
- Implement Vendor assignment dan Vendor PO

## Phase 4: Finance
- Implement Invoices
- Implement AR dan AP
- Implement Payments
- Implement Journals dan report dasar

## Phase 5: Hardening
- Implement Master Data lengkap
- Tambahkan role-based access yang lebih rinci
- Selesaikan responsive QA dan UAT
- Tambahkan audit trail dan filter global

## Delivery Principles
- Rilis per domain, bukan per komponen kecil
- Validasi mobile dilakukan di setiap phase
- Jangan mulai finance sebelum entity shipment dan buying cost stabil
