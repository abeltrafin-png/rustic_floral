# USER GUIDE — Panduan Kustomisasi Admin

**Template:** Undangan Pernikahan Digital *Rustic Floral*
**Untuk:** pengelola UD. Rez Wan Jaya (tidak perlu bisa pemrograman)
**Versi dokumen:** Minggu 14

Panduan ini menjelaskan cara mengganti data satu klien (nama, tanggal, lokasi, foto, rekening, dll.)
**tanpa menyentuh `index.html`**. Hampir semua pekerjaan dilakukan di **satu berkas**: `assets/js/config.js`.

---

## 1. Sebelum mulai

| Kebutuhan | Keterangan |
|---|---|
| Editor teks | Disarankan **VS Code** (gratis). Hindari Word/Notepad bawaan karena bisa mengubah tanda kutip menjadi `“ ”` yang merusak kode. |
| Salinan proyek | Salin seluruh folder proyek ke folder kerja klien, misalnya `undangan-andi-sari/`. Jangan bekerja di folder master. |
| Browser | Chrome / Edge / Firefox, untuk mengecek hasil. |

### Berkas yang boleh dan tidak boleh diubah

| Berkas | Boleh diubah admin? | Fungsi |
|---|---|---|
| `assets/js/config.js` | ✅ **Ya** (utama) | Seluruh data klien |
| `assets/css/variables.css` | ✅ Ya (opsional) | Warna, font, ukuran — tema |
| `assets/images/` | ✅ Ya | Foto klien |
| `assets/music/` | ✅ Ya | Lagu latar |
| `index.html` | ⚠️ Hindari | Kerangka tampilan |
| `assets/css/style.css` | ❌ Jangan | Gaya komponen |
| `assets/js/script.js`, `assets/js/modules/template-engine.js` | ❌ Jangan | Logika halaman |

---

## 2. Alur kerja singkat (5 langkah)

1. **Salin** folder proyek untuk klien baru.
2. **Ganti foto & lagu** di `assets/images/` dan `assets/music/` (lihat bagian 4).
3. **Edit `config.js`** dari atas ke bawah (lihat bagian 3).
4. **Buka `index.html`** di browser, periksa semua bagian (checklist bagian 8).
5. **Unggah** ke hosting (lihat bagian *Deployment* di `README.md`).

---

## 3. Mengubah data di `config.js`

Buka `assets/js/config.js`. Isinya sebuah objek bernama `WEDDING_CONFIG` dengan bagian-bagian berikut.
**Hanya ubah teks di dalam tanda kutip `"..."`** — jangan hapus koma, kurung, atau tanda kutip.

### 3.1 Aturan dasar

| Aturan | Contoh |
|---|---|
| Kosongkan nilai (`""`) → bagian terkait **otomatis disembunyikan** | `qrisUrl: ""` |
| Format tanggal `YYYY-MM-DD` | `"2027-02-21"` |
| Format jam `HH:MM` (24 jam) | `"08:00"` |
| Baris baru di dalam teks ditulis `\n` | `"Putra dari\nBapak H. Ahmad & Ibu Hj. Fatimah"` |
| Placeholder `{{...}}` mengambil data lain secara otomatis | `"Foto {{turunan.nama.pasangan}}"` → *Foto Andi & Sari* |
| Setiap baris properti diakhiri koma `,` (kecuali yang terakhir dalam kelompoknya) | |

