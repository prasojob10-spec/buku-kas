# Pembaruan Buku Kas Bersama — Hapus & Reset Web

Pemilik konfigurasi: **prasojob10@gmail.com**. Versi 2 · 6 Oktober 2026.

## 1. Apa yang berubah?

| Tombol | Hasil di web | Hasil di spreadsheet |
|---|---|---|
| Hapus pada transaksi | Transaksi dihapus dari periode aktif | Transaksi dihapus dari tabel pada tab **Buku Kas** setelah sinkronisasi berhasil |
| Reset web ke Rp0 | Semua transaksi periode lama disembunyikan; saldo, pemasukan, dan pengeluaran kembali nol | Transaksi lama tetap ada pada tab **Buku Kas** sebagai arsip periode lama |
| Hapus salinan lokal akun ini | Menghapus cache browser dan keluar | Tidak menghapus transaksi, arsip, atau pengaturan periode |

Reset berlaku bersama untuk semua anggota buku kas setelah mereka menekan Perbarui. Reset tidak hanya berlaku di HP pemilik. Membuka browser lain, masuk lagi, atau menghapus cache tidak membatalkan periode baru.

Tab **Buku Kas** sekarang menjadi tabel transaksi yang berlaku, dengan kolom tanggal, jenis, nominal, kategori, catatan, pencatat, serta periode. Pemasukan/pengeluaran dapat dilihat langsung tanpa harus membaca baris peristiwa teknis. Transaksi yang telah dihapus tidak muncul di tabel ini. Satu transaksi yang diedit hanya muncul dengan nilai terakhir yang diterima.

## 2. Paket pembaruan sengaja tidak memuat config.js

ZIP yang Anda kirim memiliki `clientId` dan `spreadsheetId` kosong. Agar sambungan yang sudah bekerja di GitHub tidak terganti nilai kosong, **paket pembaruan ini tidak menyertakan config.js**.

Jangan menghapus atau mengganti `config.js` yang sudah terisi di repository GitHub. File tersebut tetap dipakai oleh versi baru. Client ID, Spreadsheet ID, akun pemilik, origin OAuth, dan URL GitHub Pages yang sama tetap digunakan. Tidak perlu membuat project Google atau spreadsheet baru untuk pembaruan ini.

Paket pembaruan bukan paket instalasi mandiri tanpa konfigurasi: jika dipasang ke repository yang sama sekali baru, Anda perlu menambahkan config.js dari instalasi lama yang sudah diisi.

## 3. Sebelum memperbarui

1. Minta semua anggota menyimpan formulir yang terbuka.
2. Pada versi lama, tekan **Perbarui & kirim antrean** sampai tidak ada transaksi menunggu.
3. Unduh CSV bulan yang penting sebagai cadangan tambahan jika diperlukan.
4. Pemilik dapat membuka Google Sheets → **File → Make a copy / Buat salinan** untuk cadangan seluruh file.
5. Jangan menghapus data browser. Antrean lama tetap dibaca memakai kunci browser versi sebelumnya.
6. Setelah Anda memasang pembaruan, minta anggota memuat ulang website; jangan membiarkan halaman versi lama terus digunakan saat struktur spreadsheet dimigrasikan.

Aplikasi baru memeriksa struktur sebelum menulis. Jika struktur tidak dikenali, data tidak ditimpa dan aplikasi menampilkan pesan kesalahan.

## 4. Unggah pembaruan ke GitHub

1. Unduh ZIP pembaruan, lalu ekstrak di komputer.
2. Buka repository GitHub yang sedang digunakan. Pilih tab **Code**.
3. Klik **Add file → Upload files**.
4. Unggah file di bawah langsung ke akar repository, pada lokasi yang sama dengan index.html lama:

| File | Tindakan |
|---|---|
| index.html | Ganti versi lama |
| app.js | Ganti versi lama |
| core.js | Ganti versi lama |
| style.css | Ganti versi lama |
| sheets.js | Tambahkan; file baru yang wajib ada |
| PANDUAN.html | Ganti agar bantuan di website sesuai versi baru |
| PANDUAN.md | Ganti panduan teks |
| README.md | Ganti ringkasan |

