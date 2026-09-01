/* ============================================================
   WEDDING INVITATION — JAVASCRIPT
   File: script.js

   Fungsi:
   - Membuka undangan
   - Navbar
   - Mobile menu
   - Countdown
   - Save to Calendar
   - Gallery / Lightbox
   - RSVP / Ucapan
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       KONFIGURASI
       ========================================================= */

    const WEDDING_DATE = "2025-10-25T08:00:00+07:00";


    /* =========================================================
       ELEMENT WEBSITE
       ========================================================= */

    const openingScreen =
        document.getElementById("openingScreen");

    const openInvitation =
        document.getElementById("openInvitation");

    const siteHeader =
        document.getElementById("siteHeader");

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinks =
        document.querySelector(".nav-links");

    const daysEl =
        document.getElementById("days");

    const hoursEl =
        document.getElementById("hours");

    const minutesEl =
        document.getElementById("minutes");

    const secondsEl =
        document.getElementById("seconds");

    const calendarButton =
        document.getElementById("calendarButton");

    const rsvpForm =
        document.getElementById("rsvpForm");

    const formStatus =
        document.getElementById("formStatus");

    const lightbox =
        document.getElementById("lightbox");

    const lightboxImage =
        document.getElementById("lightboxImage");

    const lightboxClose =
        document.getElementById("lightboxClose");


    /* =========================================================
       1. PEMBUKA UNDANGAN
       ========================================================= */

    function openWeddingInvitation() {

        if (!openingScreen) {
            return;
        }

        /* Hilangkan cover */
        openingScreen.classList.add("is-hidden");

        /* Aktifkan kembali scroll */
        document.body.classList.remove("locked");

        /* Tampilkan navbar */
        if (siteHeader) {
            siteHeader.classList.add("visible");
        }

        /*
         * Setelah animasi selesai,
         * pastikan cover benar-benar tidak bisa
         * menangkap klik.
         */
        setTimeout(() => {

            openingScreen.style.display = "none";

        }, 700);
    }


    /*
     * Saat halaman pertama kali dibuka,
     * body dikunci agar user fokus ke cover.
     */
    if (openingScreen) {

        document.body.classList.add("locked");

    }


    /*
     * Tombol Buka Undangan
     */
    if (openInvitation) {

        openInvitation.addEventListener(
            "click",
            openWeddingInvitation
        );

    }


    /*
     * Jika user menekan Enter pada keyboard
     */
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
       2. NAVBAR
       ========================================================= */

    window.addEventListener(
        "scroll",
        () => {

            if (
                openingScreen &&
                openingScreen.classList.contains("is-hidden")
            ) {

                if (siteHeader) {

                    siteHeader.classList.add("visible");

                }

            }

        },
        { passive: true }
    );


    /* =========================================================
       3. MOBILE MENU
       ========================================================= */

    if (menuToggle && navLinks) {

        menuToggle.addEventListener(
            "click",
            () => {

                navLinks.classList.toggle("open");

            }
        );


        /*
         * Tutup menu setelah memilih menu
         */
        const navigationLinks =
            navLinks.querySelectorAll("a");


        navigationLinks.forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    navLinks.classList.remove("open");

                }
            );

        });

    }


    /* =========================================================
       4. COUNTDOWN
       ========================================================= */

    function updateCountdown() {

        /*
         * Kalau elemen countdown tidak ada,
         * fungsi tidak perlu dijalankan.
         */
        if (
            !daysEl ||
            !hoursEl ||
            !minutesEl ||
            !secondsEl
        ) {

            return;

        }


        const target =
            new Date(WEDDING_DATE).getTime();

        const now =
            Date.now();

        const difference =
            target - now;


        /*
         * Kalau tanggal sudah lewat
         */
        if (difference <= 0) {

            daysEl.textContent = "000";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            secondsEl.textContent = "00";

            return;

        }


        const totalSeconds =
            Math.floor(difference / 1000);


        const days =
            Math.floor(
                totalSeconds / 86400
            );


        const hours =
            Math.floor(
                (totalSeconds % 86400) / 3600
            );


        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );


        const seconds =
            totalSeconds % 60;


        daysEl.textContent =
            String(days).padStart(3, "0");


        hoursEl.textContent =
            String(hours).padStart(2, "0");


        minutesEl.textContent =
            String(minutes).padStart(2, "0");


        secondsEl.textContent =
            String(seconds).padStart(2, "0");

    }


    /*
     * Jalankan countdown
     */
    updateCountdown();


    setInterval(
        updateCountdown,
        1000
    );


    /* =========================================================
       5. SAVE TO CALENDAR
       ========================================================= */

    if (calendarButton) {

        calendarButton.addEventListener(
            "click",
            () => {

                const icsContent = [

                    "BEGIN:VCALENDAR",

                    "VERSION:2.0",

                    "PRODID:-//Andi & Sari Wedding//ID",

                    "BEGIN:VEVENT",

                    "UID:andi-sari-wedding-2025@example.com",

                    "DTSTAMP:20250831T000000Z",

                    "DTSTART:20251025T010000Z",

                    "DTEND:20251025T090000Z",

                    "SUMMARY:Pernikahan Andi & Sari",

                    "LOCATION:Gedung Serbaguna Cempaka, Jakarta Selatan",

                    "DESCRIPTION:Akad Nikah dan Resepsi Pernikahan Andi & Sari.",

                    "END:VEVENT",

                    "END:VCALENDAR"

                ].join("\r\n");


                const blob =
                    new Blob(
                        [icsContent],
                        {
                            type:
                                "text/calendar;charset=utf-8"
                        }
                    );


                const url =
                    URL.createObjectURL(blob);


                const link =
                    document.createElement("a");


                link.href = url;

                link.download =
                    "andi-sari-wedding.ics";


                document.body.appendChild(link);

                link.click();

                link.remove();


                /*
                 * Beri waktu browser menggunakan URL
                 * sebelum URL dihapus.
                 */
                setTimeout(() => {

                    URL.revokeObjectURL(url);

                }, 1000);

            }
        );

    }


    /* =========================================================
       6. GALERI / LIGHTBOX
       ========================================================= */

    const galleryItems =
        document.querySelectorAll(".gallery-item");


    if (
        lightbox &&
        lightboxImage &&
        galleryItems.length > 0
    ) {

        galleryItems.forEach((item) => {

            item.addEventListener(
                "click",
                () => {

                    /*
                     * Ambil gambar dari data-full
                     */
                    const fullImage =
                        item.dataset.full;


                    /*
                     * Kalau data-full tidak ada,
                     * coba ambil gambar dari img
                     */
                    let imageSource =
                        fullImage;


                    if (!imageSource) {

                        const image =
                            item.querySelector("img");


                        if (image) {

                            imageSource =
                                image.src;

                        }

                    }


                    if (!imageSource) {
                        return;
                    }


                    lightboxImage.src =
                        imageSource;


                    lightbox.classList.add(
                        "is-open"
                    );


                    lightbox.setAttribute(
                        "aria-hidden",
                        "false"
                    );


                    document.body.classList.add(
                        "locked"
                    );

                }
            );

        });

    }


    /* =========================================================
       TUTUP LIGHTBOX
       ========================================================= */

    function closeLightbox() {

        if (!lightbox) {
            return;
        }


        lightbox.classList.remove(
            "is-open"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        if (lightboxImage) {

            lightboxImage.src = "";

        }


        /*
         * Hanya unlock kalau opening invitation
         * sudah dibuka.
         */
        if (
            !openingScreen ||
            openingScreen.classList.contains("is-hidden")
        ) {

            document.body.classList.remove(
                "locked"
            );

        }

    }


    if (lightboxClose) {

        lightboxClose.addEventListener(
            "click",
            closeLightbox
        );

    }


    /*
     * Klik area luar foto
     */
    if (lightbox) {

        lightbox.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === lightbox
                ) {

                    closeLightbox();

                }

            }
        );

    }


    /*
     * Tombol Escape
     */
    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                lightbox &&
                lightbox.classList.contains("is-open")
            ) {

                closeLightbox();

            }

        }
    );


    /* =========================================================
       7. RSVP / UCAPAN
       ========================================================= */

    if (rsvpForm) {

        rsvpForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const guestNameElement =
                    document.getElementById(
                        "guestName"
                    );


                const attendanceElement =
                    document.getElementById(
                        "attendance"
                    );


                const messageElement =
                    document.getElementById(
                        "message"
                    );


                const guestName =
                    guestNameElement
                        ? guestNameElement.value.trim()
                        : "";


                const attendance =
                    attendanceElement
                        ? attendanceElement.value
                        : "";


                const message =
                    messageElement
                        ? messageElement.value.trim()
                        : "";


                /*
                 * Validasi
                 */
                if (
                    !guestName ||
                    !attendance ||
                    !message
                ) {

                    if (formStatus) {

                        formStatus.textContent =
                            "Mohon lengkapi semua kolom terlebih dahulu.";

                    }

                    return;

                }


                /*
                 * Data RSVP
                 */
                const rsvpData = {

                    name: guestName,

                    attendance: attendance,

                    message: message,

                    submittedAt:
                        new Date().toISOString()

                };


                /*
                 * Ambil data sebelumnya
                 */
                let previousData = [];


                try {

                    previousData =
                        JSON.parse(
                            localStorage.getItem(
                                "andiSariRSVP"
                            ) || "[]"
                        );


                    /*
                     * Pastikan datanya array
                     */
                    if (
                        !Array.isArray(previousData)
                    ) {

                        previousData = [];

                    }

                } catch (error) {

                    previousData = [];

                }


                /*
                 * Tambahkan data baru
                 */
                previousData.push(
                    rsvpData
                );


                /*
                 * Simpan ke browser
                 */
                try {

                    localStorage.setItem(
                        "andiSariRSVP",
                        JSON.stringify(
                            previousData
                        )
                    );

                } catch (error) {

                    console.error(
                        "Gagal menyimpan RSVP:",
                        error
                    );

                }


                /*
                 * Pesan sukses
                 */
                if (formStatus) {

                    formStatus.textContent =
                        `Terima kasih, ${guestName}. Ucapan Anda sudah tersimpan di browser ini.`;

                }


                /*
                 * Reset form
                 */
                rsvpForm.reset();

            }
        );

    }


    /* =========================================================
       8. SMOOTH SCROLL
       Untuk semua link dengan href="#..."
       ========================================================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetId =
                        link.getAttribute("href");


                    /*
                     * Jangan lakukan apa-apa
                     * untuk href="#"
                     */
                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    /*
                     * Offset navbar
                     */
                    const headerHeight =
                        siteHeader
                            ? siteHeader.offsetHeight
                            : 0;


                    const targetPosition =
                        target.getBoundingClientRect().top +
                        window.scrollY -
                        headerHeight;


                    window.scrollTo({

                        top:
                            targetPosition,

                        behavior:
                            "smooth"

                    });

                }
            );

        });


    /* =========================================================
       9. CEK STATUS AWAL
       ========================================================= */

    /*
     * Kalau opening screen tidak ada,
     * jangan mengunci body.
     */
    if (!openingScreen) {

        document.body.classList.remove(
            "locked"
        );

    }


    /*
     * Pastikan navbar bisa tampil
     * setelah undangan dibuka.
     */
    if (
        openingScreen &&
        openingScreen.classList.contains("is-hidden") &&
        siteHeader
    ) {

        siteHeader.classList.add(
            "visible"
        );

    }

});