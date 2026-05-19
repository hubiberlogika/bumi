# Responsive Rules

## Prinsip Umum
- Desktop-first untuk operasional berat, mobile-friendly untuk monitoring dan aksi cepat
- Semua layar harus tetap usable tanpa horizontal scroll pada viewport kecil
- Aksi utama harus selalu terlihat dalam 1 sampai 2 interaksi

## Layout
- Desktop memakai sidebar tetap dan header sticky
- Tablet memakai sidebar collapse atau rail
- Mobile memakai bottom navigation dan sheet untuk menu sekunder

## Data Display
- Tabel transaksi wajib punya mobile card alternative
- Status, nominal, customer, dan job number harus muncul pada area atas card
- Summary metrics harus turun ke 1 kolom di mobile

## Forms
- Form panjang dibagi per section
- Field penting seperti branch, customer, route, mode, dan amount harus muncul lebih awal
- Action footer pada mobile harus sticky bila form panjang

## Filters and Search
- Filter lanjutan ditempatkan di collapsible panel atau bottom sheet
- Search global harus mampu mencari nomor dokumen dan nama partner

## Validation
- Error message harus spesifik dan dekat dengan field
- Status disabled button harus jelas alasan dan dependensinya