Folder **tests** dan **PENGUJIAN.md** tidak perlu diunggah. Jangan upload ZIP saja dan jangan membungkus seluruh file di folder tambahan. **config.js yang ada di GitHub harus tetap ada dan tidak diubah.**

5. Isi pesan commit, misalnya **Pembaruan hapus spreadsheet dan reset periode**.
6. Klik **Commit changes** ke branch main.
7. Buka tab **Actions**. Tunggu deployment Pages terbaru selesai dan bertanda hijau.
8. Buka URL website yang sama. Di komputer, tekan **Ctrl+Shift+R**. Di HP, muat ulang halaman. Jika tombol baru belum muncul, pastikan deployment terbaru berhasil dan kelima file kode benar-benar diperbarui.

Tidak perlu mengganti Settings → Pages, origin OAuth, atau tautan yang sudah dibagikan.

## 5. Perbarui struktur spreadsheet sekali

1. Buka web baru, lalu **Masuk dengan Google** sebagai **prasojob10@gmail.com**, atau email pemilik yang benar pada config.js Anda.
2. Pada pemakaian pertama versi 2, Anda akan melihat tombol **Perbarui struktur spreadsheet**.
3. Klik tombol tersebut dan baca konfirmasi.
4. Klik **OK**. Jangan menutup halaman saat proses berjalan.
5. Aplikasi akan mempertahankan data versi lama, menyiapkan tabel transaksi baru, lalu memperbarui tampilan.
6. Tunggu pesan bahwa **Web dan tabel Buku Kas diperbarui**.
7. Buka spreadsheet untuk memastikan tab **Buku Kas** kini berisi kolom **ID Transaksi, Tanggal, Jenis, Nominal Rupiah, Kategori, Catatan, Pencatat, Waktu Perubahan, Periode**.

Untuk file versi lama, aplikasi membuat cadangan tab lama secara otomatis, lalu memindahkan riwayat ke tab teknis tersembunyi **_Riwayat Buku Kas**. Tab **Buku Kas** menjadi tabel yang dapat dibaca langsung. Tab lain yang tidak terkait tidak diubah.

Jika koneksi terputus saat migrasi, masuk lagi dan tekan Perbarui. Migrasi menggunakan permintaan batch; bila sudah diterapkan, pemanggilan ulang akan mengenali struktur baru dan tidak menggandakan cadangan. Jika ditemukan header/format lain yang tidak sesuai, aplikasi berhenti untuk melindungi data. Jangan menghapus tab untuk memaksa proses.

## 6. Cara menghapus transaksi

1. Pilih bulan transaksi pada web.
2. Temukan transaksi di **Riwayat transaksi**.
3. Klik **Hapus** pada transaksi yang benar.
4. Periksa kategori dan nominal pada konfirmasi.
5. Klik **OK**.
6. Tunggu sinkronisasi selesai.
7. Buka spreadsheet → tab **Buku Kas**. Baris transaksi tersebut sekarang tidak ada dalam tabel.

Jika ada masalah internet, perubahan masuk antrean lokal. Penghapusan di Google baru berlaku ketika perubahan berhasil diterima dan tabel berhasil diperbarui. Jangan menambahkan ulang atau menghapus ulang hanya karena koneksi sedang gagal; tekan **Perbarui & kirim antrean** setelah pulih.

Jika transaksi sudah hilang di web tetapi tabel spreadsheet belum berubah, lihat pesan kesalahan dan tekan Perbarui lagi. Sumber riwayat dapat sudah menerima perubahan sementara pembaruan tabel belum selesai. Pembaruan berikutnya menyusun ulang tabel dari sumber tersebut.

**Hapus bukan pemusnahan permanen semua jejak:** baris di tabel transaksi Buku Kas dihapus, tetapi riwayat teknis dan cadangan terpisah tetap ada untuk pemulihan. Tab tersembunyi tidak memberikan keamanan tambahan terhadap Editor; Editor tetap dapat membuka dan mengubahnya. Jangan menghapus riwayat teknis secara manual karena seluruh web bergantung padanya.

