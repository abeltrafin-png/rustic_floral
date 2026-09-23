    /* ============================================================
    WEDDING INVITATION — JAVASCRIPT
    File: script.js

    Fungsi:
    - Membuka undangan
    - Navbar
    - Mobile menu
    - Countdown
    - Save to Calendar
    - Map Slider
    - Gallery / Lightbox
    - RSVP / Ucapan
    - Smooth Scroll
    ============================================================ */

    document.addEventListener("DOMContentLoaded", () => {

        /* =========================================================
        KONFIGURASI
        ========================================================= */

        // Tanggal akad: 21 Februari 2027 pukul 08.00 WIB
        const WEDDING_DATE = "2027-02-21T08:00:00+07:00";


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

            openingScreen.classList.add("is-hidden");

            document.body.classList.remove("locked");

            if (siteHeader) {
                siteHeader.classList.add("visible");
            }

            setTimeout(() => {

                openingScreen.style.display = "none";

            }, 700);
        }


        /*
        * Kunci halaman ketika cover masih tampil
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
        * Tekan Enter untuk membuka undangan
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


        /*
        * Update setiap 1 detik
        */
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
                        "andi-sari-akad.ics";


                    document.body.appendChild(link);

                    link.click();

                    link.remove();


                    setTimeout(() => {

                        URL.revokeObjectURL(url);

                    }, 1000);

                }
            );

        }


        /* =========================================================
        6. MAP SLIDER
        ========================================================= */

        const mapSlider =
            document.getElementById("mapSlider");

        const mapTrack =
            document.querySelector(".map-track");

        const mapSlides =
            document.querySelectorAll(".map-slide");

        const mapDots =
            document.querySelectorAll(".map-dot");

        const mapPrev =
            document.querySelector(".map-prev");

        const mapNext =
            document.querySelector(".map-next");


        let currentMap = 0;


        /*
        * Tampilkan map tertentu
        */
        function showMap(index) {

            if (
                !mapTrack ||
                mapSlides.length === 0
            ) {

                return;

            }


            currentMap =
                (index + mapSlides.length) %
                mapSlides.length;


            /*
            * Geser track
            */
            mapTrack.style.transform =
                `translateX(-${currentMap * 100}%)`;


            /*
            * Aktifkan slide
            */
            mapSlides.forEach(
                (slide, i) => {

                    slide.classList.toggle(
                        "active",
                        i === currentMap
                    );

                }
            );


            /*
            * Update titik navigasi
            */
            mapDots.forEach(
                (dot, i) => {

                    dot.classList.toggle(
                        "active",
                        i === currentMap
                    );

                    dot.setAttribute(
                        "aria-current",
                        i === currentMap
                            ? "true"
                            : "false"
                    );

                }
            );

        }


        /*
        * Tombol sebelumnya
        */
        if (mapPrev) {

            mapPrev.addEventListener(
                "click",
                () => {

                    showMap(
                        currentMap - 1
                    );

                }
            );

        }


        /*
        * Tombol berikutnya
        */
        if (mapNext) {

            mapNext.addEventListener(
                "click",
                () => {

                    showMap(
                        currentMap + 1
                    );

                }
            );

        }


        /*
        * Tombol titik / indicator
        */
        mapDots.forEach(
            (dot, index) => {

                dot.addEventListener(
                    "click",
                    () => {

                        showMap(index);

                    }
                );

            }
        );


        /*
        * Inisialisasi map pertama
        */
        if (mapSlides.length > 0) {

            showMap(0);

        }


        /* =========================================================
        MAP SLIDER — SWIPE / TOUCH
        ========================================================= */

        let touchStartX = 0;
        let touchEndX = 0;


        if (mapSlider) {

            mapSlider.addEventListener(
                "touchstart",
                (event) => {

                    touchStartX =
                        event.changedTouches[0].clientX;

                },
                {
                    passive: true
                }
            );


            mapSlider.addEventListener(
                "touchend",
                (event) => {

                    touchEndX =
                        event.changedTouches[0].clientX;


                    const swipeDistance =
                        touchStartX - touchEndX;


                    /*
                    * Swipe ke kiri
                    */
                    if (swipeDistance > 50) {

                        showMap(
                            currentMap + 1
                        );

                    }


                    /*
                    * Swipe ke kanan
                    */
                    if (swipeDistance < -50) {

                        showMap(
                            currentMap - 1
                        );

                    }

                },
                {
                    passive: true
                }
            );

        }


        /*
        * Auto slide setiap 6 detik
        *
        * Hanya aktif kalau ada lebih dari
        * satu lokasi.
        */
        if (mapSlides.length > 1) {

            setInterval(
                () => {

                    showMap(
                        currentMap + 1
                    );

                },
                6000
            );

        }


        /* =========================================================
        7. GALERI / LIGHTBOX
        ========================================================= */

        const galleryItems =
            document.querySelectorAll(
                ".gallery-item"
            );


        if (
            lightbox &&
            lightboxImage &&
            galleryItems.length > 0
        ) {

            galleryItems.forEach(
                (item) => {

                    /*
                    * Placeholder gallery jangan dibuka
                    */
                    if (
                        item.classList.contains(
                            "gallery-placeholder"
                        )
                    ) {

                        return;

                    }


                    item.addEventListener(
                        "click",
                        () => {

                            /*
                            * Ambil gambar dari data-full
                            */
                            const fullImage =
                                item.dataset.full;


                            let imageSource =
                                fullImage;


                            /*
                            * Kalau data-full tidak ada,
                            * ambil src dari img
                            */
                            if (!imageSource) {

                                const image =
                                    item.querySelector(
                                        "img"
                                    );


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

                }
            );

        }


        /* =========================================================
        8. TUTUP LIGHTBOX
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
            * Jangan unlock kalau cover masih terbuka
            */
            if (
                !openingScreen ||
                openingScreen.classList.contains(
                    "is-hidden"
                )
            ) {

                document.body.classList.remove(
                    "locked"
                );

            }

        }


        /*
        * Tombol close
        */
        if (lightboxClose) {

            lightboxClose.addEventListener(
                "click",
                closeLightbox
            );

        }


        /*
        * Klik area luar gambar
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
        * Escape untuk menutup
        */
        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape" &&
                    lightbox &&
                    lightbox.classList.contains(
                        "is-open"
                    )
                ) {

                    closeLightbox();

                }

            }
        );


        /* =========================================================
        9. RSVP / UCAPAN
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


                        if (
                            !Array.isArray(
                                previousData
                            )
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
        10. SMOOTH SCROLL
        ========================================================= */

        document
            .querySelectorAll(
                'a[href^="#"]'
            )
            .forEach(
                (link) => {

                    link.addEventListener(
                        "click",
                        (event) => {

                            const targetId =
                                link.getAttribute(
                                    "href"
                                );


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
                            * Tinggi navbar
                            */
                            const headerHeight =
                                siteHeader
                                    ? siteHeader.offsetHeight
                                    : 0;


                            const targetPosition =
                                target.getBoundingClientRect()
                                    .top +
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

                }
            );


        /* =========================================================
        11. CEK STATUS AWAL
        ========================================================= */

        if (!openingScreen) {

            document.body.classList.remove(
                "locked"
            );

        }


        if (
            openingScreen &&
            openingScreen.classList.contains(
                "is-hidden"
            ) &&
            siteHeader
        ) {

            siteHeader.classList.add(
                "visible"
            );

        }

    });