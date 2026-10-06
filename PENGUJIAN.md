# Pengujian versi 2 — 6 Oktober 2026

Lulus pemeriksaan sintaks app.js, core.js, dan sheets.js.

Lulus Node core.test: saldo bulanan, validasi rupiah/tanggal, revisi, penghapusan, duplikasi, konflik, CSV.

Lulus v2.test dengan Google Sheets API tiruan: migrasi versi 1 tanpa kehilangan log, cadangan asli, migrasi idempotent, sel transaksi dihapus dari tabel Buku Kas, seluruh arsip tabel tetap sama setelah reset, pemasukan periode baru dimulai dari nol, konflik reset/antrean periode lama, perubahan bersamaan saat publikasi tabel, pemulihan append yang balasannya hilang, deduplication, koneksi gagal, header tidak dikenal ditolak, inisialisasi file kosong.

Lulus app.test dengan DOM/API/storage tiruan yang menjalankan kode aplikasi asli: pembatasan migrasi, tombol hapus memperbarui tabel, reset dan saldo nol, reset bersama yang bertahan setelah ganti akun serta hapus cache, anggota tidak melihat tombol reset, transaksi baru, larangan reset dengan antrean, antrean reset dapat ditinjau, formulir lama sesudah reset tidak menimpa arsip, kegagalan storage tidak mengaku menyimpan.

Belum diuji pada sesi Google nyata, spreadsheet/repository pengguna, atau browser fisik setelah revisi ini. Lingkungan uji kali ini tidak memiliki binary browser; uji DOM bukan screenshot/layout. Tidak ada data keuangan asli atau rahasia dalam paket.
