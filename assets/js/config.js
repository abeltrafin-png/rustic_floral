/* ============================================================
   CONFIG.JS — SINGLE SOURCE OF TRUTH DATA KLIEN
   ------------------------------------------------------------
   Ubah data undangan HANYA di berkas ini. Seluruh halaman
   (index.html) akan diperbarui otomatis oleh template-engine.js.

   ATURAN PENGISIAN
   - Kosongkan nilai ("") untuk menyembunyikan elemen/seksi terkait.
   - Format tanggal : "YYYY-MM-DD"  (contoh: "2027-02-21")
   - Format jam     : "HH:MM"        (contoh: "08:00")
   - Placeholder {{path.ke.data}} boleh dipakai di dalam teks untuk
     mengambil nilai lain, contoh: "Foto {{turunan.nama.pasangan}}".
     Nilai di bawah "turunan.*" dihitung otomatis oleh engine
     (nama pasangan, tanggal terformat, jam, tautan kalender, dll).
   ============================================================ */

/**
 * @typedef {Object} WeddingConfig
 * @property {Object} meta      judul & deskripsi halaman
 * @property {Object} mempelai  data pria & wanita
 * @property {Object} acara     akad, resepsi, zona waktu
 * @property {Array}  cerita    love story (urutan = urutan tampil)
 * @property {Object} rsvp      endpoint Google Apps Script
 * @type {WeddingConfig}
 */
