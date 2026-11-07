/* ============================================================
WEDDING INVITATION — JAVASCRIPT (INTERAKSI & FITUR)
File: script.js

Seluruh data klien dibaca dari window.WEDDING_DATA yang
disiapkan oleh template-engine.js (sumber: config.js).
Tidak ada nama, tanggal, URL, atau nomor rekening yang
ditulis langsung (hardcode) di berkas ini.

Urutan muat: config.js → template-engine.js → script.js
============================================================ */

/* ------------------------------------------------------------
   KONVENSI MARKER COMMENT  →  // TAG(lingkup): keterangan
   TODO      pekerjaan yang harus dilakukan sebelum rilis / belum ada
   FIXME     perilaku salah yang diketahui, perlu diperbaiki
   BUG       kesalahan nyata yang bisa dipicu pengguna
   REFACTOR  perilaku benar, struktur kode perlu dirapikan (DRY, dll.)
   SECURITY  catatan keamanan / batas kepercayaan data
   PERF      catatan kinerja
   CLEANUP   sisa debug atau kode yang boleh dibuang
   NOTE      konteks penting agar tidak salah ubah (angka sihir, kontrak)
   Anotasi tipe memakai JSDoc (@param, @returns, @typedef).
   Indeks seluruh marker: lihat ANNOTATION_INDEX.md
   ------------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
    1. KONFIGURASI & ELEMENT
    ========================================================= */

    // Data klien (hasil olahan template-engine.js dari config.js)
    // NOTE(data): DATA bersifat read-only. Seluruh teks klien harus lewat WEDDING_DATA.
    const DATA = window.WEDDING_DATA || {};

    if (!window.WEDDING_DATA) {
        console.error("WEDDING_DATA tidak ditemukan. Pastikan config.js dan template-engine.js dimuat sebelum script.js.");
    }

    // Ambil nilai bersarang dari DATA, mis. dataAt("acara.akad.tempat")
    // REFACTOR(dry): duplikat TemplateEngine.getNestedValue. Ganti dengan
    //   (p) => window.TemplateEngine.getNestedValue(DATA, p).
    /** @param {string} path @returns {*} nilai dari DATA, atau undefined */
    const dataAt = (path) => {
        return path.split(".").reduce((acc, part) => {
            return acc !== null && acc !== undefined ? acc[part] : undefined;
        }, DATA);
    };

    const openingScreen = document.getElementById("openingScreen");
    const openInvitation = document.getElementById("openInvitation");

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    const calendarButton = document.getElementById("calendarButton");
    const rsvpForm = document.getElementById("rsvpForm");
    const formStatus = document.getElementById("formStatus");

    // Modal Galeri Element
    const galleryModal = document.getElementById("galleryModal");
    const galleryModalImg = document.getElementById("galleryModalImg");
    const galleryModalClose = document.getElementById("galleryModalClose");

    /* ============================================================
    WEDDING BACKGROUND MUSIC
    ============================================================ */

    const music = document.getElementById("weddingMusic");
    const musicControl = document.getElementById("musicControl");
    // REFACTOR(dup): elemen yang sama dengan `openInvitation` di atas; pakai satu variabel.
    const openInvitationButton = document.getElementById("openInvitation");

    if (music && musicControl) {

        // Volume awal (dari config.musik.volume, default 0.45)
        const configuredVolume = Number(dataAt("musik.volume"));
        music.volume =
            Number.isFinite(configuredVolume) && configuredVolume >= 0 && configuredVolume <= 1
                ? configuredVolume
                : 0.45;

        /* ------------------------------------------------------------
        UPDATE TOMBOL MUSIK
        ------------------------------------------------------------ */

        function updateMusicButton() {
            if (!music.paused) {
                musicControl.classList.add("playing");

                musicControl.setAttribute("aria-label", "Jeda musik");
                musicControl.setAttribute("aria-pressed", "true");
            } else {
                musicControl.classList.remove("playing");

                musicControl.setAttribute("aria-label", "Putar musik");
                musicControl.setAttribute("aria-pressed", "false");
            }
        }

        /* ------------------------------------------------------------
        PLAY MUSIC
        ------------------------------------------------------------ */

        /**
         * Putar musik latar. Browser hanya mengizinkan play() setelah gestur pengguna,
         * jadi fungsi ini harus dipanggil dari handler klik.
         */
        function playMusic() {
            music.play()
                .then(() => {
                    // CLEANUP(debug): hapus console.log sebelum rilis produksi.
                    console.log("Musik berhasil diputar.");
                    updateMusicButton();
                })
                .catch((error) => {
                    console.error("Musik gagal diputar:", error);
                    updateMusicButton();
                });
        }

        /* ------------------------------------------------------------
        PAUSE MUSIC
        ------------------------------------------------------------ */

        function pauseMusic() {
            music.pause();
            updateMusicButton();
        }

        /* ------------------------------------------------------------
        BUKA UNDANGAN
        ------------------------------------------------------------ */

        if (openInvitationButton) {
            openInvitationButton.addEventListener("click", function () {

                // Jalankan musik setelah user klik tombol
                playMusic();

            });
        }

        /* ------------------------------------------------------------
        TOMBOL PLAY / PAUSE
        ------------------------------------------------------------ */

        musicControl.addEventListener("click", function () {

            if (music.paused) {
                playMusic();
            } else {
                pauseMusic();
            }

        });

        /* ------------------------------------------------------------
        UPDATE STATUS
        ------------------------------------------------------------ */

        music.addEventListener("play", updateMusicButton);
        music.addEventListener("pause", updateMusicButton);

        updateMusicButton();
    }

    /* =========================================================
    2. PEMBUKA UNDANGAN
    ========================================================= */

    /** Tutup layar sampul dan buka kunci scroll halaman. */
    function openWeddingInvitation() {
        if (!openingScreen) return;

        openingScreen.classList.add("is-hidden");
        document.body.classList.remove("locked");

        setTimeout(() => {
            openingScreen.style.display = "none";
        // NOTE(anim): 700ms harus sama dengan durasi transisi .is-hidden di style.css.
        }, 700);
    }

    if (openingScreen) {
        document.body.classList.add("locked");
    }

    if (openInvitation) {
        openInvitation.addEventListener("click", openWeddingInvitation);
    }

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Enter" &&
            openingScreen &&
            !openingScreen.classList.contains("is-hidden")
        ) {
            openWeddingInvitation();
        }
    });


    /* =========================================================
    3. NAVBAR & SCROLL SPY
    → ditangani oleh modul di bagian paling bawah berkas ini.
    ========================================================= */


    /* =========================================================
    4. COUNTDOWN
    ========================================================= */

    /** Perbarui angka hitung mundur ke waktu mulai akad (turunan.countdownTarget). */
    function updateCountdown() {
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        // Target dihitung engine dari config.acara.akad (tanggal + jam mulai)
        const target = new Date(dataAt("turunan.countdownTarget")).getTime();
        if (Number.isNaN(target)) return;

        const now = Date.now();
        const difference = target - now;

        if (difference <= 0) {
            daysEl.textContent = "000";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            secondsEl.textContent = "00";
            return;
        }

        const totalSeconds = Math.floor(difference / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        daysEl.textContent = String(days).padStart(3, "0");
        hoursEl.textContent = String(hours).padStart(2, "0");
        minutesEl.textContent = String(minutes).padStart(2, "0");
        secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    // PERF(timer): interval tidak pernah dihentikan, bahkan setelah acara lewat
    //   (selalu 00). Simpan id-nya dan clearInterval saat difference <= 0.
    setInterval(updateCountdown, 1000);


    /* =========================================================
    5. SAVE TO CALENDAR
    ========================================================= */

    // Format tanggal ISO → format iCalendar UTC (YYYYMMDDTHHMMSSZ)
    // REFACTOR(dry): sama dengan keFormatKalenderUTC() di template-engine.js.
    function toICSDate(iso) {
        return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    }

    // Escape karakter khusus iCalendar
    /** Escape karakter khusus iCalendar (RFC 5545 §3.3.11). @param {string} text @returns {string} */
    function escapeICS(text) {
        return String(text || "")
            .replace(/\\/g, "\\\\")
            .replace(/;/g, "\\;")
            .replace(/,/g, "\\,")
            .replace(/\n/g, "\\n");
    }

    // TODO(kalender): hanya akad yang diekspor. Resepsi (turunan.resepsi) belum masuk .ics
    //   — tambahkan VEVENT kedua atau buat tombol terpisah.
    if (calendarButton) {
        calendarButton.addEventListener("click", () => {
            const akad = dataAt("acara.akad") || {};
            const turunanAkad = dataAt("turunan.akad") || {};
            const pasangan = dataAt("turunan.nama.pasangan") || "";
            const pasanganLengkap = dataAt("turunan.nama.pasanganLengkap") || "";

            if (!turunanAkad.mulaiISO || !turunanAkad.selesaiISO) {
                console.error("Data waktu akad belum lengkap di config.js.");
                return;
            }

            const slug = pasangan.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "wedding";

            const icsContent = [
                "BEGIN:VCALENDAR",
                "VERSION:2.0",
                `PRODID:-//${escapeICS(pasangan)} Wedding//ID`,
                "CALSCALE:GREGORIAN",
                "BEGIN:VEVENT",
                `UID:${slug}-${akad.tanggal}@wedding-invitation`,
                `DTSTAMP:${toICSDate(new Date().toISOString())}`,
                `DTSTART:${toICSDate(turunanAkad.mulaiISO)}`,
                `DTEND:${toICSDate(turunanAkad.selesaiISO)}`,
                `SUMMARY:${escapeICS(`${akad.judul} ${pasangan}`)}`,
                `LOCATION:${escapeICS(`${akad.tempat}, ${akad.alamat}`)}`,
                // FIXME(ics): RFC 5545 mewajibkan line folding (maks. 75 oktet per baris). Teks
                //   panjang (LOCATION/DESCRIPTION) bisa ditolak oleh sebagian aplikasi kalender.
                `DESCRIPTION:${escapeICS(`${akad.judul} ${pasanganLengkap}.`)}`,
                "END:VEVENT",
                "END:VCALENDAR"
            ].join("\r\n");

            const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `${slug}-akad.ics`;
            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);
        });
    }


    /* =========================================================
    6. MAP SLIDER
    ========================================================= */

    const mapSlider = document.getElementById("mapSlider");
    const mapTrack = document.querySelector(".map-track");
    // Slide yang disembunyikan engine (data kosong) tidak ikut dihitung
    const mapSlides = document.querySelectorAll(".map-slide:not([hidden])");
    const mapDots = document.querySelectorAll(".map-dot:not([hidden])");
    const mapPrev = document.getElementById("mapPrev");
    const mapNext = document.getElementById("mapNext");

    let currentMap = 0;

    function showMap(index) {
        if (!mapTrack || mapSlides.length === 0) return;

        currentMap = (index + mapSlides.length) % mapSlides.length;
        mapTrack.style.transform = `translateX(-${currentMap * 100}%)`;

        mapSlides.forEach((slide, i) => {
            slide.classList.toggle("active", i === currentMap);
        });

        mapDots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentMap);
            dot.setAttribute("aria-current", i === currentMap ? "true" : "false");
        });
    }

    if (mapPrev) {
        mapPrev.addEventListener("click", () => showMap(currentMap - 1));
    }

    if (mapNext) {
        mapNext.addEventListener("click", () => showMap(currentMap + 1));
    }

    mapDots.forEach((dot, index) => {
        dot.addEventListener("click", () => showMap(index));
    });

    if (mapSlides.length > 0) {
        showMap(0);
    }

    // Hanya satu lokasi → sembunyikan kontrol slider
    if (mapSlides.length < 2) {
        [mapPrev, mapNext, document.querySelector(".map-dots")].forEach((el) => {
            if (el) el.hidden = true;
        });
    }

    // Touch Swipe Map
    let touchStartX = 0;
    let touchEndX = 0;

    if (mapSlider) {
        mapSlider.addEventListener("touchstart", (event) => {
            touchStartX = event.changedTouches[0].clientX;
        }, { passive: true });

        mapSlider.addEventListener("touchend", (event) => {
            touchEndX = event.changedTouches[0].clientX;
            const swipeDistance = touchStartX - touchEndX;

            if (swipeDistance > 50) showMap(currentMap + 1);
            if (swipeDistance < -50) showMap(currentMap - 1);
        }, { passive: true });
    }