> **Tanda kutip ganda di dalam teks:** jika teks perlu memuat `"`, tulis `\"`.
> Tanda petik tunggal `'` (mis. *Jami'*) aman dipakai apa adanya.

### 3.2 Peta bagian `config.js`

| Bagian | Yang diubah | Tampil di |
|---|---|---|
| `meta` | Judul tab browser & deskripsi | Tab browser |
| `mempelai.pria` / `mempelai.wanita` | Nama panggilan, nama lengkap (+ gelar), foto, orang tua | Sampul, hero, seksi Mempelai |
| `sambutan` | Kalimat pembuka tamu & pesan hero | Layar pembuka, hero |
| `acara` | Tanggal utama, zona waktu, detail **akad** dan **resepsi** | Hero, Acara, Lokasi, Countdown, Kalender |
| `live` | Live streaming YouTube | Seksi Live (bisa dimatikan) |
| `cerita` | 4 kisah *love story* | Seksi Kisah |
| `galeri` | Video + 6 foto galeri | Seksi Galeri |
| `quote` | Ayat/doa | Seksi Doa |
| `amplop` | Rekening, QRIS, alamat kirim kado | Seksi Hadiah |
| `rsvp` | URL Google Apps Script | Form RSVP & riwayat ucapan |
| `musik` | File lagu & volume | Musik latar |

### 3.3 Contoh nyata: mengganti mempelai

**Sebelum**

```js
mempelai: {
    pria: {
        namaPanggilan: "Andi",
        namaLengkap: "Andi Prasetyo, S.T.",
        namaLengkapTanpaGelar: "Andi Prasetyo",
        foto: "assets/images/man.jpg",
        fotoAlt: "{{mempelai.pria.namaLengkap}}",
        orangTua: "Putra dari\nBapak H. Ahmad & Ibu Hj. Fatimah"
    },
```

**Sesudah** (klien baru)

```js
mempelai: {
    pria: {
        namaPanggilan: "Rizky",
        namaLengkap: "Rizky Ramadhan, S.Kom.",
        namaLengkapTanpaGelar: "Rizky Ramadhan",
        foto: "assets/images/man.jpg",
        fotoAlt: "{{mempelai.pria.namaLengkap}}",
        orangTua: "Putra dari\nBapak H. Hasan & Ibu Hj. Aminah"
    },
```

`namaPanggilan` dipakai untuk judul besar (*Rizky & Dinda*) dan semua teks turunan. Tidak perlu mengubah
`fotoAlt` — otomatis mengikuti `namaLengkap`.

### 3.4 Mengatur acara (akad & resepsi)

```js
acara: {
    zonaWaktu: "WIB",        // tampilan: WIB / WITA / WIT
    offsetUTC: "+07:00",     // WIB +07:00 | WITA +08:00 | WIT +09:00
    tanggalUtama: "2027-02-21",

    akad: {
        aktif: true,
        tanggal: "2027-02-21",
        mulai: "08:00",
        selesai: "10:00",
        tempat: "Masjid Jami' Al-Ikhlas",
        alamat: "Jl. Raya Ragunan No. 11A, ...",
        mapsUrl: "https://maps.google.com/?q=...",
        mapsEmbedUrl: "https://www.google.com/maps/embed?pb=..."
    },
    resepsi: { /* struktur sama */ }
}
```

**Penting**

- Jika klien di **WITA/WIT**, ubah `zonaWaktu` **dan** `offsetUTC` sekaligus. `offsetUTC` menentukan hitung mundur
  dan tombol *Save to Calendar*; `zonaWaktu` hanya label yang tampil di teks (mis. "08.00 WIB"). Bila tidak cocok,
  tamu melihat label zona yang salah atau waktu kalender yang meleset.
- `tanggalUtama` dan `tanggal` akad/resepsi **tidak saling mengecek**. Jika hari acara berubah, ubah ketiganya.
- Hanya ada satu acara? Ubah `aktif: false` pada acara yang tidak ada (akad **atau** resepsi); kartu, peta, dan
  titik penunjuk peta untuk acara itu otomatis hilang.
- Countdown menghitung mundur ke **jam mulai akad**.
- Tombol *Save to Calendar* dan semua teks tanggal/jam **dibuat otomatis** dari data di atas — tidak perlu diketik.

#### Cara mendapatkan `mapsUrl` dan `mapsEmbedUrl`

1. Buka **Google Maps**, cari lokasi acara.
2. `mapsUrl`: klik **Bagikan → Salin link**.
3. `mapsEmbedUrl`: klik **Bagikan → Sematkan peta → SALIN HTML**. Dari kode `<iframe src="...">`, ambil
   **hanya isi `src`** (yang dimulai `https://www.google.com/maps/embed?pb=`) lalu tempel di antara tanda kutip.

> Nilai `mapsEmbedUrl` bawaan template hanyalah contoh. **Wajib diganti** untuk setiap klien.

### 3.5 Live streaming

```js
live: {
    aktif: true,
    embedUrl: "https://www.youtube.com/embed/ID_VIDEO",
    tautanYoutube: "https://www.youtube.com/watch?v=ID_VIDEO",
    ...
}
```

- Ganti `ID_VIDEO` dengan ID dari tautan YouTube live (bagian setelah `v=`).
- **Tidak ada live streaming?** Ubah menjadi `aktif: false`. Seksi dan menu *Live* akan hilang.
- Template bawaan masih berisi `YOUR_LIVE_VIDEO_ID`. **Jangan biarkan** nilai ini bila `aktif: true`.

### 3.6 Love story & galeri

- `cerita` berisi **tepat 4 kisah** (label, judul, deskripsi, foto). Urutan di config = urutan tampil.
- `galeri.foto` berisi **tepat 6 foto**. Jumlah tampilan memang tetap; ubah isinya, bukan jumlahnya.
- Mengosongkan satu item menyembunyikan slot tersebut, tetapi **menambah item ke-5 tidak akan tampil**.
- `galeri.videoEmbedUrl` — kosongkan (`""`) bila tidak ada video pernikahan; judul dan video disembunyikan.
- `quote.kutipan` — kosongkan bila tidak memakai ayat/doa; seluruh seksi Doa dan menunya hilang.

### 3.7 Amplop digital & kirim kado

```js
amplop: {
    qrisUrl: "",                       // kosong = blok QRIS disembunyikan
    rekening: [
        { bank: "BANK BCA", noRek: "1234 5678 90", atasNama: "Andi Prasetyo" },
        { bank: "BANK BCA", noRek: "4567 5678 21", atasNama: "Sari Wulandari" }
    ],
    kirimKado: { penerima: "...", noHp: "...", alamat: "..." }
}
```

- Template menyediakan **tepat 2 slot rekening**. Kosongkan `noRek` pada slot yang tidak dipakai; slot itu disembunyikan,
  dan bila keduanya kosong seluruh kartu rekening hilang.
- Ganti **semua** data rekening contoh dengan data klien. Tamu menyalin nomor lewat tombol; periksa ulang angka.
- Untuk QRIS: simpan gambar di `assets/images/` lalu isi `qrisUrl: "assets/images/qris.jpg"`.
- `alamat` kirim kado masih berisi teks pengganti — wajib diisi.

### 3.8 RSVP & buku tamu (Google Apps Script)

`rsvp.googleScriptUrl` adalah alamat *web app* Google Apps Script yang menyimpan ucapan ke Google Sheets.

- **Setiap klien harus punya Apps Script & Spreadsheet sendiri.** Jangan memakai ulang URL klien lain —
  ucapan tamu akan masuk ke sheet yang salah.
- Setelah URL diganti, kirim satu ucapan uji, lalu cek Spreadsheet.
- Halaman selalu menampilkan "Ucapan dikirim" setelah tombol ditekan; keberhasilan sebenarnya hanya terlihat dengan
  **memeriksa Spreadsheet**.
- Kosongkan `googleScriptUrl` bila klien tidak memakai RSVP; halaman menampilkan *"Fitur ucapan belum dikonfigurasi"*.

### 3.9 Musik

```js
musik: { file: "assets/music/wedding-song.mp3", volume: 0.45 }
```

- Ganti `file` ke lagu klien. `volume` antara `0` (hening) dan `1` (penuh).
- Kosongkan `file` untuk menyembunyikan tombol musik.
- Musik hanya mulai setelah tamu menekan **Buka Undangan** (aturan browser).

---

## 4. Mengganti foto & musik

| Aset | Format | Ukuran disarankan | Catatan |
|---|---|---|---|
| Foto mempelai (`man.jpg`, `woman.jpg`) | JPG / WebP | ≤ 150 KB | Rasio potret |
| Foto cerita (`story-1..4.jpg`) | JPG / WebP | ≤ 150 KB | |
| Foto galeri (`foto1..6.jpg`) | JPG / WebP | ≤ 200 KB | |
| Musik | MP3 | ≤ 4 MB | Semakin kecil, semakin cepat dimuat |

**Cara termudah:** ganti file lama dengan file baru **bernama sama** — `config.js` tidak perlu diubah.
Jika nama berbeda, ubah path di `config.js` (mis. `foto: "assets/images/rizky.jpg"`).

Tips kompres: gunakan [squoosh.app](https://squoosh.app) untuk gambar. Gunakan huruf kecil dan tanpa spasi pada nama file
(`foto-1.jpg`, bukan `Foto 1 (final).JPG`) karena server Linux membedakan huruf besar/kecil.

---

## 5. Mengubah tema warna & font

Semua nilai visual ada di `assets/css/variables.css`, di antara penanda **DESIGN TOKENS BOUNDARY MARKER**
(area aman untuk diedit). Ubah kode warna hex, lalu seluruh halaman ikut berubah.

### Token warna utama

| Token | Nilai bawaan | Dipakai untuk |
|---|---|---|
| `--color-bg` | `#f8f3ed` | Latar halaman (krem) |
| `--color-surface` | `#fffdf9` | Kartu / panel |
| `--color-primary-600` | `#70836f` | Hijau sage (aksen utama) |
| `--color-primary-800` | `#506651` | Hijau tua (teks aksen, tombol) |
| `--color-accent-600` | `#b8757d` | Mawar (aksen bunga) |
| `--color-gold` | `#b99358` | Emas (garis, ornamen) |
| `--color-text` | `#4a4642` | Teks utama |
| `--color-text-muted` | `#837b75` | Teks sekunder |

Contoh: tema biru dongker → ubah `--color-primary-600` dan `--color-primary-800` saja.

```css
:root {
    --color-primary-600: #4a6fa5;
    --color-primary-800: #2f4a73;
}
```

### Font

```css
--font-serif: "Cormorant Garamond", Georgia, serif;   /* judul */
--font-sans:  "Montserrat", Arial, sans-serif;        /* isi */
```

Mengganti font butuh **dua langkah**: (1) ubah nama font di `--font-serif`/`--font-sans`, dan
(2) ubah alamat Google Fonts pada baris `@import url('https://fonts.googleapis.com/...')` di bagian atas
`variables.css`. Jika hanya langkah 1, browser tamu akan memakai font cadangan (Georgia/Arial).

> **Jangan** menambahkan warna atau ukuran langsung di `style.css`. Aturan proyek: semua nilai visual lewat `variables.css`.

---

## 6. Menguji sebelum dipublikasikan

Buka `index.html` dengan klik dua kali. Cek berurutan:

- [ ] Layar pembuka: sapaan tamu, nama pasangan, tanggal benar → klik **Buka Undangan**
- [ ] Musik berbunyi (klik ikon musik untuk jeda)
- [ ] Hero: nama & tanggal benar
- [ ] **Countdown** menghitung ke jam akad yang benar
- [ ] Bagian Mempelai: foto, nama, orang tua tidak tertukar
- [ ] Akad & Resepsi: tanggal, jam, tempat, alamat benar; tombol **Lokasi** membuka Google Maps yang tepat
- [ ] Peta tertanam menunjuk lokasi klien (bukan lokasi contoh)
- [ ] **Save The Date** membuka Google Calendar dengan jam benar
- [ ] Live: tampil bila `aktif: true`, hilang bila `false`; bukan `YOUR_LIVE_VIDEO_ID`
- [ ] Kisah & Galeri: 4 + 6 foto benar; klik foto membuka tampilan besar
- [ ] Hadiah: nomor rekening benar; tombol salin berfungsi
- [ ] RSVP: kirim ucapan uji → muncul di Spreadsheet klien
- [ ] Tampilan **HP** (Chrome → F12 → ikon ponsel) rapi, tidak ada teks terpotong
- [ ] Tidak ada galat merah di Console (F12 → Console)

---

## 7. Masalah umum

| Gejala | Penyebab paling mungkin | Solusi |
|---|---|---|
| Halaman kosong / tidak berubah | Salah ketik di `config.js` (koma/kutip hilang) | Buka F12 → Console, lihat baris galat; periksa koma di baris sebelumnya |
| Teks tampil `{{...}}` | Path placeholder salah ketik | Periksa nama (mis. `turunan.nama.pasangan`) |
| Foto tidak muncul | Nama/path salah atau beda huruf besar-kecil | Samakan path di `config.js` dengan nama file persis |
| Lagu tidak berbunyi | Belum klik *Buka Undangan*, atau file tidak ditemukan | Klik tombol buka; cek path `musik.file` |
| Jam countdown/kalender meleset, atau label zona salah | `offsetUTC` tidak cocok dengan `zonaWaktu` | WIB `+07:00`, WITA `+08:00`, WIT `+09:00` |
| Peta menunjuk tempat salah | `mapsEmbedUrl` masih contoh | Ambil ulang dari Google Maps (bagian 3.4) |
| Ucapan tidak masuk Spreadsheet | URL Apps Script salah / belum di-*deploy* | Deploy ulang sebagai *Web app* (akses: siapa saja), tempel URL baru |
| Seksi Live menampilkan galat video | `embedUrl` masih placeholder | Isi ID video asli atau `aktif: false` |
| Pratinjau tautan di WhatsApp tidak memuat nama klien | Keterbatasan teknis (crawler tidak menjalankan JavaScript) | Lihat bagian 8 |

---

## 8. Keterbatasan yang perlu diketahui

- **Pratinjau tautan WhatsApp/Facebook** membaca judul & deskripsi statis dari `index.html`, bukan dari `config.js`.
  Untuk pratinjau per klien, ubah manual `<title>` dan `<meta name="description">` di `index.html`
  (satu-satunya pengecualian yang boleh menyentuh berkas ini).
- Cerita (4) dan foto galeri (6) berjumlah tetap.
- Sistem **belum** mendukung tautan personal per tamu (`?to=Nama`). Sapaan di layar pembuka sama untuk semua tamu
  (`sambutan.pembukaTamu`); nama tamu hanya diisi sendiri pada form RSVP.

---

## 9. Bantuan

Jika masalah tidak teratasi: (1) tangkap layar pesan galat di Console, (2) catat langkah terakhir yang dilakukan,
(3) hubungi pengembang. Detail teknis ada di `TECHNICAL_DOCS.md`.