## 7. Cara reset web ke nol, spreadsheet tetap ada

1. Pastikan semua antrean Anda sudah selesai. Tombol reset tidak dapat dipakai jika masih ada perubahan menunggu.
2. Masuk sebagai pemilik. Tombol **Reset web ke Rp0** ditampilkan pada akun pemilik sesuai config.js.
3. Klik **Reset web ke Rp0**.
4. Aplikasi memperbarui data terlebih dahulu; reset memerlukan koneksi Google yang berhasil.
5. Baca konfirmasi: reset berlaku untuk seluruh anggota dan data lama tetap tersimpan di spreadsheet.
6. Klik **OK**.
7. Setelah reset diterima, daftar transaksi web periode aktif kosong. Saldo awal/akhir, pemasukan, dan pengeluaran periode baru menjadi nol.
8. Informasi **Periode aktif dimulai ...** akan tampil di bagian atas.
9. Buka tab **Buku Kas** di spreadsheet. Transaksi lama tetap ada. Kolom **Periode** membedakan transaksi awal dan transaksi yang dibuat pada setiap periode reset.
10. Anggota lain menekan **Perbarui & kirim antrean** untuk memakai periode baru.

Contoh: sebelum reset ada pemasukan Rp100.000 dan pengeluaran Rp20.000. Saldo web Rp80.000. Setelah reset, saldo web Rp0 dan tabel web kosong, tetapi dua transaksi lama tetap ada di spreadsheet. Jika Anda menambah pemasukan Rp30.000 setelah reset, saldo web menjadi Rp30.000. Spreadsheet menyimpan dua transaksi lama dan transaksi baru.

Reset tidak menghapus semua baris pada sheet dan tidak mengubah transaksi lama menjadi Rp0. Reset menyimpan penanda periode baru di sumber bersama. Ini juga berarti bulan laporan yang sama dapat memiliki dua periode; kartu web hanya menghitung periode aktif. Pengisian tanggal mundur pada transaksi baru tetap masuk periode aktif.

Transaksi periode lama tidak ditampilkan untuk edit/hapus melalui web periode baru. Arsip hanya dapat dibaca pada spreadsheet. Pada versi ini belum ada tombol kembali ke periode lama atau membatalkan reset. Reset lagi akan memulai periode berikutnya; tidak menghapus arsip sebelumnya.

## 8. Konflik, koneksi, dan perangkat lain

- Semua anggota harus memakai kode versi baru. Jangan menjalankan tab versi 1 yang masih terbuka setelah migrasi.
- Perubahan antarperangkat terlihat setelah Perbarui; bukan pembaruan otomatis waktu nyata.
- Jika anggota masih menulis formulir lama ketika pemilik reset, transaksi itu tidak langsung dimasukkan ke periode baru tanpa peninjauan. Aplikasi menampilkan konflik periode.
- **Tinjau & terapkan ulang** dapat menyimpan isinya sebagai transaksi baru di periode aktif setelah pengguna menyetujui. Arsip lama tidak diganti. Antrean penghapusan dari periode lama tidak diterapkan ke arsip lewat periode baru; buang antrean tersebut.
- Reset bersamaan dari dua perangkat juga diperiksa. Perubahan yang berbenturan membutuhkan peninjauan; tidak melakukan reset tambahan diam-diam.
- Jika respons Google terputus setelah menerima perubahan, ID peristiwa digunakan untuk memastikan perubahan yang sama tidak dihitung dua kali.
- Antrean lokal hanya berada pada akun/browser/perangkat asalnya. Gunakan satu tab aplikasi per akun dan jangan hapus data browser sebelum antrean selesai.
- Reset yang responsnya terputus dapat tetap muncul di antrean. Jangan reset lagi; tekan Perbarui untuk memeriksa apakah reset sudah diterima.
- Riwayat adalah sumber data utama; tabel Buku Kas adalah tampilan yang disusun ulang. Saat banyak anggota menulis bersamaan, aplikasi memeriksa kembali sumber setelah memperbarui tabel. Jika perubahan terus berlangsung atau sambungan terputus, Perbarui lagi diperlukan. Data tidak hilang hanya karena tabel tertinggal.