/* =========================================================
    7. GALERI / LIGHTBOX MODAL & MOBILE SLIDER
    ========================================================= */

    const gallerySlider = document.getElementById("gallerySlider");
    const galleryTrack = document.querySelector(".gallery-track");
    const gallerySlides = document.querySelectorAll(".gallery-slide:not([hidden])");
    const galleryPrev = document.getElementById("galleryPrev");
    const galleryNext = document.getElementById("galleryNext");
    const galleryDotsContainer = document.getElementById("galleryDots");
    const galleryItems = document.querySelectorAll(".gallery-item:not([hidden])");

    let currentGalleryIndex = 0;
    let isMobileView = window.innerWidth <= 768;

    // Inisialisasi Dots Slider Foto untuk Mobile
    if (galleryDotsContainer && gallerySlides.length > 0) {
        galleryDotsContainer.innerHTML = "";
        gallerySlides.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.classList.add("gallery-dot");
            if (index === 0) dot.classList.add("active");
            dot.addEventListener("click", () => showGallerySlide(index));
            galleryDotsContainer.appendChild(dot);
        });
    }

    const galleryDots = document.querySelectorAll(".gallery-dot");

    function showGallerySlide(index) {
        if (!galleryTrack || gallerySlides.length === 0 || !isMobileView) return;

        currentGalleryIndex = (index + gallerySlides.length) % gallerySlides.length;
        galleryTrack.style.transform = `translateX(-${currentGalleryIndex * 100}%)`;

        galleryDots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentGalleryIndex);
        });
    }

    if (galleryPrev) {
        galleryPrev.addEventListener("click", () => showGallerySlide(currentGalleryIndex - 1));
    }

    if (galleryNext) {
        galleryNext.addEventListener("click", () => showGallerySlide(currentGalleryIndex + 1));
    }

    // Touch / Swipe Khusus Mobile pada Galeri
    let galleryTouchStartX = 0;
    let galleryTouchEndX = 0;

    if (gallerySlider) {
        gallerySlider.addEventListener("touchstart", (e) => {
            if (!isMobileView) return;
            galleryTouchStartX = e.changedTouches[0].clientX;
        }, { passive: true });

        gallerySlider.addEventListener("touchend", (e) => {
            if (!isMobileView) return;
            galleryTouchEndX = e.changedTouches[0].clientX;
            const diff = galleryTouchStartX - galleryTouchEndX;

            if (diff > 40) showGallerySlide(currentGalleryIndex + 1);
            if (diff < -40) showGallerySlide(currentGalleryIndex - 1);
        }, { passive: true });
    }

    // Handlers Resizing Window
    window.addEventListener("resize", () => {
        isMobileView = window.innerWidth <= 768;
        if (!isMobileView && galleryTrack) {
            galleryTrack.style.transform = "none"; // Reset transformasi saat kembali ke Desktop
        } else {
            showGallerySlide(currentGalleryIndex);
        }
    });

    // Lightbox Modal
    function openGalleryModal(imageSrc) {
        if (!galleryModal || !galleryModalImg) return;
        galleryModalImg.src = imageSrc;
        galleryModal.classList.add("active");
        galleryModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("locked");
    }

    function closeGalleryModal() {
        if (!galleryModal) return;
        galleryModal.classList.remove("active");
        galleryModal.setAttribute("aria-hidden", "true");
        if (galleryModalImg) galleryModalImg.src = "";

        if (!openingScreen || openingScreen.classList.contains("is-hidden")) {
            document.body.classList.remove("locked");
        }
    }

    galleryItems.forEach((item) => {
        item.addEventListener("click", () => {
            const img = item.querySelector("img");
            if (img && img.src) {
                openGalleryModal(img.src);
            }
        });
    });

    if (galleryModalClose) {
        galleryModalClose.addEventListener("click", closeGalleryModal);
    }

    if (galleryModal) {
        galleryModal.addEventListener("click", (event) => {
            if (event.target === galleryModal) {
                closeGalleryModal();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            galleryModal &&
            galleryModal.classList.contains("active")
        ) {
            closeGalleryModal();
        }
    });

    
    
    /* =========================================================
    8. RSVP / UCAPAN — GOOGLE SHEETS + RIWAYAT UCAPAN
    ========================================================= */

    // Endpoint Google Apps Script (dari config.rsvp.googleScriptUrl)
    const GOOGLE_SCRIPT_URL = dataAt("rsvp.googleScriptUrl") || "";

    const guestbookHistory = document.getElementById("guestbookHistory");
    const loadMoreMessages = document.getElementById("loadMoreMessages");

    let guestbookMessages = [];
    // REFACTOR(const): angka 5 muncul 3x (awal, reset, tombol "lainnya"). Jadikan PAGE_SIZE.
    let visibleMessages = 5;
    let guestbookRequestId = 0;

    /* =========================================================
    FORMAT TANGGAL
    ========================================================= */

    function formatGuestbookDate(value) {
        if (!value) return "";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    }

    /* =========================================================
    TAMPILKAN RIWAYAT UCAPAN
    ========================================================= */

    function renderGuestbook() {
        if (!guestbookHistory) return;

        guestbookHistory.replaceChildren();

        if (guestbookMessages.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.textContent =
                "Belum ada ucapan. Jadilah yang pertama!";

            guestbookHistory.appendChild(emptyMessage);
        } else {
            guestbookMessages
                .slice(0, visibleMessages)
                .forEach((item) => {
                    const card = document.createElement("div");
                    card.className = "guestbook-message";

                    const name = document.createElement("h3");
                    name.textContent =
                        item.name || item.nama || "Tamu";

                    const attendance = document.createElement("p");
                    attendance.textContent =
                        "Kehadiran: " +
                        (item.attendance || item.kehadiran || "-");

                    const message = document.createElement("p");
                    message.textContent =
                        item.message || item.ucapan || "";

                    card.append(name, attendance, message);

                    const dateValue =
                        item.timestamp ||
                        item.waktu ||
                        item.date ||
                        item.tanggal;

                    if (dateValue) {
                        const date = document.createElement("small");
                        date.textContent = formatGuestbookDate(dateValue);
                        card.appendChild(date);
                    }

                    guestbookHistory.appendChild(card);
                });
        }

        if (loadMoreMessages) {
            loadMoreMessages.hidden =
                guestbookMessages.length <= visibleMessages;
        }
    }

    /* =========================================================
    AMBIL RIWAYAT DARI GOOGLE SHEETS MELALUI JSONP
    ========================================================= */

    // SECURITY(jsonp): JSONP mengeksekusi skrip dari URL Apps Script di halaman ini.
    //   Aman hanya bila endpoint dipercaya. Lebih baik pindah ke fetch() + CORS di Apps Script.
    // NOTE(jsonp): callback global sekali pakai dibersihkan oleh finish().
    function loadGuestbook() {
        if (!guestbookHistory) return;

        if (!GOOGLE_SCRIPT_URL) {
            guestbookHistory.textContent = "Fitur ucapan belum dikonfigurasi.";
            return;
        }

        const requestId = ++guestbookRequestId;
        const callbackName =
            "guestbookCallback_" +
            Date.now() +
            "_" +
            Math.random().toString(36).slice(2);

        const script = document.createElement("script");
        let finished = false;

        guestbookHistory.textContent = "Memuat ucapan dan doa...";

        const timeout = setTimeout(() => {
            finish();

            if (requestId === guestbookRequestId) {
                guestbookHistory.textContent =
                    "Riwayat ucapan gagal dimuat. Periksa konfigurasi Apps Script.";
            }
        // NOTE(timeout): batas tunggu 15 detik sebelum pesan gagal muat ditampilkan.
        }, 15000);

        function finish() {
            if (finished) return;
            finished = true;

            clearTimeout(timeout);
            script.remove();
            delete window[callbackName];
        }

        window[callbackName] = function (data) {
            finish();

            if (requestId !== guestbookRequestId) return;

            if (!Array.isArray(data)) {
                guestbookHistory.textContent =
                    "Data riwayat ucapan tidak valid.";
                console.error("Respons riwayat tidak valid:", data);
                return;
            }

            guestbookMessages = data;
            visibleMessages = 5;
            renderGuestbook();
        };

        script.onerror = function () {
            finish();

            if (requestId === guestbookRequestId) {
                guestbookHistory.textContent =
                    "Riwayat ucapan gagal dimuat. Periksa deployment Apps Script.";

                console.error("Gagal mengambil riwayat ucapan.");
            }
        };

        const separator = GOOGLE_SCRIPT_URL.includes("?") ? "&" : "?";

        script.src =
            GOOGLE_SCRIPT_URL +
            separator +
            "callback=" + encodeURIComponent(callbackName) +
            "&_=" + Date.now();

        document.head.appendChild(script);
    }

    /* =========================================================
    TOMBOL LIHAT UCAPAN LAINNYA
    ========================================================= */

    if (loadMoreMessages) {
        loadMoreMessages.addEventListener("click", () => {
            visibleMessages += 5;
            renderGuestbook();
        });
    }

    /* =========================================================
    KIRIM RSVP DAN UCAPAN
    ========================================================= */

    if (rsvpForm) {
        rsvpForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const guestName =
                document.getElementById("guestName")?.value.trim() || "";

            const attendance =
                document.getElementById("attendance")?.value || "";

            const message =
                document.getElementById("message")?.value.trim() || "";

            const submitButton = rsvpForm.querySelector(
                'button[type="submit"]'
            );

            if (
                !guestName ||
                !message ||
                // NOTE(validasi): nilai harus sama persis dengan <option value> di index.html dan
                //   validasi di Apps Script. Validasi klien ini mudah dilewati, jadi bukan pengaman.
                !["Hadir", "Tidak Hadir"].includes(attendance)
            ) {
                if (formStatus) {
                    formStatus.textContent =
                        "Mohon lengkapi semua kolom terlebih dahulu.";
                }
                return;
            }

            if (submitButton?.disabled) return;

            if (!GOOGLE_SCRIPT_URL) {
                if (formStatus) {
                    formStatus.textContent = "Fitur ucapan belum dikonfigurasi.";
                }
                return;
            }

            const rsvpData = {
                name: guestName.slice(0, 100),
                attendance,
                message: message.slice(0, 2000)
            };

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Mengirim...";
            }

            if (formStatus) {
                formStatus.textContent = "Sedang mengirim ucapan...";
            }

            try {
                /*
                * no-cors tidak memberikan respons yang bisa dibaca.
                * Karena itu, kirim data lalu muat ulang riwayat
                * setelah memberi waktu untuk penyimpanan.
                */
                // FIXME(rsvp): mode no-cors → respons tidak terbaca, jadi "Ucapan dikirim" selalu
                //   tampil walau server gagal menyimpan. Pertimbangkan verifikasi lewat loadGuestbook().
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },
                    body: JSON.stringify(rsvpData)
                });

                if (formStatus) {
                    formStatus.textContent =
                        "Ucapan dikirim. Memperbarui riwayat...";
                }

                rsvpForm.reset();

                setTimeout(() => {
                    loadGuestbook();
                // NOTE(rsvp): jeda 2,5 dtk = perkiraan waktu tulis Apps Script ke Sheets (heuristik).
                }, 2500);

            } catch (error) {
                console.error("Gagal mengirim ucapan:", error);

                if (formStatus) {
                    formStatus.textContent =
                        "Pengiriman gagal. Periksa koneksi internet dan coba kembali.";
                }
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    // REFACTOR(label): label tombol di-hardcode di sini. Simpan teks asli sebelum diubah.
                    submitButton.textContent = "♡ Kirim Ucapan";
                }
            }
        });
    }

    /* Muat riwayat saat halaman dibuka */
    loadGuestbook();


    /* =========================================================
    9. SMOOTH SCROLL
    ========================================================= */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();

            const targetPosition = target.getBoundingClientRect().top + window.scrollY;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });


    /* =========================================================
    10. CEK STATUS AWAL
    ========================================================= */

    if (!openingScreen) {
        document.body.classList.remove("locked");
    }

    /* =========================================================
       11. AMPLOP DIGITAL / SALIN REKENING & ALAMAT KADO
       ========================================================= */

    /**
     * Salin teks ke clipboard (Clipboard API, fallback execCommand).
     * @param {string} teks  isi yang disalin
     * @param {string} pesan pesan sukses untuk pengguna
     */
    // REFACTOR(dry): salinRekening() menulis ulang logika yang sama. Gabungkan keduanya.
    // TODO(ux): ganti alert() dengan toast non-blokir.
    async function salinTeksGift(teks, pesan) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(teks);
                alert(pesan);
                return;
            }

            // Fallback untuk browser yang tidak mendukung Clipboard API
            const area = document.createElement("textarea");
            area.value = teks;
            area.setAttribute("readonly", "");
            area.style.position = "fixed";
            area.style.opacity = "0";
            area.style.pointerEvents = "none";

            document.body.appendChild(area);
            area.select();

            const berhasil = document.execCommand("copy");
            area.remove();

            if (berhasil) {
                alert(pesan);
            } else {
                alert("Gagal menyalin. Silakan salin secara manual.");
            }
        } catch (error) {
            console.error("Gagal menyalin informasi hadiah:", error);
            alert("Gagal menyalin. Silakan salin secara manual.");
        }
    }

    function salinRekening(selector) {
        const accountElement = document.querySelector(selector);

        if (!accountElement) {
            console.error("Rekening tidak ditemukan:", selector);
            alert("Nomor rekening tidak ditemukan.");
            return;
        }

        const nomorRekening = accountElement.textContent.trim().replace(/\s+/g, "");

        if (!nomorRekening) {
            alert("Nomor rekening kosong.");
            return;
        }

        // BUG(clipboard): di konteks non-aman (http:// / file://) navigator.clipboard = undefined,
        //   sehingga baris ini melempar TypeError SEBELUM .catch() — fallback tak pernah jalan.
        //   Perbaikan: cek `navigator.clipboard && window.isSecureContext` seperti salinTeksGift().
        navigator.clipboard.writeText(nomorRekening)
            .then(() => {
                alert("Nomor rekening berhasil disalin: " + nomorRekening);
            })
            .catch((error) => {
                console.error("Gagal menyalin rekening:", error);

                // Fallback jika Clipboard API tidak tersedia
                const tempInput = document.createElement("textarea");
                tempInput.value = nomorRekening;
                tempInput.style.position = "fixed";
                tempInput.style.opacity = "0";

                document.body.appendChild(tempInput);
                tempInput.select();
                tempInput.setSelectionRange(0, tempInput.value.length);

                try {
                    const berhasil = document.execCommand("copy");

                    if (berhasil) {
                        alert("Nomor rekening berhasil disalin: " + nomorRekening);
                    } else {
                        alert("Gagal menyalin rekening. Silakan salin manual.");
                    }
                } catch (err) {
                    alert("Gagal menyalin rekening. Silakan salin manual.");
                } finally {
                    tempInput.remove();
                }
            });
    }

    function salinAlamatKado() {
        const namaElement = document.getElementById("giftRecipient");
        const hpElement = document.getElementById("giftPhone");
        const alamatElement = document.getElementById("giftAddress");

        if (!namaElement || !hpElement || !alamatElement) {
            alert("Informasi penerima kado belum lengkap.");
            return;
        }

        const nama = namaElement.textContent.trim();
        const hp = hpElement.textContent.trim();
        const alamat = alamatElement.textContent.trim();

        const informasiKado =
            `Nama Penerima: ${nama}\n` +
            `Nomor HP: ${hp}\n` +
            `Alamat: ${alamat}`;

        salinTeksGift(
            informasiKado,
            "Informasi penerima kado berhasil disalin!"
        );
    }   
    
    // Event delegation: tombol memakai atribut data-*, bukan onclick inline.
    //   data-copy-account="#rekening0"  → salin nomor rekening
    //   data-copy-gift-address          → salin info penerima kado
    document.addEventListener("click", (event) => {
        const accountButton = event.target.closest("[data-copy-account]");

        if (accountButton) {
            salinRekening(accountButton.getAttribute("data-copy-account"));
            return;
        }

        if (event.target.closest("[data-copy-gift-address]")) {
            salinAlamatKado();
        }
    });

});

