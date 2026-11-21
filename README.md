# Rustic Floral — Undangan Pernikahan Digital

Template undangan pernikahan (HTML, CSS, Vanilla JS) dengan **data terpisah dari tampilan**.
Seluruh data klien hanya diubah di satu berkas: `assets/js/config.js`.

## Dokumentasi

| Dokumen | Untuk siapa | Isi |
|---|---|---|
| [`USER_GUIDE.md`](USER_GUIDE.md) | Admin / pengelola | Cara mengganti data klien, foto, musik, tema, dan menguji sebelum rilis |
| [`TECHNICAL_DOCS.md`](TECHNICAL_DOCS.md) | Pengembang | Arsitektur, template engine, skema URL & API, pemeliharaan, utang teknis |
| [`ANNOTATION_INDEX.md`](ANNOTATION_INDEX.md) | Pengembang | Indeks marker comment (`BUG`, `FIXME`, `TODO`, …) |
| `docs/PRD_Wedding_Invitation_Rustic_Floral.pdf` | Semua | Kebutuhan produk |

## Struktur

```
index.html                         ← kerangka tampilan (hanya penanda data-template-*)
assets/css/style.css
assets/js/config.js                ← SINGLE SOURCE OF TRUTH (data klien)
assets/js/modules/template-engine.js  ← mesin injeksi data (DOM hydration)
assets/js/script.js                ← interaksi: musik, countdown, slider, RSVP, dll.
assets/images/  assets/music/      ← aset klien
USER_GUIDE.md  TECHNICAL_DOCS.md   ← dokumentasi (Minggu 14)
```

Urutan muat skrip: `config.js` → `template-engine.js` → `script.js`.

## Cara mengganti data klien

1. Buka `assets/js/config.js`.
2. Ubah nama, tanggal (`YYYY-MM-DD`), jam (`HH:MM`), lokasi, foto, rekening, dst.
3. Simpan, lalu muat ulang halaman. Tidak perlu menyentuh `index.html`.

Nilai kosong (`""`) otomatis menyembunyikan elemen/seksi terkait.
Nama pasangan, tanggal terformat, jam acara, dan tautan kalender dihitung otomatis dari config.

## Atribut penanda (tagging)

| Atribut | Fungsi |
|---|---|
| `data-template="path"` | mengganti teks |
| `data-template-src="path"` | mengganti `src` (img, iframe, source) |
| `data-template-href="path"` | mengganti `href` |
| `data-template-alt` / `-title` / `-content` | mengganti `alt` / `title` / `content` |
| `data-template-if="path"` | menyembunyikan elemen bila data kosong |

Path mendukung properti bersarang dan indeks array, mis. `mempelai.pria.namaLengkap`, `cerita.0.judul`.

## Kendala teknis & solusi

**1. Nama berwarna (`Andi & Sari`) rusak setelah nama dijadikan elemen dinamis.**
CSS awal memakai selektor `h1 span` untuk mewarnai tanda `&`. Setelah nama dibungkus `<span data-template>`,
nama ikut berwarna seperti `&`. *Solusi:* tanda `&` diberi kelas `.amp`, dan selektor CSS diganti menjadi `h1 .amp`.

**2. Baris baru (`<br>`) pada nama orang tua dan sapaan tamu.**
`textContent` tidak mem-parsing HTML, sehingga `<br>` tidak bisa dipakai (dan `innerHTML` berisiko XSS).
*Solusi:* data memakai `\n`, lalu CSS `white-space: pre-line` pada `.person-family` dan `.opening-to`.

**3. Atribut `hidden` kalah oleh `display: flex/grid` pada kelas komponen.**
Elemen yang disembunyikan engine tetap tampil. *Solusi:* aturan global `[hidden] { display: none !important; }`.
Skrip slider dan scroll-spy juga diubah agar mengabaikan elemen yang `hidden`.

**4. Ganti `<source>` audio tidak memuat ulang lagu.**
Mengubah `src` pada `<source>` setelah halaman dimuat tidak memicu pemuatan ulang.
*Solusi:* engine memanggil `audio.load()` setelah mengisi `src`.

