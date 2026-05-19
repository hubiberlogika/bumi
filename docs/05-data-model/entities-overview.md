# Entities Overview

## Commercial
- Submission
- Prospect
- Quotation
- Contract

## Operations
- Shipment
- Shipment Leg
- Vendor Assignment
- Vendor Purchase Order
- Milestone
- Operational Document

## Finance
- Customer Invoice
- Vendor Bill
- AR Entry
- AP Entry
- Payment
- Journal Entry

## Master Data
- Partner
- Branch
- Service
- Route
- User
- Role
- Permission

## Shared Keys
- branch_id
- customer_id
- vendor_id
- quotation_id
- shipment_id
- job_number
- status
- created_by
- approved_by
- approved_at

## Data Principles
- Job number menjadi referensi lintas domain
- Status harus dinormalisasi dan terdokumentasi
- Audit fields wajib ada pada transaksi utama
- Lampiran dan dokumen harus terkait entity parent yang jelas