/* =========================================================
   NAVBAR DESKTOP (klik logo) + SCROLL SPY (desktop & mobile)
========================================================= */
(function () {
    const root = document.getElementById("dnav");
    const toggle = document.getElementById("dnavToggle");
    const menu = document.getElementById("dnavMenu");
    if (!root || !toggle || !menu) return;

    const links = [...menu.querySelectorAll("a")];
    links.forEach((a, i) => a.style.setProperty("--i", i));

    function setOpen(open) {
        root.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
        if (open) toggle.classList.remove("pulse");
    }

    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        setOpen(!root.classList.contains("open"));
    });

    links.forEach((a) => a.addEventListener("click", () => setOpen(false)));

    document.addEventListener("click", (e) => {
        if (!root.contains(e.target)) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setOpen(false);
    });

    /* ---------- Scroll spy ---------- */
    const allLinks = [...document.querySelectorAll(".dnav-menu a, .mobile-nav a")];
    const ids = [...new Set(allLinks.map((a) => a.getAttribute("href").slice(1)))];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

    function setActive(id) {
        allLinks.forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
        });
    }

    let ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const line = window.innerHeight * 0.4;
            let current = sections[0];

            // Seksi yang disembunyikan (data kosong) dilewati
            const visibleSections = sections.filter((s) => !s.hidden);
            current = visibleSections[0];

            visibleSections.forEach((s) => {
                if (s.getBoundingClientRect().top <= line) current = s;
            });

            if (current) setActive(current.id);
            ticking = false;
        });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    // PERF(resize): handler berat dipanggil di tiap event resize tanpa throttle/debounce.
    window.addEventListener("resize", onScroll);
    onScroll();
})();