**5. Pratinjau tautan (WhatsApp/Facebook) tidak melihat data dari config.**
Crawler tidak menjalankan JavaScript, sehingga `<title>` dan `<meta>` hanya terbaca versi statisnya.
*Catatan:* untuk pratinjau per klien perlu langkah build/server-side rendering (di luar cakupan minggu ini).

---

## Deployment ke Server Produksi

Situs ini **statis** (tidak ada build, tidak ada server-side). Cukup unggah seluruh isi folder proyek
(`index.html`, `assets/`, dst.). Folder `docs/` dan berkas `*.md` tidak diperlukan di server, tetapi aman bila ikut terunggah.

### Sebelum deploy (wajib)

- [ ] Data klien final di `config.js`; **tidak ada** placeholder tersisa (`YOUR_LIVE_VIDEO_ID`, rekening contoh `1234 5678 90`,
      alamat kado "Masukkan alamat…", `mapsEmbedUrl` contoh)
- [ ] `rsvp.googleScriptUrl` milik klien ini (bukan klien lain), sudah di-deploy sebagai *Web app*
- [ ] Console browser bersih dari galat di lokal
- [ ] Nama file aset huruf kecil, tanpa spasi (server Linux membedakan huruf besar/kecil)
- [ ] Marker `BUG`/`FIXME`/`TODO` di `ANNOTATION_INDEX.md` sudah dikerjakan atau diputuskan ditunda
- [ ] Semua perubahan ter-*commit* (lihat *Standar commit* di bawah)

### Opsi A — GitHub Pages (gratis)

1. Dorong repositori ke GitHub (branch `main`):
   ```bash
   git add .
   git commit -m "docs: tambah USER_GUIDE dan TECHNICAL_DOCS"
   git push origin main
   ```
2. Di repositori GitHub: **Settings → Pages**.
3. **Source:** *Deploy from a branch* → branch `main`, folder `/ (root)` → **Save**.
4. Tunggu proses build selesai (tab **Actions**). URL terbit di halaman Pages:
   `https://<username>.github.io/<nama-repo>/`
5. Centang **Enforce HTTPS** (tersedia setelah sertifikat diterbitkan).

> Gunakan `git push` biasa. **Jangan** memakai `--force` ke `main` — riwayat commit bisa hilang dan melanggar
> standar versioning proyek.

**Domain kustom (opsional)**

1. Di **Settings → Pages → Custom domain**, isi domain lalu **Save** (lakukan ini *sebelum* mengubah DNS).
2. Di penyedia DNS:

   | Jenis | Nama | Nilai |
   |---|---|---|
   | `A` | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (empat record) |
   | `CNAME` | `www` | `<username>.github.io` |

3. Tunggu propagasi DNS (hingga 24 jam), lalu aktifkan **Enforce HTTPS**.
4. Verifikasi: `dig contoh.com +noall +answer -t A` harus menampilkan keempat alamat di atas.

### Opsi B — Hostinger (hPanel / cPanel)

1. Masuk ke **hPanel Hostinger → File Manager** untuk domain tujuan.
2. Buka direktori utama **`public_html/`**.
3. Unggah **isi** folder proyek (bukan folder pembungkusnya) sehingga `index.html` berada tepat di `public_html/index.html`.
   Alternatif: FileZilla (SFTP) atau Git Deployment dari hPanel.
4. Aktifkan **SSL Certificate** untuk domain (menu *Security → SSL*), lalu aktifkan **Force HTTPS**.
5. Bila *Force HTTPS* tidak tersedia, buat `public_html/.htaccess`:
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
   ```
6. DNS domain: arahkan **A record** ke IP server Hostinger (atau gunakan nameserver Hostinger) sesuai petunjuk di hPanel.

> Nama menu hPanel/cPanel dapat berubah; ikuti padanannya bila label berbeda.

### Setelah deploy

1. Buka URL **`https://`** di jendela *incognito* dan di HP sungguhan.
2. Jalankan **Production Readiness Checklist** di bawah.
3. Kirim satu RSVP uji → pastikan masuk Spreadsheet klien, lalu hapus baris ujinya.
4. Simpan URL produksi di Task Tracker dan laporan Minggu 14.

