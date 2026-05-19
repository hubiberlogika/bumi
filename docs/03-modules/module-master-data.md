# Module Master Data

## Tujuan
Menyediakan data referensi yang dipakai semua domain bisnis dan menjaga konsistensi lintas cabang.

## Halaman Inti
- Mitra
- Branches
- Services
- Routes
- Users and Roles
- Settings

## Kemampuan Utama
- Menyimpan customer, vendor, transporter, consignee, dan shipper
- Menyimpan cabang dan pengaturan numbering
- Menyimpan service types, transport modes, route references, dan charge master
- Mengelola user, role, permission, dan branch access
- Menyimpan company settings, bank account, tax, dan template dokumen

## Aturan Utama
- Satu partner dapat memiliki banyak role
- Branch ownership harus melekat pada user dan transaksi
- Permission harus berbasis domain, bukan hanya halaman
- Settings global dan settings cabang harus dibedakan

## Responsive Notes
- Form mitra harus dipecah menjadi data umum, alamat, role, finance, dan notes
- Tabel user dan role perlu filter yang sederhana di mobile
