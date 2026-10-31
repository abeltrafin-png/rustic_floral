# Rustic Floral — Undangan Pernikahan Digital

Template undangan pernikahan (HTML, CSS, Vanilla JS) dengan **data terpisah dari tampilan**.
Seluruh data klien hanya diubah di satu berkas: `assets/js/config.js`.

## Struktur

```
index.html                         ← kerangka tampilan (hanya penanda data-template-*)
assets/css/style.css
assets/js/config.js                ← SINGLE SOURCE OF TRUTH (data klien)
assets/js/modules/template-engine.js  ← mesin injeksi data (DOM hydration)
assets/js/script.js                ← interaksi: musik, countdown, slider, RSVP, dll.
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
