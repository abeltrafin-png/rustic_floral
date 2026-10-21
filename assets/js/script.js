/* ============================================================
WEDDING INVITATION — JAVASCRIPT
File: script.js
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
    1. KONFIGURASI & ELEMENT
    ========================================================= */

    const WEDDING_DATE = "2027-02-21T08:00:00+07:00";

    const openingScreen = document.getElementById("openingScreen");
    const openInvitation = document.getElementById("openInvitation");
    const siteHeader = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

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

    /* FLOATING NAVBAR — ACTIVE LINK */
    const mobileNavLinks = document.querySelectorAll(".mobile-nav a");

    mobileNavLinks.forEach((link) => {
        link.addEventListener("click", () => {
            mobileNavLinks.forEach((item) => {
                item.classList.remove("active");
            });

            link.classList.add("active");
        });
    });

    /* ============================================================
    WEDDING BACKGROUND MUSIC
    ============================================================ */

    const music = document.getElementById("weddingMusic");
    const musicControl = document.getElementById("musicControl");
    const openInvitationButton = document.getElementById("openInvitation");

    if (music && musicControl) {

        // Volume awal
        music.volume = 0.45;

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

        function playMusic() {
            music.play()
                .then(() => {
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

    function openWeddingInvitation() {
        if (!openingScreen) return;

        openingScreen.classList.add("is-hidden");
        document.body.classList.remove("locked");

        if (siteHeader) {
            siteHeader.classList.add("visible");
        }

        setTimeout(() => {
            openingScreen.style.display = "none";
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
    3. NAVBAR & MOBILE MENU
    ========================================================= */

    window.addEventListener("scroll", () => {
        if (openingScreen && openingScreen.classList.contains("is-hidden")) {
            if (siteHeader) siteHeader.classList.add("visible");
        }
    }, { passive: true });

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open");
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
            });
        });
    }


    /* =========================================================
    4. COUNTDOWN
    ========================================================= */

    function updateCountdown() {
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        const target = new Date(WEDDING_DATE).getTime();
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
    setInterval(updateCountdown, 1000);


    /* =========================================================
    5. SAVE TO CALENDAR
    ========================================================= */

    if (calendarButton) {
        calendarButton.addEventListener("click", () => {
            const icsContent = [
                "BEGIN:VCALENDAR",
                "VERSION:2.0",
                "PRODID:-//Andi & Sari Wedding//ID",
                "CALSCALE:GREGORIAN",
                "BEGIN:VEVENT",
                "UID:andi-sari-wedding-2027@example.com",
                "DTSTAMP:20260919T000000Z",
                "DTSTART:20270221T010000Z",
                "DTEND:20270221T030000Z",
                "SUMMARY:Akad Nikah Andi & Sari",
                "LOCATION:Masjid Jami' Al-Ikhlas, Jl. Raya Ragunan No. 11A, Jati Padang, Pasar Minggu, Jakarta Selatan",
                "DESCRIPTION:Akad Nikah Andi & Sari.",
                "END:VEVENT",
                "END:VCALENDAR"
            ].join("\r\n");

            const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "andi-sari-akad.ics";
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
    const mapSlides = document.querySelectorAll(".map-slide");
    const mapDots = document.querySelectorAll(".map-dot");
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
    const gallerySlides = document.querySelectorAll(".gallery-slide");
    const galleryPrev = document.getElementById("galleryPrev");
    const galleryNext = document.getElementById("galleryNext");
    const galleryDotsContainer = document.getElementById("galleryDots");
    const galleryItems = document.querySelectorAll(".gallery-item");

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

    const GOOGLE_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycby0ijLbTlRvzkjtySPbHRTmf0CxJhSezpaPzvY8mIDeP53kLFg50IM91dqGvsj4U7befw/exec";

    const guestbookHistory = document.getElementById("guestbookHistory");
    const loadMoreMessages = document.getElementById("loadMoreMessages");

    let guestbookMessages = [];
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

    function loadGuestbook() {
        if (!guestbookHistory) return;

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
                !["Hadir", "Tidak Hadir"].includes(attendance)
            ) {
                if (formStatus) {
                    formStatus.textContent =
                        "Mohon lengkapi semua kolom terlebih dahulu.";
                }
                return;
            }

            if (submitButton?.disabled) return;

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

            const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

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

    if (openingScreen && openingScreen.classList.contains("is-hidden") && siteHeader) {
        siteHeader.classList.add("visible");
    }

    /* =========================================================
       11. AMPLOP DIGITAL / SALIN REKENING & ALAMAT KADO
       ========================================================= */

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

    function salinRekening() {
        const accountElement = document.getElementById("accountBCA");

        if (!accountElement) {
            alert("Nomor rekening tidak ditemukan.");
            return;
        }

        const nomorRekening = accountElement.textContent.trim().replace(/\s+/g, "");

        salinTeksGift(
            nomorRekening,
            "Nomor rekening berhasil disalin!"
        );
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
    
    // Agar dapat dipanggil oleh atribut onclick pada HTML.
    window.salinRekening = salinRekening;
    window.salinAlamatKado = salinAlamatKado;

});