## 9. Spreadsheet dan izin

Spreadsheet tetap menggunakan akses **Restricted / Dibatasi**. Anggota yang menulis tetap perlu akses **Editor**, dan test users OAuth selama status Testing. Tidak ada perubahan scope Google pada versi baru ini.

Jangan mengedit, menyortir fisik, mengganti header, atau menghapus baris pada **_Riwayat Buku Kas**. Jangan menambahkan baris manual ke **Buku Kas**, karena aplikasi menyusun ulang tabel ini pada sinkronisasi. Untuk analisis tambahan, buat tab lain yang merujuk data Buku Kas atau unduh CSV. CSV dari web hanya memuat periode aktif dan filter bulan/pencarian/jenis yang Anda pilih.

Cadangan versi lama dan riwayat teknis disembunyikan agar tidak tertukar dengan laporan. Pemilik dapat melihatnya melalui **View / Tampilan → Hidden sheets / Sheet tersembunyi**. Menjumlahkan nominal pada riwayat teknis tetap tidak menghasilkan laporan yang benar, karena ada revisi dan penghapusan. Tabel Buku Kas sudah memuat satu nilai terakhir untuk setiap transaksi yang belum dihapus; pilih periode yang sesuai jika ingin menjumlahkan satu periode.

Tombol reset hanya ditampilkan untuk email pemilik pada UI. Ini bukan sistem peran backend yang ketat: semua Editor merupakan anggota tepercaya dan secara teknis dapat mengubah file Google atau kode client. Google tetap menentukan akses file. Pengaturan ini cocok untuk kelompok kecil tepercaya.

## 10. Penyelesaian masalah

| Gejala | Tindakan |
|---|---|
| “Isi config.js” setelah upload | config.js lama terhapus/terganti. Pulihkan Client ID dan Spreadsheet ID yang sudah benar. Paket update tidak memuat file itu. |
| Tombol baru tidak terlihat | Tunggu deployment Actions selesai lalu muat ulang tanpa cache; pastikan index.html dan app.js versi baru di akar repository. |
| `KasSheets` tidak tersedia / halaman tidak berjalan | sheets.js belum diunggah, atau file lama/campuran masih dimuat. Unggah semua file kode pembaruan dan muat ulang. |
| Diminta memperbarui struktur | Login sebagai pemilik dan klik Perbarui struktur spreadsheet sekali. |
| Tombol migrasi/reset tidak muncul | Periksa Gmail yang sedang login dan ownerEmail pada config.js. |
| Format/header tidak dikenali | Aplikasi tidak menimpa data. Kirim screenshot header serta pesan kesalahan untuk diperiksa. |
| Akses ditolak | Pastikan akun Editor, Sheets API aktif, izin OAuth disetujui, dan test user terdaftar. |
| Web sudah berubah, spreadsheet belum | Tekan Perbarui lagi setelah koneksi pulih. Tabel perlu disinkronkan dari riwayat. |
| Saldo lama muncul setelah reset | Muat ulang versi terbaru dan tekan Perbarui; pastikan spreadsheet yang dibuka adalah file yang sama. |
| Reset tidak bisa diklik | Selesaikan seluruh antrean dahulu, lalu periksa sambungan Google. |
| Spreadsheet berisi data lama setelah reset | Itu memang perilaku yang diminta: data lama tetap arsip. Web hanya menunjukkan periode baru. |
| Sesi Google habis | Klik Sambungkan kembali dengan akun yang sama. |

Kode ini telah diuji melalui simulasi API dan antarmuka, bukan kredensial Google nyata. Deployment repository Anda serta operasi Google nyata perlu diperiksa sesudah Anda mengunggah dan menekan migrasi. Aplikasi tidak pernah menghubungi spreadsheet pribadi Anda dari proses pembuatan paket ini.
