# Buku Kas Bersama — panduan dari nol

**Pemilik yang digunakan: prasojob10@gmail.com**  
Versi: GitHub Pages + Google Sheets API · 3 Oktober 2026

Paket ini berisi website HTML, CSS, dan JavaScript yang dapat diunggah langsung ke GitHub. Tidak perlu menjalankan npm, membeli domain, atau menyewa server. Anda tetap perlu melakukan pengaturan Google dan GitHub sekali agar login serta penyimpanan dapat bekerja.

**Status paket:** kode siap dikonfigurasi. Situs belum diterbitkan ke akun GitHub Anda. Dua nilai di `config.js` masih kosong karena Client ID Google yang baru dan ID spreadsheet Anda belum diberikan. Pengujian lokal menggunakan simulasi layanan Google; keberhasilan login pada akun nyata harus diperiksa setelah langkah pemasangan selesai.

## 1. Hasil yang akan Anda dapatkan

- Website responsif untuk HP, tablet, dan komputer.
- Masuk memakai akun Google; anggota tidak membutuhkan akun ChatGPT ataupun akun GitHub untuk menggunakan website.
- Tambah, edit, dan hapus pemasukan/pengeluaran dengan tanggal, nominal rupiah, kategori, serta catatan.
- Laporan bulanan: saldo awal, pemasukan, pengeluaran, saldo akhir.
- Pencarian, filter jenis, dan unduhan CSV sesuai filter aktif.
- Data bersama disimpan pada spreadsheet milik `prasojob10@gmail.com`.
- Antrean di browser jika penyimpanan ke Google gagal. Antrean dikirim saat Anda menekan **Perbarui & kirim antrean**.
- Pemeriksaan benturan perubahan apabila anggota mengedit transaksi yang sama.

Alamat akhirnya berbentuk **https://USERNAME.github.io/buku-kas/**. `USERNAME` adalah nama pengguna GitHub Anda; bukan alamat Gmail dan belum tentu `prasojob10`. Semua contoh USERNAME dalam panduan harus diganti dengan nama yang benar.

GitHub Pages tersedia untuk repositori publik di paket GitHub Free. Pemakaian standar Sheets API saat panduan ini dibuat tidak dikenakan biaya tambahan dalam kuota standar. Kebijakan layanan dapat berubah; dokumentasi Google menyebut rencana biaya untuk penggunaan yang melampaui kuota pada 2026. Paket ini tidak membutuhkan layanan Cloud berbayar atau peningkatan kuota. Akses tetap bergantung pada internet, ketersediaan GitHub/Google, dan kuota layanan; bukan jaminan aktif tanpa gangguan.

## 2. Pahami tempat penyimpanan dan izin

| Bagian | Fungsinya | Siapa yang dapat melihat |
|---|---|---|
| GitHub repository publik | Menyimpan kode website | Semua orang |
| GitHub Pages | Menampilkan website melalui HTTPS | Semua orang dapat membuka halaman login |
| Google OAuth | Meminta login dan izin Google Sheets | Setiap anggota memakai akunnya sendiri |
| Google Sheets | Menyimpan riwayat perubahan transaksi | Pemilik dan akun yang memperoleh izin dari Google |
| Penyimpanan browser | Cache serta antrean belum terkirim | Tersimpan pada perangkat/browser yang dipakai |

**Publik pada GitHub tidak berarti spreadsheet harus publik.** Pada Google Sheets, biarkan **General access / Akses umum = Restricted / Dibatasi**. Tidak perlu memilih “Anyone with the link”.

Login dan izin file adalah dua hal berbeda: seseorang dapat berhasil memilih akun Google tetapi tetap ditolak oleh spreadsheet jika belum dibagikan kepadanya. Setiap anggota yang ingin menulis perlu izin **Editor**.

Tidak ada password aplikasi bersama. Tidak ada kunci sambungan, Apps Script, deployment `/exec`, iframe, ataupun Client Secret dalam versi ini. `ownerEmail` hanya menentukan label dan tombol bantuan awal; keamanan file tetap ditegakkan oleh Google Sheets, bukan menyembunyikan alamat email di JavaScript.

