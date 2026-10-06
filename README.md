# Buku Kas Bersama v2 — patch GitHub Pages

Pemilik awal: prasojob10@gmail.com.

**Paket ini adalah pembaruan untuk repository lama, tidak memuat config.js. Pertahankan config.js yang sudah terisi di GitHub.**

Unggah index.html, app.js, core.js, style.css, sheets.js, PANDUAN.html (dan panduan/README jika diperlukan) ke akar repository yang sama. Tunggu deployment, muat ulang, login pemilik, klik **Perbarui struktur spreadsheet** sekali.

- Hapus transaksi juga menghapus barisnya dari tabel pada tab Buku Kas setelah sinkronisasi berhasil.
- Reset web ke Rp0 memulai periode baru bersama; transaksi lama tetap ada di spreadsheet sebagai arsip.
- Riwayat sumber dan cadangan v1 disimpan terpisah pada tab tersembunyi. Hapus bukan penghapusan permanen semua jejak.
- Sheet lain dan konfigurasi OAuth tetap dipakai. Migrasi tidak menimpa header/format yang tidak dikenali.

Baca [PANDUAN.html](PANDUAN.html) atau [PANDUAN.md](PANDUAN.md) sebelum migrasi. Semua anggota harus memuat ulang kode baru dan menyelesaikan antrean lama terlebih dahulu.

## Pengujian pengembang

Jalankan dengan Node.js 18+:

```text
node tests/core.test.cjs
node tests/v2.test.cjs
node tests/app.test.cjs
```

Pengujian memakai data/API/DOM tiruan: migrasi v1, cadangan, idempotensi, penghapusan sel pada tabel, arsip tetap setelah reset, periode bersama, benturan/reset bersamaan, respons hilang, antrean offline, penolakan header tak dikenal, dan kegagalan storage. Tidak ada data/kredensial Google asli. Uji DOM tidak memverifikasi layout browser.

Sumber data adalah log append-only menurut konvensi aplikasi. Tabel Buku Kas adalah proyeksi seluruh transaksi yang belum dihapus pada semua periode. Periksa kembali log setelah publish dan bangun ulang jika ada perubahan bersamaan; refresh berikutnya memperbaiki proyeksi setelah kegagalan jaringan. Jangan mengedit tab sumber/proyeksi secara manual. Hak Editor tidak dibatasi oleh peran backend; anggota harus tepercaya.