---

## Production Readiness Checklist (Minggu 14)

Isi kolom **Status** *hanya setelah* diuji di URL produksi (bukan di lokal). Gunakan `PASS` / `FAIL` + tanggal & catatan.

| No | Kriteria audit | Cara verifikasi | Target | Status |
|---|---|---|---|---|
| 01 | Keamanan HTTPS | Buka `http://domain` → otomatis ke `https://`; ikon gembok valid (tanpa peringatan *mixed content* di Console); cek sertifikat di [SSL Labs](https://www.ssllabs.com/ssltest/) | Valid & ter-*enforce* | ☐ |
| 02 | Waktu pemuatan (LCP) | Lighthouse (Chrome DevTools → Lighthouse, mode **Mobile**) | LCP ≤ 2,5 dtk (kategori *good* Google) | ☐ |
| 03 | Skor Lighthouse | Lighthouse Performance, Accessibility, Best Practices, SEO | Isi hasil aktual; target disepakati dengan mentor | ☐ |
| 04 | Responsivitas | DevTools device toolbar (360, 768, 1280 px) + HP sungguhan | Tidak ada teks terpotong / *scroll* horizontal | ☐ |
| 05 | Ketiadaan tautan rusak | Klik semua tautan (Maps, Save The Date, YouTube, menu `#anchor`) atau pindai dengan [W3C Link Checker](https://validator.w3.org/checklink) | 0 *broken link* | ☐ |
| 06 | Audio | Klik *Buka Undangan* → musik terdengar; tombol jeda berfungsi; file MP3 terunduh (tab Network, status 200) | Berfungsi, tanpa galat | ☐ |
| 07 | Peta & video | Peta akad & resepsi menunjuk lokasi klien; video galeri (dan live bila aktif) terputar | Berfungsi, tanpa galat | ☐ |
| 08 | Konsol bersih | DevTools → Console saat memuat & berinteraksi | Tanpa galat merah | ☐ |
| 09 | RSVP end-to-end | Kirim ucapan uji → baris muncul di Spreadsheet → muncul di riwayat | Tersimpan & tampil | ☐ |
| 10 | Konten final | Tidak ada placeholder/data contoh (lihat *Sebelum deploy*) | 0 sisa | ☐ |
| 11 | Pratinjau tautan | Tempel URL di WhatsApp | Sesuai ekspektasi (lihat kendala #5) | ☐ |

**Titik pantau kinerja yang sudah diketahui** (lihat `ANNOTATION_INDEX.md`): MP3 ±4 MB dengan `preload="auto"`, gambar tanpa
`loading="lazy"`, dan `@import` Google Fonts di CSS. Bila LCP di atas target, mulai dari tiga hal ini.

---

## Standar Riwayat Commit (Conventional Commits)

Format: `<tipe>: <deskripsi singkat, huruf kecil, kalimat perintah>`

| Tipe | Dipakai untuk | Contoh |
|---|---|---|
| `feat` | Fitur baru | `feat: tambah slot rekening ketiga` |
| `fix` | Perbaikan bug | `fix: perbaiki fallback salin rekening di http` |
| `docs` | Dokumentasi saja | `docs: tambah USER_GUIDE dan TECHNICAL_DOCS` |
| `refactor` | Rapikan kode tanpa ubah perilaku | `refactor: gabung logika clipboard` |
| `perf` | Peningkatan kinerja | `perf: tambah loading=lazy pada gambar galeri` |
| `style` | Format/gaya saja | `style: rapikan indentasi script.js` |
| `chore` | Pekerjaan pemeliharaan | `chore: perbarui .gitignore` |

Satu commit = satu maksud perubahan. Hindari pesan seperti `update`, `fix bug`, atau `final final`.
