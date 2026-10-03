# Buku Kas Bersama

Website statis untuk GitHub Pages. Pemilik awal: **prasojob10@gmail.com**.

Baca **[PANDUAN.html](PANDUAN.html)** atau **[PANDUAN.md](PANDUAN.md)** untuk 20 bagian petunjuk dari nol.

1. Buat spreadsheet kosong dengan akun pemilik.
2. Upload file situs ke akar repository GitHub Public dan aktifkan Pages dari main / root.
3. Buat Google Cloud project, aktifkan Sheets API, atur OAuth External dan test users.
4. Buat OAuth Web Client dengan origin https://USERNAME.github.io.
5. Isi clientId dan spreadsheetId di config.js. Tidak memerlukan Client Secret.
6. Login di situs Pages, siapkan tab Buku Kas, lalu Perbarui.
7. Beri anggota izin Editor di spreadsheet dan tambahkan sebagai OAuth test users.

Tidak ada build step, Apps Script, backend server, atau akun ChatGPT untuk pengguna.

Data disimpan sebagai append-only event log (berdasarkan konvensi aplikasi; Editor file dapat mengubahnya). Jangan menjumlahkan kolom nominal mentah di log. Gunakan laporan web/CSV untuk hasil transaksi aktif. Edit bersamaan memerlukan peninjauan konflik. Cache/antrean lokal tidak terenkripsi; satu tab per akun.

Kode siap dikonfigurasi, belum diterbitkan ke akun pengguna dan belum diuji memakai kredensial Google nyata. Lihat panduan untuk keterbatasan offline, Google Testing, izin luas Sheets OAuth, kuota, serta pencabutan akses.

## File yang perlu diterbitkan

index.html, style.css, app.js, core.js, config.js, PANDUAN.html. README.md, PANDUAN.md, dan .nojekyll dapat ikut diterbitkan. tests dan preview tidak diperlukan.

## Pengujian pengembang

`node tests/core.test.cjs` memeriksa reducer, benturan edit, duplikasi, penghapusan, saldo, validasi, dan CSV.

`node tests/browser.test.cjs` membutuhkan Node.js, Playwright, dan Chromium. Uji ini memakai respons Google tiruan, bukan login nyata. Sesuaikan resolusi dependency Playwright pada lingkungan Anda.