const WEDDING_CONFIG = {

    /* ---------- Metadata halaman ---------- */
    meta: {
        judulHalaman: "Undangan Pernikahan — {{turunan.nama.pasangan}}",
        deskripsi: "Undangan Pernikahan {{mempelai.pria.namaLengkapTanpaGelar}} & {{mempelai.wanita.namaLengkapTanpaGelar}}"
    },

    /* ---------- Mempelai ---------- */
    mempelai: {
        pria: {
            namaPanggilan: "Andi",
            namaLengkap: "Andi Prasetyo, S.T.",
            namaLengkapTanpaGelar: "Andi Prasetyo",
            foto: "assets/images/man.jpg",
            fotoAlt: "{{mempelai.pria.namaLengkap}}",
            orangTua: "Putra dari\nBapak H. Ahmad & Ibu Hj. Fatimah"
        },
        wanita: {
            namaPanggilan: "Sari",
            namaLengkap: "Sari Wulandari, S.Pd.",
            namaLengkapTanpaGelar: "Sari Wulandari",
            foto: "assets/images/woman.jpg",
            fotoAlt: "{{mempelai.wanita.namaLengkap}}",
            orangTua: "Putri dari\nBapak H. Budi & Ibu Hj. Rahayu"
        }
    },

    /* ---------- Teks sambutan ---------- */
    sambutan: {
        pembukaTamu: "Kepada Yth.\nBapak/Ibu/Saudara/i",
        pesanHero: "Dengan penuh kebahagiaan, kami mengundang Anda untuk menjadi bagian dari hari istimewa kami."
    },

    /* ---------- Acara ---------- */
    acara: {
        zonaWaktu: "WIB",
        offsetUTC: "+07:00",

        // Tanggal utama dipakai di sampul, hero, countdown, footer.
        // NOTE(acara): tanggalUtama dipakai tampilan; tanggal akad/resepsi dipakai kalender.
        //   Jika berbeda hari, ubah KEDUANYA (belum ada validasi silang).
        tanggalUtama: "2027-02-21",

        akad: {
            aktif: true,
            judul: "Akad Nikah",
            label: "AKAD NIKAH",
            tanggal: "2027-02-21",
            mulai: "08:00",
            selesai: "10:00",
            tempat: "Masjid Jami' Al-Ikhlas",
            alamat: "Jl. Raya Ragunan No. 11A, Jati Padang, Pasar Minggu, Jakarta Selatan",
            mapsUrl: "https://maps.google.com/?q=Masjid+Jami'+Al-Ikhlas+Jl.+Raya+Ragunan+No.+11A+Jati+Padang",
            // TODO(maps): parameter pb= pada embed ini template contoh; ganti dengan hasil
            //   Google Maps → Bagikan → Sematkan peta untuk lokasi klien yang sebenarnya.
            mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.7362024147047!2d106.8286915!3d-6.2983804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f2307bdcdd03%3A0x6b9bfd3b48f654b1!2sMasjid%20Jami'%20Al-Ikhlas!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
        },

        resepsi: {
            aktif: true,
            judul: "Resepsi Pernikahan",
            label: "RESEPSI",
            tanggal: "2027-02-21",
            mulai: "14:00",
            selesai: "16:00",
            tempat: "Gedung Pertemuan PERTAMINA",
            alamat: "Jl. Cempaka Putih Tengah XX B No. 20B, Jakarta Pusat",
            mapsUrl: "https://maps.google.com/?q=Gedung+Pertemuan+PERTAMINA",
            mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2737668615796!2d106.8329618!3d-6.2275811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3ebd03c9233%3A0x3344692eb3f57262!2sGedung%20Pertemuan%20Pertamina!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
        }
    },

    /* ---------- Live streaming ---------- */
    live: {
        aktif: true,
        // TODO(live): embedUrl masih placeholder. Selama aktif:true, iframe akan error.
        //   Isi ID video asli atau set aktif:false sebelum undangan dikirim.
        // Ganti YOUR_LIVE_VIDEO_ID dengan ID video YouTube live sebenarnya.
        embedUrl: "https://www.youtube.com/embed/YOUR_LIVE_VIDEO_ID",
        tautanYoutube: "https://www.youtube.com/",
        judulIframe: "Live Streaming Pernikahan {{turunan.nama.pasangan}}",
        judul: "Saksikan Pernikahan Kami Secara Live",
        deskripsi: "Bagi keluarga dan sahabat yang tidak dapat hadir secara langsung, kami mengundang Anda untuk menyaksikan momen bahagia ini melalui live streaming."
    },

    /* ---------- Love story (urutan = urutan tampil) ---------- */
    cerita: [
        {
            label: "AWAL PERTEMUAN",
            judul: "Pertama Bertemu",
            deskripsi: "Kami pertama kali bertemu di bangku kuliah saat mengikuti kegiatan organisasi kampus. Dari sebuah pertemuan sederhana, perlahan tumbuh cerita yang begitu berarti.",
            foto: "assets/images/story-1.jpg",
            fotoAlt: "Awal pertemuan {{turunan.nama.pasanganDan}}"
        },
        {
            label: "KOMITMEN",
            judul: "Berkomitmen",
            deskripsi: "Setelah melalui berbagai cerita bersama, kami memutuskan untuk melangkah lebih jauh, saling mendukung dan tumbuh bersama.",
            foto: "assets/images/story-2.jpg",
            fotoAlt: "Kisah {{turunan.nama.pasanganDan}}"
        },
        {
            label: "MENUJU PERNIKAHAN",
            judul: "Lamaran & Pernikahan",
            deskripsi: "Dengan restu kedua keluarga, kami memantapkan hati untuk mengikat janji suci dan memulai perjalanan baru sebagai satu keluarga.",
            foto: "assets/images/story-3.jpg",
            fotoAlt: "Lamaran {{turunan.nama.pasanganDan}}"
        },
        {
            label: "PERNIKAHAN",
            judul: "Pernikahan",
            deskripsi: "Hari di mana janji suci diucapkan di hadapan Tuhan dan para saksi, mengawali kehidupan bahtera rumah tangga yang penuh kehangatan.",
            foto: "assets/images/story-4.jpg",
            fotoAlt: "Kisah {{turunan.nama.pasanganDan}}"
        }
    ],

    /* ---------- Galeri & video ---------- */
    galeri: {
        videoEmbedUrl: "https://www.youtube.com/embed/CglBdEdY2T4",
        videoJudul: "Wedding Video {{turunan.nama.pasangan}}",
        videoCaption: "Sebuah cerita, sebuah perjalanan, dan sebuah momen yang akan selalu kami kenang.",
        foto: [
            { src: "assets/images/foto1.jpg", alt: "Foto {{turunan.nama.pasanganDan}} 1" },
            { src: "assets/images/foto2.jpg", alt: "Foto {{turunan.nama.pasanganDan}} 2" },
            { src: "assets/images/foto3.jpg", alt: "Foto {{turunan.nama.pasanganDan}} 3" },
            { src: "assets/images/foto4.jpg", alt: "Foto {{turunan.nama.pasanganDan}} 4" },
            { src: "assets/images/foto5.jpg", alt: "Foto {{turunan.nama.pasanganDan}} 5" },
            { src: "assets/images/foto6.jpg", alt: "Foto {{turunan.nama.pasanganDan}} 6" }
        ]
    },

    /* ---------- Kutipan / doa ---------- */
    quote: {
        teksArab: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
        kutipan: "Ya Tuhan kami, anugerahkanlah kepada kami pasangan dan keturunan yang menjadi penyejuk hati...",
        sumber: "QS. Al-Furqan: 74"
    },

    /* ---------- Amplop digital & kirim kado ---------- */
    amplop: {
        pengantar: "Doa restu Anda merupakan hadiah terindah. Namun jika ingin memberi hadiah, Anda dapat menggunakan fitur di bawah ini:",
        // Kosongkan qrisUrl ("") bila tidak memakai QRIS.
        // NOTE(amplop): qrisUrl kosong → blok QRIS disembunyikan otomatis oleh engine.
        qrisUrl: "",
        rekening: [
            // TODO(amplop): data rekening di bawah masih contoh — ganti dengan data klien.
            { bank: "BANK BCA", noRek: "1234 5678 90", atasNama: "Andi Prasetyo" },
            { bank: "BANK BCA", noRek: "4567 5678 21", atasNama: "Sari Wulandari" }
        ],
        kirimKado: {
            penerima: "Andi Prasetyo",
            noHp: "0812-3456-7890",
            // TODO(kado): placeholder alamat — wajib diganti agar tombol salin berguna.
            alamat: "Masukkan alamat lengkap penerima kado di sini"
        }
    },

    /* ---------- RSVP & buku tamu ---------- */
    rsvp: {
        subjudul: "Bagikan konfirmasi kehadiran serta doa terbaik untuk {{turunan.nama.pasangan}}.",
        // SECURITY(rsvp): URL ini publik (terlihat di sumber halaman). Pastikan Apps Script
        //   memvalidasi input, membatasi panjang, dan tidak memberi akses tulis ke sheet lain.
        // TODO(rsvp): tiap klien butuh deployment Apps Script sendiri; jangan pakai ulang URL ini.
        googleScriptUrl: "https://script.google.com/macros/s/AKfycby0ijLbTlRvzkjtySPbHRTmf0CxJhSezpaPzvY8mIDeP53kLFg50IM91dqGvsj4U7befw/exec"
    },

    /* ---------- Musik latar ---------- */
    musik: {
        file: "assets/music/wedding-song.mp3",
        // NOTE(musik): rentang valid 0–1; di luar itu script.js memakai fallback 0.45.
        volume: 0.45
    }
};

// Pastikan tersedia di global scope untuk template-engine.js & script.js
window.WEDDING_CONFIG = WEDDING_CONFIG;
