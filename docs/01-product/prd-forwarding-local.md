# PRD Forwarding Local

## Product Vision
Membangun sistem forwarding lokal yang mengontrol alur order dari pengajuan sampai finance untuk layanan darat, laut, dan udara dengan operasional berbasis vendor pihak ketiga.

## Problem Statement
Operasional forwarding lokal sering tersebar di chat, spreadsheet, dan file manual. Kondisi ini membuat approval lambat, status shipment tidak sinkron, biaya vendor sulit dilacak, dan profit per job tidak transparan.

## Goals
- Menyatukan proses commercial, operations, dan finance
- Menyediakan kontrol multi-cabang dengan role-based access
- Menyimpan selling dan buying pada level job
- Mempercepat pembuatan dokumen transaksi dan monitoring status
- Menyediakan visibilitas profitabilitas per job dan per cabang

## Success Metrics
- Minimal 95% order diproses lewat sistem
- Waktu pengajuan ke quotation turun 50%
- Invoice customer terbit maksimal H+1 dari shipment selesai
- Semua buying vendor tercatat pada job
- Dashboard GP per job tersedia real-time

## Users
- Sales cabang
- Ops cabang
- Branch manager
- Procurement
- Finance cabang
- Finance pusat
- Super admin

## In Scope MVP
- Multi-cabang
- Pengajuan
- Prospects
- Quotations
- Contracts
- Shipment management
- Vendor assignment dan PO
- Document tracking
- Invoice customer
- AP, AR, payments
- Journals dan laporan dasar
- Master data dan pengaturan akses

## Out of Scope MVP
- Integrasi GPS live
- Customer portal
- Mobile app driver
- Integrasi e-faktur
- Integrasi API carrier

## Core Business Rules
- Shipment normal harus berasal dari quotation yang sudah approved
- Satu job dapat memiliki lebih dari satu vendor atau transporter
- Semua revenue dan cost wajib terkait job number
- Approval harus tercatat dengan approver, waktu, dan alasan
- Cabang hanya dapat mengubah transaksi miliknya sesuai role
- Data pusat harus dapat dikonsolidasikan lintas cabang

## Responsive Requirement
Produk harus mobile-friendly. Semua halaman transaksi wajib memiliki versi card atau stacked layout pada layar kecil. Navigasi mobile harus fokus pada domain utama: Home, Commercial, Ops, Finance, dan More.
