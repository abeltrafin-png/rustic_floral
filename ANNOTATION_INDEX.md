# Indeks Marker Comments

Dibuat otomatis dari kode. Format: `// TAG(lingkup): keterangan` (JS), `/* … */` (CSS), `<!-- … -->` (HTML).

Urutan prioritas: BUG → FIXME → SECURITY → TODO → REFACTOR → PERF → CLEANUP → NOTE.


## FIXME (3)

| Lokasi | Lingkup | Keterangan |
|---|---|---|
| `assets/js/modules/template-engine.js:237` | placeholder | referensi melingkar (a→b→a) tidak dideteksi; hasilnya hanya berhenti setelah 3 putaran dengan teks setengah jadi. |
| `assets/js/script.js:292` | ics | RFC 5545 mewajibkan line folding (maks. 75 oktet per baris). Teks panjang (LOCATION/DESCRIPTION) bisa ditolak oleh sebagian aplikasi kalender. |
| `assets/js/script.js:778` | rsvp | mode no-cors → respons tidak terbaca, jadi "Ucapan dikirim" selalu tampil walau server gagal menyimpan. Pertimbangkan verifikasi lewat loadGuestbook(). |

## SECURITY (3)

| Lokasi | Lingkup | Keterangan |
|---|---|---|
| `assets/js/config.js:188` | rsvp | URL ini publik (terlihat di sumber halaman). Pastikan Apps Script memvalidasi input, membatasi panjang, dan tidak memberi akses tulis ke sheet lain. |
| `assets/js/modules/template-engine.js:300` | url | nilai href/src dari config tidak divalidasi skemanya. Aman selama config ditulis admin; bila kelak berasal dari input pengguna, tolak javascript:. |
| `assets/js/script.js:619` | jsonp | JSONP mengeksekusi skrip dari URL Apps Script di halaman ini. Aman hanya bila endpoint dipercaya. Lebih baik pindah ke fetch() + CORS di Apps Script. |

## TODO (8)