## 3. Siapkan bahan sebelum mulai

1. Akun Google **prasojob10@gmail.com**, dengan akses masuk yang aktif.
2. Akun GitHub. Jika belum ada, daftar melalui [github.com](https://github.com/).
3. ZIP paket website ini, kemudian ekstrak. Mengunggah file ZIP saja tidak akan membuat situs berjalan.
4. Browser Chrome, Edge, Firefox, atau Safari versi modern. Laptop lebih mudah untuk pengaturan awal; pemakaian hariannya bisa di HP.
5. Tempat mencatat tiga nilai: **GitHub username**, **Spreadsheet ID**, dan **Google OAuth Client ID**.

Pastikan akun Google pada pojok kanan atas memang `prasojob10@gmail.com` saat membuat spreadsheet dan project. Jangan memakai akun pemilik lama dari panduan sebelumnya.

## 4. Buat spreadsheet milik akun yang benar

1. Buka [Google Sheets](https://sheets.google.com/).
2. Klik foto profil kanan atas. Pilih **prasojob10@gmail.com**.
3. Klik **Blank / Kosong** untuk membuat spreadsheet baru.
4. Ubah nama menjadi **Buku Kas Bersama**.
5. Biarkan tab pertama kosong. Aplikasi akan membuat tab khusus bernama **Buku Kas** pada tahap pengujian.
6. Perhatikan URL di bilah alamat. Bentuknya seperti:

```text
https://docs.google.com/spreadsheets/d/ID_SPREADSHEET_ANDA/edit#gid=0
```

7. Salin hanya bagian `ID_SPREADSHEET_ANDA`, yaitu teks setelah `/d/` dan sebelum `/edit`. Jangan sertakan `/edit`, `#gid=0`, spasi, atau seluruh URL.
8. Klik **Share / Bagikan** dan pastikan **General access = Restricted**. Pemilik yang tercantum harus akun yang Anda maksud.

Mengganti email pada `config.js` tidak memindahkan kepemilikan spreadsheet. Karena itu membuat file baru dari akun yang benar adalah langkah paling jelas.

## 5. Buat repository GitHub dan unggah file

1. Masuk ke [GitHub](https://github.com/).
2. Klik tanda **+** di kanan atas → **New repository**.
3. Isi **Repository name** dengan `buku-kas`.
4. Pilih **Public** agar dapat menggunakan GitHub Pages pada akun Free.
5. Aktifkan **Add a README file**, lalu klik **Create repository**.
6. Pada halaman repository, klik **Add file → Upload files**.
7. Dari folder ZIP yang sudah diekstrak, unggah file berikut **langsung ke akar repository**, bukan di dalam folder pembungkus:

| File | Kegunaan |
|---|---|
| `index.html` | Halaman utama |
| `style.css` | Tampilan desktop dan HP |
| `app.js` | Login, sambungan Google, dan interaksi aplikasi |
| `core.js` | Validasi, penghitungan, dan pengolahan riwayat |
| `config.js` | Dua pengaturan yang harus diisi |
| `PANDUAN.html` | Panduan yang dapat dibuka dari website |
| `PANDUAN.md` | Panduan versi teks untuk dibaca di GitHub |
| `README.md` | Ringkasan project |
| `.nojekyll` | Memastikan file statis disajikan langsung; jika tidak terlihat, file ini tidak wajib untuk struktur sederhana ini |

8. Isi pesan commit, misalnya `Tambahkan website buku kas`, lalu klik **Commit changes**.
9. Pastikan pada tab **Code** Anda langsung melihat `index.html`. Jika yang terlihat hanya folder `buku-kas-github-baru`, pindahkan/upload ulang **isi foldernya** ke akar repository.

Folder `tests` dan gambar `preview` bukan kebutuhan website. Tidak perlu mengunggahnya. Jangan mengunggah CSV berisi data keuangan asli, token akses, password, Client Secret, atau berkas kredensial Google ke repository publik.

## 6. Aktifkan GitHub Pages

1. Di repository **buku-kas**, buka **Settings**.
2. Pada menu samping, buka **Pages** di bagian **Code and automation**.
3. Di **Build and deployment**, atur **Source = Deploy from a branch**.
4. Pilih **Branch = main** dan folder **/(root)**.
5. Klik **Save**.
6. Tunggu proses penerbitan selesai. Buka tab **Actions** jika ingin melihat status prosesnya. Waktu penerbitan bisa beberapa menit.
7. Kembali ke **Settings → Pages**, lalu klik **Visit site** ketika alamat situs tersedia.
8. Catat alamat yang benar, misalnya `https://namaanda.github.io/buku-kas/`.

Pada tahap ini halaman seharusnya tampil tetapi memberi pesan **Belum terhubung**. Ini normal karena pengaturan Google belum diisi. Buka alamat HTTPS dari Pages, bukan file `index.html` dengan klik ganda dari folder lokal.

## 7. Buat project Google Cloud

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Pastikan akun kanan atas adalah **prasojob10@gmail.com**.
3. Buka pemilih project di bagian atas, di dekat logo Google Cloud.
4. Klik **New Project / Project baru**.
5. Isi nama project **Buku Kas Bersama**.
6. Untuk akun Gmail pribadi, organisasi biasanya **No organization / Tanpa organisasi**.
7. Klik **Create**, tunggu selesai, lalu pilih project tersebut dari pemilih project.
8. Untuk kebutuhan paket ini, tidak perlu membuat server, mengaktifkan free trial berbayar, atau menambahkan billing untuk layanan lain.

Project Google Cloud adalah tempat mengatur API dan login. Website tetap dihosting GitHub Pages.

## 8. Aktifkan Google Sheets API

1. Pastikan project **Buku Kas Bersama** sedang dipilih.
2. Buka menu **APIs & Services → Library**.
3. Cari **Google Sheets API**.
4. Klik hasil resmi **Google Sheets API**, lalu **Enable / Aktifkan**.
5. Jika yang muncul tombol **Manage / Kelola**, API tersebut sudah aktif.

Anda tidak perlu mengaktifkan Gmail API. Gmail di sini adalah identitas login dan pemilik file, bukan mekanisme pengiriman email. Transaksi masuk ke spreadsheet pada akun tersebut; paket ini tidak mengirim email otomatis.

## 9. Buka Google Auth Platform dan atur aplikasi

**Lokasinya:** buka [Google Auth Platform](https://console.cloud.google.com/auth/overview) setelah memilih project yang benar. Bisa juga gunakan kotak pencarian atas Google Cloud dengan kata **Google Auth Platform**. Jika tampilan akun masih lama, menu terkait dapat berada di **APIs & Services → OAuth consent screen**.

Jika muncul **Get started / Mulai**, klik, lalu isi:

| Kolom | Nilai |
|---|---|
| App name / Nama aplikasi | Buku Kas Bersama |
| User support email | prasojob10@gmail.com |
| Audience / Jenis pengguna | External |
| Contact email / Developer contact | prasojob10@gmail.com |

Ikuti **Next**, tinjau ketentuan Google, lalu **Create**. Untuk Gmail pribadi pilih **External**; pilihan **Internal** umumnya untuk organisasi Google Workspace dan tidak cocok untuk anggota dari Gmail lain.

Setelah dibuat, periksa tiga menu ini:

**Branding** — nama aplikasi dan email pendukung harus benar. Untuk pengujian awal tidak perlu menambahkan logo atau domain khusus. Jika Google meminta homepage/kebijakan untuk tahapan publikasi lanjutan, gunakan halaman nyata yang Anda kelola; jangan mendaftarkan `github.io` sebagai domain milik sendiri.

**Audience** — mulai dengan status **Testing**. Pada **Test users**, klik **Add users** dan tambahkan **prasojob10@gmail.com**, serta Gmail setiap anggota yang akan mencoba aplikasi. Simpan. Akun pemilik project pun sebaiknya dicantumkan secara eksplisit.

**Data Access** — pilih **Add or remove scopes**. Cari Google Sheets API dan pilih:

```text
https://www.googleapis.com/auth/spreadsheets
```

Tambahkan pula cakupan identitas **openid**, **email** (`.../auth/userinfo.email`), dan **profile** (`.../auth/userinfo.profile`) jika belum tercantum. Simpan / Update.

Izin `spreadsheets` dikategorikan sensitif dan dapat mencakup spreadsheet lain yang dapat diakses oleh akun pengguna. Kode paket ini memakai ID yang ditetapkan di `config.js`, tetapi teks izin Google memang lebih luas daripada satu file. Informasi itu juga disampaikan dalam aplikasi. Anggota harus memahami dan menyetujui izin tersebut.

Status Testing cocok untuk mulai dengan kelompok kecil yang sudah Anda tentukan. Google membatasi sampai 100 test users dan otorisasi uji untuk cakupan ini berakhir setelah tujuh hari sehingga persetujuan ulang dapat diminta. Token akses aplikasi sendiri juga berumur pendek: tombol **Sambungkan kembali** adalah bagian dari alur normal.

## 10. Buat OAuth Client ID untuk alamat GitHub

1. Di Google Auth Platform, buka **Clients**.
2. Klik **Create client**.
3. Pilih **Application type = Web application**.
4. Isi nama, misalnya **Buku Kas GitHub Pages**.
5. Di **Authorized JavaScript origins**, klik **Add URI**.
6. Masukkan hanya asal alamat website:

```text
https://USERNAME.github.io
```

Contoh: jika website berada di `https://namaanda.github.io/buku-kas/`, masukkan **https://namaanda.github.io**. Jangan memasukkan `/buku-kas/`, garis miring penutup, `github.com/USERNAME`, atau `http://`.

7. **Authorized redirect URIs** boleh dibiarkan kosong untuk alur pop-up Google Identity Services yang digunakan paket ini.
8. Klik **Create**.
9. Salin **Client ID**, bentuknya berakhir dengan `.apps.googleusercontent.com`.
10. Jangan menyalin **Client Secret** ke website. File ini hanya membutuhkan Client ID yang memang merupakan pengenal publik.

Client ID lama hanya dapat digunakan jika Anda dapat mengelola project pemiliknya, origin-nya sesuai, dan cakupan API sudah benar. Agar langkah dari awal tidak mencampur akun, panduan ini menyarankan Client ID baru dari project `prasojob10@gmail.com`.

## 11. Isi config.js melalui GitHub

1. Kembali ke repository GitHub → tab **Code**.
2. Klik file **config.js**.
3. Klik ikon pensil **Edit this file**.
4. Isi `clientId` dan `spreadsheetId`. Pertahankan tanda kutip serta koma.

```javascript
window.BUKU_KAS_CONFIG = Object.freeze({
  ownerEmail: 'prasojob10@gmail.com',
  clientId: 'CLIENT_ID_ANDA.apps.googleusercontent.com',
  spreadsheetId: 'ID_SPREADSHEET_ANDA'
});
```

Teks kapital di atas hanyalah contoh; ganti dengan nilai asli. Client ID yang Anda salin biasanya sudah berakhiran `.apps.googleusercontent.com`, jadi jangan menambahkannya dua kali. `spreadsheetId` berisi ID saja, bukan alamat lengkap.

5. Klik **Commit changes**. Tulis pesan `Atur sambungan Google`, lalu commit ke `main`.
6. Tunggu penerbitan Pages selesai kembali.
7. Buka website, lalu muat ulang. Di komputer gunakan **Ctrl+Shift+R** bila tampilan masih memakai konfigurasi lama.

Yang ada di repository publik hanya email pemilik, Client ID, dan Spreadsheet ID. Mengetahui ID spreadsheet tidak otomatis memberikan akses file yang dibatasi; Google tetap memeriksa izin pengguna.

## 12. Login pertama dan siapkan tab data

1. Buka alamat website GitHub Pages melalui Chrome/Safari langsung. Hindari browser kecil di dalam WhatsApp, Instagram, atau aplikasi lain bila login Google gagal.
2. Klik **Masuk dengan Google**.
3. Pilih **prasojob10@gmail.com**.
4. Periksa nama aplikasi **Buku Kas Bersama** dan akun project yang Anda buat sendiri.
5. Berikan izin email/profil dan Google Sheets yang diminta.
6. Dalam mode Testing, Google dapat menampilkan peringatan aplikasi belum diverifikasi. Ikuti alur pengujian Google hanya untuk aplikasi milik Anda ini dan test user yang sudah terdaftar. Bila akses benar-benar diblokir, periksa Audience, test users, serta kebijakan akun; jangan mengubah pengaturan keamanan akun secara sembarang.
7. Sesudah login, jika tab data belum ada, dapat muncul kesalahan rentang atau header. Klik **Siapkan tab Buku Kas (pemakaian pertama)** di bagian atas ruang kerja.
8. Konfirmasi. Aplikasi membuat tab **Buku Kas** dan judul kolomnya. Tab lain tidak diubah. Tombol tidak akan menimpa tab yang sudah berisi data.
9. Klik **Perbarui & kirim antrean**.
10. Halaman yang siap digunakan menampilkan identitas akun dan pesan **Data diperbarui**, tanpa pesan akses ditolak.

Uji dengan transaksi kecil: pemasukan Rp10.000 dan pengeluaran Rp2.000 pada bulan yang sama. Saldo akhir semestinya Rp8.000 jika belum ada data lain. Cek dua transaksi di web dan peristiwa terkait di tab spreadsheet. Setelah selesai uji, hapus transaksi contoh dari web agar laporan bersih; riwayat penghapusan tetap tersimpan.

Uji kedua dari HP atau browser lain, masuk dengan akun yang sama, lalu tekan Perbarui. Jika data yang sama muncul, penyimpanan lintas perangkat sudah bekerja.

## 13. Tambahkan anggota dengan Gmail lain

Untuk setiap anggota, lakukan **dua langkah terpisah** berikut.

**A. Beri akses spreadsheet**

1. Pemilik membuka spreadsheet → **Share / Bagikan**.
2. Masukkan alamat Gmail anggota dengan lengkap.
3. Pilih **Editor** agar dapat menambah, mengedit, dan menghapus melalui aplikasi.
4. Kirim undangan akses sesuai pilihan Google Sheets.
5. Biarkan akses umum **Restricted**. Melalui ikon pengaturan berbagi, pemilik dapat menonaktifkan izin Editor untuk mengubah izin/berbagi jika opsi tersebut tersedia.

**B. Izinkan sebagai pengguna uji aplikasi**

1. Pemilik membuka project Google Cloud → **Google Auth Platform → Audience**.
2. Pada **Test users**, tambahkan Gmail anggota yang sama.
3. Simpan.
4. Bagikan URL GitHub Pages kepada anggota melalui saluran Anda sendiri.
5. Anggota membuka URL, klik **Masuk dengan Google**, dan memilih Gmail yang sudah didaftarkan.

Anggota tidak perlu login ke ChatGPT, mempunyai GitHub, atau membuat project Google Cloud sendiri. Setiap anggota menggunakan izin Google miliknya; website tidak menyamar sebagai pemilik.

Untuk mencabut akses, hapus orang tersebut dari **Share** di spreadsheet. Dalam mode Testing, hapus pula dari **Test users**. Ini mencabut akses online berikutnya, tetapi tidak dapat menarik kembali file CSV, screenshot, atau cache lokal yang sudah disimpan anggota sebelumnya.

Versi sederhana ini mempercayakan pengaturan anggota kepada Google Sheets. Semua Editor dapat mengedit transaksi bersama, bukan hanya transaksinya sendiri, dan secara teknis juga dapat mengedit spreadsheet langsung. Ini cocok untuk kelompok yang saling percaya; bukan sistem hak akses kasir/admin yang rumit.

## 14. Pemakaian sehari-hari

**Tambah:** klik **Tambah transaksi**, pilih tanggal dan jenis, masukkan angka rupiah tanpa titik pemisah (contoh `25000`), kategori, dan catatan opsional. Tekan Simpan. Tanggal awal menggunakan WIB; tanggal dapat diganti untuk transaksi lama.

**Edit/hapus:** gunakan tombol di baris transaksi. Perubahan tercatat sebagai peristiwa baru dalam spreadsheet. Hapus menyembunyikan transaksi dari laporan, bukan menghapus jejak riwayat.

**Saldo awal:** dihitung dari pemasukan dikurangi pengeluaran pada semua tanggal sebelum bulan pilihan. Untuk saldo bawaan sebelum mulai menggunakan aplikasi, buat transaksi kategori “Saldo awal” pada tanggal sebelum bulan pertama laporan. Tidak ada kolom saldo awal manual terpisah.

**Laporan:** pilih bulan. Kartu ringkasan selalu menghitung semua kategori pada bulan tersebut. Pencarian serta filter jenis hanya menyaring tabel dan CSV; tidak mengubah kartu ringkasan. Saldo akhir = saldo awal + pemasukan − pengeluaran.

**CSV:** atur bulan, pencarian, dan jenis sesuai keperluan, lalu **Unduh CSV**. Untuk ekspor penuh satu bulan, kosongkan pencarian dan pilih **Semua jenis**. File ini dapat dibuka dengan Excel atau diimpor ke spreadsheet lain. Paket ini belum menyediakan laporan PDF atau pengiriman laporan melalui email otomatis.

**Pembaruan:** perubahan orang lain muncul setelah Anda menekan **Perbarui & kirim antrean**. Tidak ada pembaruan otomatis waktu nyata. Sebelum mengambil keputusan dari saldo, lakukan Perbarui.

**Sesi habis:** klik **Sambungkan kembali**, pilih akun yang sama. Membuka ulang halaman biasanya membutuhkan otorisasi Google lagi; token tidak disimpan permanen di browser.

**Di layar utama HP:** pada Android/Chrome gunakan menu → Tambahkan ke layar utama jika tersedia. Pada iPhone/Safari gunakan Bagikan → Tambahkan ke Layar Utama. Ini pintasan website; aplikasi tidak memasang service worker dan tidak menjanjikan dapat dimulai dari keadaan sepenuhnya offline.

## 15. Jika internet atau Google sedang bermasalah

Sesudah Anda sudah login dan halaman terbuka, transaksi baru disimpan dahulu dalam antrean lokal sebelum dikirim. Jika layanan gagal, aplikasi menampilkan **Menunggu pengiriman**. Saldo hanya memasukkan peristiwa yang telah diterima spreadsheet, agar angka tersimpan dan angka belum tersimpan tidak tercampur.

1. Jangan menambahkan ulang transaksi yang sama hanya karena antrean belum hilang.
2. Pertahankan browser/perangkat yang sama. Jangan menghapus data situs, memakai mode incognito untuk pekerjaan yang perlu dipertahankan, atau mengganti alamat situs sebelum antrean selesai.
3. Setelah internet pulih, tekan **Perbarui & kirim antrean**.
4. Jika sesi Google habis, tekan **Sambungkan kembali** dengan akun yang sama, kemudian Perbarui.
5. Jika server sempat menerima tetapi balasannya terputus, aplikasi memeriksa ID peristiwa sehingga pengiriman ulang dengan ID yang sama tidak dihitung dua kali.
6. Jika ada benturan, pilih **Tinjau & terapkan ulang** untuk membaca versi saat ini lalu menyetujui penggantian, atau **Buang dari antrean** untuk membuang perubahan lokal setelah status online dapat diperiksa.

Antrean **tidak berpindah otomatis ke HP lain**. Cache/antrean disimpan per akun dan per spreadsheet pada origin website yang sama. Data itu tidak dienkripsi oleh aplikasi. Gunakan perangkat pribadi, satu tab aplikasi per akun, dan kirim antrean sebelum berganti perangkat. Kegagalan browser/perangkat atau penghapusan storage dapat menghilangkan antrean yang belum terkirim.

Jika halaman sudah ditutup lalu Anda benar-benar tidak punya internet, paket ini tidak dapat menjamin halaman/login dapat dibuka kembali. Antrean yang sudah tersimpan tetap menunggu sampai halaman dapat dibuka dan akun yang sama masuk kembali. Ini adalah perlindungan untuk transaksi belum terkirim, bukan aplikasi offline penuh.

Pada perangkat bersama, setelah seluruh antrean selesai buka bagian **Tentang akses, penyimpanan, dan anggota** → **Hapus salinan lokal akun ini**. Tombol ini juga mengeluarkan Anda. Keluar biasa hanya mengakhiri sesi aplikasi dan menyembunyikan data; cache serta antrean tetap tersimpan.

## 16. Mengapa spreadsheet berisi riwayat, bukan hanya satu baris per transaksi?

Tab **Buku Kas** adalah catatan peristiwa. Menambah transaksi menghasilkan satu baris, mengedit menghasilkan baris baru, dan menghapus menghasilkan baris baru lagi. Kolomnya adalah ID Peristiwa, ID Transaksi, Versi Sebelumnya, Aksi, Tanggal, Jenis, Nominal Rupiah, Kategori, Catatan, Akun Pencatat, serta Waktu Kirim.

Aplikasi membaca urutan riwayat untuk menentukan transaksi yang berlaku. Peristiwa ganda dengan ID sama tidak dihitung dua kali. Jika dua edit berangkat dari versi lama yang sama, hanya edit yang cocok dengan versi terakhir saat diproses yang diterima; yang lain menjadi konflik. Pengguna harus meninjau dan menerapkan ulang dengan sengaja.

**Jangan langsung menjumlahkan kolom Nominal Rupiah pada tab riwayat**, karena edit dan penghapusan akan membuat hasil penjumlahan mentah berbeda dari saldo. Laporan yang berlaku adalah tampilan web dan CSV hasil ekspor. Jangan menyortir fisik, mengganti header, menghapus, atau mengedit baris riwayat secara manual; hal itu dapat mengubah cara riwayat ditafsirkan.

Simpan cadangan berkala melalui **File → Make a copy** di Google Sheets dan unduh CSV laporan. Riwayat ini membantu pemulihan tetapi bukan audit yang kebal perubahan: siapa pun dengan izin Editor tetap dapat mengubah file Google Sheets.

## 17. Penyelesaian masalah

| Gejala | Periksa / lakukan |
|---|---|
| Halaman GitHub 404 | Pages harus aktif dari `main` + `/(root)`, `index.html` ada di akar, deployment Actions selesai, URL repository benar. |
| Halaman tampil tetapi “Belum terhubung” | Isi kedua nilai config.js, commit, tunggu Pages, muat ulang. Jangan buka dari `file://`. |
| `origin_mismatch` | Authorized JavaScript origins harus sama dengan origin yang ditampilkan aplikasi: HTTPS + username.github.io saja, tanpa path repository. Pastikan Client ID yang diedit sama dengan config.js. |
| `invalid_client` / `deleted_client` | Salin ulang Client ID dari Clients pada project yang benar; tipe harus Web application. |
| `redirect_uri_mismatch` | Pastikan memakai paket baru ini dan alur pop-up GIS. Jangan mencampur kode Apps Script/redirect dari versi sebelumnya. |
| `access_denied`, aplikasi masih diuji | Masukkan Gmail yang sedang login ke Audience → Test users. |
| `org_internal` | Audience harus External untuk Gmail pribadi dan pengguna luar organisasi. |
| Google meminta izin lagi | Normal saat sesi/otorisasi habis. Gunakan Sambungkan kembali. |
| Pop-up tidak muncul | Izinkan pop-up; buka di browser utama, bukan browser dalam aplikasi pesan; periksa pemblokir skrip. |
| 403 / akses ditolak | Aktifkan Sheets API pada project Client ID; setujui izin Sheets; pastikan akun adalah Editor file. |
| 404 spreadsheet | ID salah atau file tidak dapat diakses oleh akun itu. Coba buka URL spreadsheet langsung dengan akun yang sama. |
| Unable to parse range / tab tidak ditemukan | Pemilik klik Siapkan tab Buku Kas pada website. |
| Header tidak sesuai | Jangan menimpa data. Periksa apakah tab Buku Kas berasal dari versi lama dengan struktur berbeda. Gunakan spreadsheet baru untuk paket baru ini. |
| 429 / terlalu banyak permintaan | Hentikan klik berulang, tunggu sekitar satu menit lalu coba lagi. Antrean tetap lokal. |
| Angka tidak berubah sesudah simpan | Periksa antrean dan pesan kesalahan; cek bulan transaksi dan filter; tekan Perbarui. |
| Anggota tidak melihat transaksi terbaru | Tekan Perbarui pada perangkat anggota; pastikan config menunjuk spreadsheet yang sama. |
| Antrean tampak hilang | Periksa akun, browser, perangkat, origin GitHub, dan ID spreadsheet; semuanya menentukan tempat penyimpanan lokal. |
| Tampilan lama setelah upload | Tunggu deployment berhasil, lalu muat ulang tanpa cache. |
| Tidak dapat menyimpan antrean lokal | Ruang penyimpanan browser habis/diblokir. Salin isi formulir, periksa storage; jangan menganggap transaksi sudah tersimpan. |

Jika meminta bantuan, kirim teks pesan kesalahan, langkah yang sedang dilakukan, dan URL GitHub Pages. Boleh membagikan Client ID serta Spreadsheet ID untuk mengisi konfigurasi, tetapi jangan membagikan password, Client Secret, cookie, ataupun access token.

## 18. Daftar pemeriksaan akhir

- [ ] Pemilik spreadsheet adalah **prasojob10@gmail.com**.
- [ ] GitHub repository Public dan Pages berhasil diterbitkan.
- [ ] `index.html` ada pada akar repository.
- [ ] Sheets API aktif pada project yang benar.
- [ ] OAuth Audience External; akun pemilik dan anggota ada pada Test users.
- [ ] Client bertipe Web application; origin HTTPS GitHub benar.
- [ ] `config.js` berisi Client ID dan Spreadsheet ID asli.
- [ ] Login pemilik berhasil dan tab Buku Kas berhasil disiapkan.
- [ ] Pemasukan/pengeluaran contoh menghasilkan saldo yang benar.
- [ ] Akun anggota dapat login, membaca, dan menulis setelah dibagikan sebagai Editor.
- [ ] Akun yang tidak diberi akses spreadsheet ditolak saat membaca/menulis.
- [ ] Data dapat dilihat dari perangkat kedua setelah Perbarui.
- [ ] Antrean ketika koneksi gagal dapat terkirim setelah pulih.
- [ ] Semua transaksi uji sudah dihapus melalui aplikasi.

## 19. Batas versi ini dan pengembangan berikutnya

Paket ini ditujukan untuk buku kas pribadi atau kelompok kecil tepercaya. Belum mencakup unggahan nota, login permanen, pembatasan anggota hanya boleh mengedit transaksi sendiri, impor data lama otomatis, email terjadwal, PDF, ataupun halaman offline penuh. Pembacaan riwayat dilakukan utuh sehingga file yang sangat besar akan lebih lambat. Kuota Google dapat membatasi frekuensi pemakaian.

Website publik dapat diakses kapan saja selama layanan dan koneksi tersedia; komputer Anda tidak perlu menyala. Namun mode Testing Google adalah tahap awal: sebelum memperluas ke penggunaan umum, tinjau persyaratan produksi/verifikasi OAuth Google. Mengubah ke Production tidak otomatis membuat aplikasi terverifikasi dan tidak menghilangkan semua batas aplikasi belum diverifikasi. Jangan menjanjikan akses tanpa batas untuk siapa saja dengan konfigurasi pengujian.

## 20. Rujukan resmi

Panduan ditulis ulang untuk paket ini, dengan rujukan pengaturan resmi berikut. Nama menu bisa berubah mengikuti antarmuka layanan.

- [GitHub — What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [GitHub — Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Google — Get your API client ID](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid)
- [Google — Use the token model](https://developers.google.com/identity/oauth2/web/guides/use-token-model)
- [Google — Manage App Audience](https://support.google.com/cloud/answer/15549945?hl=en)
- [Google — Sheets API scopes](https://developers.google.com/workspace/sheets/api/scopes)
- [Google — Sheets API usage limits and pricing](https://developers.google.com/workspace/sheets/api/limits)
- [Google — Unverified apps](https://support.google.com/cloud/answer/7454865?hl=en)