| Lokasi | Lingkup | Keterangan |
|---|---|---|
| `index.html:26` | seo | belum ada <meta property="og:title\|og:description\|og:image"> statis. Crawler WhatsApp/Facebook tidak menjalankan JS, jadi pratinjau tautan memakai teks bawaan ini (lihat README, kendala #5). Isi manual per klien atau gunakan build step. |
| `assets/js/config.js:80` | maps | parameter pb= pada embed ini template contoh; ganti dengan hasil Google Maps → Bagikan → Sematkan peta untuk lokasi klien yang sebenarnya. |
| `assets/js/config.js:102` | live | embedUrl masih placeholder. Selama aktif:true, iframe akan error. Isi ID video asli atau set aktif:false sebelum undangan dikirim. |
| `assets/js/config.js:173` | amplop | data rekening di bawah masih contoh — ganti dengan data klien. |
| `assets/js/config.js:180` | kado | placeholder alamat — wajib diganti agar tombol salin berguna. |
| `assets/js/config.js:190` | rsvp | tiap klien butuh deployment Apps Script sendiri; jangan pakai ulang URL ini. |
| `assets/js/script.js:264` | kalender | hanya akad yang diekspor. Resepsi (turunan.resepsi) belum masuk .ics — tambahkan VEVENT kedua atau buat tombol terpisah. |
| `assets/js/script.js:893` | ux | ganti alert() dengan toast non-blokir. |

## REFACTOR (6)

| Lokasi | Lingkup | Keterangan |
|---|---|---|
| `index.html:467` | loop | jika jumlah cerita/foto harus dinamis, render dari <template> + array. |
| `assets/css/style.css:17` | tokens | header di atas melarang nilai hardcoded, tetapi masih ada ±234 baris ber-px (ukuran ornamen, offset, min()). Pindahkan ke variables.css bertahap. |
| `assets/css/style.css:156` | z-index | angka sihir; susun skala --z-* di variables.css. |
| `assets/css/style.css:275` | z-index | .dnav (navbar desktop); angka sihir, jadikan token. |
| `assets/css/style.css:759` | z-index | .music-control; bagian dari skala yang sama dengan 9999/99999/1000. |
| `assets/css/style.css:1601` | z-index | .gallery-modal (99999) sengaja di atas layar sampul (9999) & .music-control (9998). |

## PERF (5)

| Lokasi | Lingkup | Keterangan |
|---|---|---|
| `index.html:63` | audio | preload="auto" mengunduh ±4 MB mp3 sebelum tamu menekan "Buka Undangan". Pertimbangkan preload="none": play() tetap berjalan dari klik dan engine memanggil load(). |
| `index.html:202` | img | seluruh <img> bertanda data-template-src belum punya width/height dan loading="lazy" → pergeseran layout (CLS) dan semua foto diunduh sekaligus. Atribut statis boleh ditambah langsung di HTML; engine hanya mengisi src/alt. |
| `index.html:553` | iframe | iframe video (dan live) belum memakai loading="lazy" seperti iframe peta. CLEANUP(html): atribut frameborder sudah usang → gunakan CSS border: 0. |
| `assets/css/variables.css:15` | fonts | @import membuat rantai blocking HTML → variables.css → CSS font → file font. Pindahkan ke <link rel="preconnect"> + <link rel="stylesheet"> di <head> index.html. |
| `assets/js/script.js:1040` | resize | handler berat dipanggil di tiap event resize tanpa throttle/debounce. |

## CLEANUP (1)

| Lokasi | Lingkup | Keterangan |
|---|---|---|
| `assets/css/style.css:2137` | css | redundan — aturan global [hidden] { display: none !important } sudah mencakup ini. |

## NOTE (20)

| Lokasi | Lingkup | Keterangan |
|---|---|---|
| `index.html:465` | template | slot cerita bersifat tetap (cerita.0–3). Item config ke-5 tidak tampil; mengosongkan satu item menyembunyikan slotnya. |
| `index.html:544` | template | galeri memakai 6 slot tetap (galeri.foto.0–5), sama seperti cerita. |
| `index.html:742` | rsvp | value option harus sama persis dengan daftar valid di script.js (["Hadir", "Tidak Hadir"]) dan validasi di Apps Script. |
| `assets/css/variables.css:290` | anim | dipakai layar sampul; sinkron dengan setTimeout(700) di script.js. |
| `assets/css/style.css:19` | breakpoint | 768px & 480px tidak bisa memakai var(). 768px juga dipakai script.js (window.innerWidth <= 768) — ubah keduanya bersamaan. |
| `assets/css/style.css:166` | anim | transisi memakai --duration-700; script.js menunggu 700ms lalu display:none. Ubah token dan setTimeout di openWeddingInvitation() bersama-sama. |
| `assets/js/config.js:66` | acara | tanggalUtama dipakai tampilan; tanggal akad/resepsi dipakai kalender. Jika berbeda hari, ubah KEDUANYA (belum ada validasi silang). |
| `assets/js/config.js:170` | amplop | qrisUrl kosong → blok QRIS disembunyikan otomatis oleh engine. |
| `assets/js/config.js:197` | musik | rentang valid 0–1; di luar itu script.js memakai fallback 0.45. |
| `assets/js/modules/template-engine.js:54` | clone | JSON clone membuang undefined/function/Date. Aman selama config hanya berisi data murni. Pertimbangkan structuredClone() bila nanti perlu. |
| `assets/js/modules/template-engine.js:203` | placeholder | hanya karakter [\w.] — cukup untuk path & indeks array, tidak mendukung spasi atau tanda hubung pada nama kunci. |
| `assets/js/modules/template-engine.js:236` | placeholder | 3 putaran = kedalaman maksimum referensi berantai. |
| `assets/js/modules/template-engine.js:331` | api | kontrak publik modul. Hindari mengubah nama tanpa memeriksa script.js. |
| `assets/js/script.js:34` | data | DATA bersifat read-only. Seluruh teks klien harus lewat WEDDING_DATA. |
| `assets/js/script.js:174` | anim | 700ms = token --duration-700 yang dipakai transisi .opening-screen di style.css. |
| `assets/js/script.js:401` | breakpoint | 768 harus sama dengan @media (max-width: 768px) di style.css. |
| `assets/js/script.js:621` | jsonp | callback global sekali pakai dibersihkan oleh finish(). |
| `assets/js/script.js:649` | timeout | batas tunggu 15 detik sebelum pesan gagal muat ditampilkan. |
| `assets/js/script.js:735` | validasi | nilai harus sama persis dengan <option value> di index.html dan validasi di Apps Script. Validasi klien ini mudah dilewati, jadi bukan pengaman. |
| `assets/js/script.js:798` | rsvp | jeda 2,5 dtk = perkiraan waktu tulis Apps Script ke Sheets (heuristik). |
